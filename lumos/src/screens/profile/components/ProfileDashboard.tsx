// src/screens/profile/components/ProfileDashboard.tsx
import { Colors } from '@/src/constants/Colors';
import { useHabitStore } from '@/src/store/useHabitStore';
import { useJournalStore } from '@/src/store/useJournalStore';
import { useTaskStore } from '@/src/store/useTaskStore';
import { useUserStore } from '@/src/store/useUserStore';
import { format, isAfter, isToday, parseISO, subDays, subMonths, subYears } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Brain, Cloud, CloudRain, Compass, Flame, Sparkles, Sun } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Sous-composants
import { HabitRankingWidget } from './HabitRankingWidget';
import { MainStatsGrid } from './MainStatsGrid';
import { TopToolsWidget } from './TopToolsWidget';
import { ChartDataPoint, TrendBarChart } from './TrendBarChart';

type TimeFilter = 'WEEK' | 'MONTH' | 'YEAR' | 'ALL';

export const ProfileDashboard = () => {
    const [filter, setFilter] = useState<TimeFilter>('WEEK');

    const { tasks, totalCompletedTasks } = useTaskStore();
    const { habits, logs } = useHabitStore();
    const { entries } = useJournalStore();
    const { streak, onboardingDay, toolUsage } = useUserStore();

    // Helpers UI Météo
    const getMoodData = (moodId: string | null) => {
        switch (moodId) {
            case 'RADIANT': return { label: 'Rayonnant', icon: Sparkles, color: Colors.primary, height: 100 };
            case 'PEACEFUL': return { label: 'Paisible', icon: Sun, color: '#4CAF50', height: 75 };
            case 'NEUTRAL': return { label: 'Neutre', icon: Cloud, color: Colors.textMuted, height: 50 };
            case 'EXHAUSTED': return { label: 'Épuisé', icon: CloudRain, color: '#CF6679', height: 25 };
            default: return { label: 'Inconnu', icon: Cloud, color: 'rgba(255,255,255,0.1)', height: 0 };
        }
    };

    // --- MOTEUR DE CALCUL ---
    const stats = useMemo(() => {
        const now = new Date();
        let startDate = new Date(0); // Par défaut: depuis toujours

        if (filter === 'WEEK') startDate = subDays(now, 7);
        if (filter === 'MONTH') startDate = subMonths(now, 1);
        if (filter === 'YEAR') startDate = subYears(now, 1);

        // 1. Tâches Globales
        const periodTasks = tasks.filter(t => t.isCompleted && t.createdAt && isAfter(new Date(t.createdAt), startDate));
        const completedTasksCount = filter === 'ALL' ? (totalCompletedTasks || periodTasks.length) : periodTasks.length;

        // 2. Grille de base (Habitudes ancrées et Bilans rédigés)
        let totalHabitCompletions = 0;
        Object.entries(logs).forEach(([dateStr, dayLogs]) => {
            if (isAfter(parseISO(dateStr), startDate)) {
                habits.forEach(habit => {
                    const val = dayLogs[habit.id];
                    if (val !== undefined && (val === true || (habit.targetValue && (val as number) >= habit.targetValue))) {
                        totalHabitCompletions++;
                    }
                });
            }
        });

        const periodEntries = entries.filter(e => isAfter(parseISO(e.date), startDate));

        // 3. Météo Dominante Globale
        const moodCounts: Record<string, number> = { RADIANT: 0, PEACEFUL: 0, NEUTRAL: 0, EXHAUSTED: 0 };
        periodEntries.forEach(e => { if (e.mood && moodCounts[e.mood] !== undefined) moodCounts[e.mood]++; });
        let dominantMood = 'Aucune';
        let maxMoodCount = 0;
        Object.entries(moodCounts).forEach(([mood, count]) => {
            if (count > maxMoodCount) { maxMoodCount = count; dominantMood = mood; }
        });

        // 4. Données pour les Graphiques en Barres (MAX 30 Jours pour fluidité visuelle, même si "ALL" est coché)
        const chartDaysCount = filter === 'WEEK' ? 7 : 30;
        const habitChartData: ChartDataPoint[] = [];
        const moodChartData: ChartDataPoint[] = [];

        let validHabitDays = 0;
        let totalHabitRate = 0;

        for (let i = chartDaysCount - 1; i >= 0; i--) {
            const date = subDays(now, i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayLabel = format(date, 'EEEEEE', { locale: fr }).toUpperCase().substring(0, 1);
            const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();
            const isDayToday = isToday(date);

            // --- Calcul Barre Habitude ---
            const scheduledHabits = habits.filter(h => h.frequency?.includes(dayOfWeek));
            let completedCount = 0;
            const dayLogs = logs[dateStr] || {};
            scheduledHabits.forEach((habit) => {
                const val = dayLogs[habit.id];
                if (val !== undefined && (val === true || (habit.targetValue && (val as number) >= habit.targetValue))) {
                    completedCount++;
                }
            });
            const completionRate = scheduledHabits.length > 0 ? (completedCount / scheduledHabits.length) : 0;
            if (scheduledHabits.length > 0) { totalHabitRate += completionRate; validHabitDays++; }

            habitChartData.push({
                id: `hab-${dateStr}`, label: dayLabel, isToday: isDayToday, isEmpty: scheduledHabits.length === 0,
                heightPercent: completionRate * 100,
                color: Colors.primary + Math.round(completionRate * 256 - 1).toString(16)
            });

            // --- Calcul Barre Météo ---
            const entry = entries.find(e => e.date === dateStr);
            const moodInfo = getMoodData(entry?.mood || null);

            moodChartData.push({
                id: `mood-${dateStr}`, label: dayLabel, isToday: isDayToday, isEmpty: !entry,
                heightPercent: moodInfo.height,
                color: moodInfo.color
            });
        }

        const averageHabitRate = validHabitDays > 0 ? Math.round((totalHabitRate / validHabitDays) * 100) : 0;

        // 5. Palmarès des Habitudes (Taux de complétion individuel)
        // 💡 ICI ON UTILISE `onboardingDay` POUR LE FILTRE "ALL" !
        const daysToCheck = filter === 'WEEK' ? 7 :
            filter === 'MONTH' ? 30 :
                filter === 'YEAR' ? 365 :
                    Math.max(1, onboardingDay); // Minimum 1 jour pour éviter la division par 0

        const rankedHabits = habits.map(habit => {
            let scheduled = 0;
            let completed = 0;

            for (let i = 0; i < daysToCheck; i++) {
                const date = subDays(now, i);
                const dateStr = format(date, 'yyyy-MM-dd');
                const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay();

                if (habit.frequency?.includes(dayOfWeek)) {
                    scheduled++;
                    const val = logs[dateStr]?.[habit.id];
                    if (val !== undefined && (val === true || (habit.targetValue && (val as number) >= habit.targetValue))) {
                        completed++;
                    }
                }
            }
            const rate = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
            return { id: habit.id, name: habit.name, rate, scheduled };
        })
            .filter(h => h.scheduled > 0)
            .sort((a, b) => b.rate - a.rate);

        const overallAverageRate = rankedHabits.length > 0
            ? Math.round(rankedHabits.reduce((acc, h) => acc + h.rate, 0) / rankedHabits.length)
            : 0;

        // 6. Top Outils
        const topTools = Object.entries(toolUsage || {})
            .map(([id, count]) => ({ id, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        return {
            completedTasksCount,
            totalHabitCompletions,
            journalCount: periodEntries.length,
            dominantMood: maxMoodCount > 0 ? dominantMood : null,
            habitChartData,
            averageHabitRate,
            moodChartData,
            rankedHabits,
            overallAverageRate,
            topTools
        };
    }, [filter, tasks, totalCompletedTasks, habits, logs, entries, toolUsage, onboardingDay]);

    const currentMood = getMoodData(stats.dominantMood);

    // Ajustement des sous-titres dynamiques
    const chartSubtitle = filter === 'WEEK' ? 'Vos 7 derniers jours' : 'Tendance des 30 derniers jours';

    return (
        <View style={styles.container}>

            {/* HERO STATS */}
            <View style={styles.heroRow}>
                <View style={styles.heroCard}>
                    <Compass color={Colors.primary} size={24} style={styles.heroIcon} />
                    <View>
                        <Text style={styles.heroValue}>Jour {onboardingDay}</Text>
                        <Text style={styles.heroLabel}>D'exploration</Text>
                    </View>
                </View>
                <View style={styles.heroCard}>
                    <Flame color="#FF9800" size={24} style={styles.heroIcon} />
                    <View>
                        <Text style={styles.heroValue}>{streak} Jours</Text>
                        <Text style={styles.heroLabel}>Série active</Text>
                    </View>
                </View>
            </View>

            {/* SÉLECTEUR DE TEMPS */}
            <View style={styles.segmentedControl}>
                {[
                    { id: 'WEEK', label: '7J' },
                    { id: 'MONTH', label: '30J' },
                    { id: 'YEAR', label: '1AN' },
                    { id: 'ALL', label: 'TOUT' }
                ].map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        style={[styles.segmentBtn, filter === tab.id && styles.segmentBtnActive]}
                        onPress={() => setFilter(tab.id as TimeFilter)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.segmentText, filter === tab.id && styles.segmentTextActive]}>{tab.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* GRILLE 2x2 */}
            <MainStatsGrid
                tasksCount={stats.completedTasksCount}
                habitsCount={stats.totalHabitCompletions}
                journalCount={stats.journalCount}
                moodData={currentMood}
            />


            {/* WIDGET FUSIONNÉ : GRAPHIQUE + PALMARÈS */}
            <HabitRankingWidget
                rankedHabits={stats.rankedHabits}
                average={stats.overallAverageRate}
                totalCompleted={stats.totalHabitCompletions}
                chartData={stats.habitChartData}
                filter={filter}
            />

            {/* GRAPHIQUE BARRES : MÉTÉO INTÉRIEURE */}
            <TrendBarChart
                title="Météo Intérieure"
                subtitle={chartSubtitle}
                headerIcon={Brain}
                data={stats.moodChartData}
                stats={[
                    { label: 'Dominante', value: currentMood.label, icon: currentMood.icon, color: currentMood.color }
                ]}
            />

            {/* TOP 3 OUTILS */}
            <TopToolsWidget tools={stats.topTools} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 20 },

    heroRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    heroCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', flexDirection: 'row', alignItems: 'center', gap: 14 },
    heroIcon: { opacity: 0.9 },
    heroValue: { color: Colors.text, fontSize: 18, fontFamily: 'PoppinsBold', lineHeight: 24 },
    heroLabel: { color: Colors.textMuted, fontSize: 11, fontFamily: 'PoppinsSemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },

    segmentedControl: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 14, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.04)' },
    segmentBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
    segmentBtnActive: { backgroundColor: 'rgba(255, 255, 255, 0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
    segmentText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 12 },
    segmentTextActive: { color: Colors.text },
});