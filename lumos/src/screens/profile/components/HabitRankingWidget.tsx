// src/screens/profile/components/HabitRankingWidget.tsx
import { Colors } from '@/src/constants/Colors';
import { Activity, CheckCircle2, Medal, Target } from 'lucide-react-native';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChartDataPoint } from './TrendBarChart';

interface RankedHabit {
    id: string;
    name: string;
    rate: number;
}

interface HabitRankingWidgetProps {
    rankedHabits: RankedHabit[];
    average: number;
    totalCompleted: number;
    chartData: ChartDataPoint[];
    filter: string;
}

export const HabitRankingWidget = ({ rankedHabits, average, totalCompleted, chartData, filter }: HabitRankingWidgetProps) => {
    // 💡 Référence pour le graphique en barres
    const scrollViewRef = useRef<ScrollView>(null);
    const isCompact = chartData.length <= 7;

    const subtitle = filter === 'WEEK' ? 'Sur les 7 derniers jours' :
        filter === 'MONTH' ? 'Sur les 30 derniers jours' :
            filter === 'YEAR' ? 'Sur la dernière année' : 'Depuis ton premier jour';

    return (
        <View style={styles.container}>
            {/* EN-TÊTE */}
            <View style={styles.header}>
                <View style={styles.headerIconBg}>
                    <Activity color={Colors.primary} size={20} />
                </View>
                <View>
                    <Text style={styles.title}>Assiduité Habitudes</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            </View>

            {/* GRAPHIQUE EN BARRES */}
            <View style={styles.chartWrapper}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onContentSizeChange={() => {
                        if (!isCompact) {
                            scrollViewRef.current?.scrollToEnd({ animated: false });
                        }
                    }}
                    contentContainerStyle={[
                        styles.chartScroll,
                        isCompact && styles.chartScrollCompact
                    ]}
                >
                    {chartData.map((day) => {
                        const barHeight = day.heightPercent === 0 ? 0 : Math.max(10, day.heightPercent);
                        return (
                            <View key={day.id} style={styles.barColumn}>
                                <View style={styles.barBackground}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            { height: `${barHeight}%`, backgroundColor: day.color },
                                            day.isEmpty && { backgroundColor: 'transparent' }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.dayText, day.isToday && styles.dayTextToday]}>
                                    {day.label}
                                </Text>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>

            {/* PILULES DE STATS (Ex-Average Box) */}
            <View style={styles.statsRow}>
                <View style={styles.statPill}>
                    <Target color={Colors.textMuted} size={18} />
                    <View style={styles.statValueContainer}>
                        <Text style={styles.statLabel}>Taux Moyen</Text>
                        <Text style={styles.statValue}>{average}%</Text>
                    </View>
                </View>
                <View style={styles.statPill}>
                    <CheckCircle2 color={Colors.primary} size={18} />
                    <View style={styles.statValueContainer}>
                        <Text style={styles.statLabel}>Validées</Text>
                        <Text style={styles.statValue}>{totalCompleted}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            {/* PALMARÈS */}
            <View style={styles.listContainer}>
                {rankedHabits.length === 0 ? (
                    <Text style={styles.emptyText}>Aucune habitude planifiée pour cette période.</Text>
                ) : (
                    rankedHabits.map((habit, index) => {
                        let icon = null;
                        let rankColor = Colors.textMuted;

                        if (index === 0) { icon = <Medal color="#FFD700" size={18} />; rankColor = "#FFD700"; }
                        else if (index === 1) { icon = <Medal color="#C0C0C0" size={18} />; rankColor = "#C0C0C0"; }
                        else if (index === 2) { icon = <Medal color="#CD7F32" size={18} />; rankColor = "#CD7F32"; }

                        const rateColor = habit.rate >= 80 ? '#4CAF50' : habit.rate >= 50 ? Colors.primary : Colors.textMuted;

                        return (
                            <View key={habit.id} style={styles.habitRow}>
                                <View style={styles.habitRowLeft}>
                                    <Text style={[styles.rank, { color: rankColor }]}>{index + 1}</Text>
                                    <Text style={styles.habitName} numberOfLines={1}>{habit.name}</Text>
                                </View>
                                <View style={styles.habitRowRight}>
                                    <Text style={[styles.habitRate, { color: rateColor }]}>
                                        {habit.rate}%
                                    </Text>
                                    <View style={styles.iconContainer}>
                                        {icon}
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
    },
    // En-tête
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
    headerIconBg: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(212, 175, 55, 0.08)', justifyContent: 'center', alignItems: 'center' },
    title: { color: Colors.text, fontSize: 16, fontFamily: 'PoppinsSemiBold', marginBottom: 2 },
    subtitle: { color: Colors.textMuted, fontSize: 12, fontFamily: 'InterRegular' },

    // Graphique
    chartWrapper: { height: 110, marginBottom: 20 },
    chartScroll: { alignItems: 'flex-end', gap: 12, paddingHorizontal: 4 },
    chartScrollCompact: { flexGrow: 1, justifyContent: 'space-between', gap: 0, paddingHorizontal: 6 },
    barColumn: { alignItems: 'center', gap: 10, width: 28 },
    barBackground: { width: 14, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
    barFill: { width: '100%', borderRadius: 8 },
    dayText: { color: Colors.textMuted, fontSize: 11, fontFamily: 'InterMedium' },
    dayTextToday: { color: Colors.primary, fontFamily: 'PoppinsBold' },

    // Pilules Stats
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    statPill: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', gap: 12 },
    statValueContainer: { flex: 1 },
    statLabel: { color: Colors.textMuted, fontSize: 11, fontFamily: 'InterRegular', marginBottom: 2 },
    statValue: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsBold' },

    divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginBottom: 20 },

    // Palmarès
    rankingTitle: { color: Colors.textMuted, fontSize: 12, fontFamily: 'PoppinsSemiBold', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 },
    listContainer: { gap: 8 },
    habitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: 12, borderRadius: 12 },
    habitRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    rank: { fontFamily: 'PoppinsBold', fontSize: 14, width: 20, textAlign: 'center' },
    habitName: { color: Colors.text, fontFamily: 'InterMedium', fontSize: 14, flex: 1 },
    habitRowRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    habitRate: { fontFamily: 'PoppinsBold', fontSize: 14 },
    iconContainer: { width: 20, alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: Colors.textMuted, textAlign: 'center', fontFamily: 'InterMedium', padding: 10 },
});