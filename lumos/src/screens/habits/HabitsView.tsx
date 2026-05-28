// src/screens/habits/HabitsView.tsx
import { Habit } from '@/src/models/Habit';
import { feedbackService } from '@/src/services/feedbackService';
import { parseISO } from 'date-fns'; // 👈 Import ajouté pour gérer la date
import { Plus } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../src/constants/Colors';
import { useHabitStore } from '../../../src/store/useHabitStore';
import { useUserStore } from '../../../src/store/useUserStore';
import { BodyText } from '../../components/atoms/Typography';
import { PaywallModal } from '../../components/organisms/PaywallModal';
import { getLogicalTodayKey } from '../../utils/dateUtils';
import { CreateHabitModal } from './components/CreateHabitModal';
import { HabitItem } from './components/HabitItem';
import { HabitsHeader } from './components/HabitsHeader';
import { HabitStatsCard } from './components/HabitStatsCard';
import { HabitTimerModal } from './components/HabitTimerModal';

export const HabitsView = () => {
    const { habits, toggleHabitCompletion, progressHabit, logs } = useHabitStore();
    const { isPremium } = useUserStore();

    const todayKey = getLogicalTodayKey();
    const [selectedDate, setSelectedDate] = useState<string>(todayKey);

    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
    const [isPaywallVisible, setPaywallVisible] = useState(false);
    const [timerData, setTimerData] = useState<{ id: string, name: string, remaining: number, color: string } | null>(null);

    // 💡 Filtrage des habitudes pour le jour sélectionné
    const displayedHabits = useMemo(() => {
        const dateObj = parseISO(selectedDate);
        const jsDay = dateObj.getDay();
        // Convertir le format JS (Dimanche = 0) au format de notre app (Dimanche = 7)
        const dayOfWeek = jsDay === 0 ? 7 : jsDay;

        return habits.filter(habit => {
            if (!habit.frequency) return true; // Sécurité si une ancienne habitude n'a pas de fréquence
            return habit.frequency.includes(dayOfWeek);
        });
    }, [habits, selectedDate]);

    // On vérifie la limite Premium sur le nombre TOTAL d'habitudes, pas juste celles du jour
    const handleAddHabitClick = () => {
        if (!isPremium && habits.length >= 3) {
            setPaywallVisible(true);
        } else {
            setHabitToEdit(null);
            setCreateModalVisible(true);
        }
    };

    // 💡 Calcul des stats basé uniquement sur les habitudes DU JOUR
    const calculateStats = () => {
        if (displayedHabits.length === 0) return { completionRate: 0, completedCount: 0 };

        let completedCount = 0;
        const dayLogs = logs[selectedDate] || {};

        displayedHabits.forEach(habit => {
            const loggedValue = dayLogs[habit.id];
            if (habit.type === 'UNIQUE' && loggedValue) {
                completedCount++;
            } else if (habit.targetValue && (loggedValue as number) >= habit.targetValue) {
                completedCount++;
            }
        });

        const completionRate = Math.round((completedCount / displayedHabits.length) * 100);
        return { completionRate, completedCount };
    };

    const { completionRate, completedCount } = calculateStats();

    return (
        <View style={styles.container}>
            <FlatList
                data={displayedHabits} // 👈 On utilise uniquement les habitudes filtrées
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <>
                        <HabitsHeader
                            selectedDate={selectedDate}
                            onChangeDate={setSelectedDate}
                        />
                        <HabitStatsCard
                            completionRate={completionRate}
                            completedCount={completedCount}
                            totalCount={displayedHabits.length} // 👈 Stats sur le total du jour
                        />
                    </>
                }
                renderItem={({ item }) => {
                    const loggedValue = (logs[selectedDate]?.[item.id] as number) || 0;
                    return (
                        <HabitItem
                            habit={item}
                            currentValue={loggedValue}
                            onToggle={() => toggleHabitCompletion(item.id, selectedDate)}
                            onProgress={(amount) => progressHabit(item.id, amount, selectedDate)}
                            onEdit={() => {
                                setHabitToEdit(item);
                                setCreateModalVisible(true);
                            }}
                            logs={logs}
                            logicalTodayKey={todayKey}
                            selectedDateKey={selectedDate}
                            onStartTimer={() => {
                                const remaining = Math.max(0, (item.targetValue || 0) - loggedValue);
                                if (remaining > 0) {
                                    setTimerData({ id: item.id, name: item.name, remaining, color: item.color || Colors.primary });
                                }
                            }}
                        />
                    );
                }}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {/* 💡 J'ai adapté le texte pour être cohérent avec le filtre par jour */}
                        <BodyText center style={{ color: Colors.textMuted, fontStyle: 'italic' }}>
                            {habits.length === 0
                                ? "Aucune habitude pour le moment. Crée ta première routine pour accumuler de la consistance."
                                : "Aucune habitude prévue pour ce jour. Profites-en pour te reposer ou crées-en une nouvelle !"}
                        </BodyText>
                    </View>
                }
                ListFooterComponent={
                    <TouchableOpacity style={styles.glassAddBtn} onPress={() => { handleAddHabitClick(); feedbackService.medium(); }} activeOpacity={0.8}>
                        <View style={styles.addIconBg}>
                            <Plus color={Colors.primary} size={20} />
                        </View>
                        <Text style={styles.addBtnText}>Nouvelle habitude</Text>
                    </TouchableOpacity>
                }
            />

            <CreateHabitModal
                isVisible={isCreateModalVisible}
                onClose={() => { setCreateModalVisible(false); setHabitToEdit(null); }}
                habitToEdit={habitToEdit}
            />
            <PaywallModal isVisible={isPaywallVisible} onClose={() => setPaywallVisible(false)} />
            <HabitTimerModal
                isVisible={timerData !== null}
                habitName={timerData?.name || ''}
                remainingMinutes={timerData?.remaining || 0}
                color={timerData?.color || Colors.primary}
                onClose={() => setTimerData(null)}
                onComplete={(minutesDone) => { if (timerData && minutesDone > 0) progressHabit(timerData.id, minutesDone, selectedDate); }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 20 },
    listContent: { paddingBottom: 120 },
    emptyContainer: { paddingVertical: 40, paddingHorizontal: 20 },

    glassAddBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    addIconBg: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(212, 175, 55, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    addBtnText: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 15 },
});