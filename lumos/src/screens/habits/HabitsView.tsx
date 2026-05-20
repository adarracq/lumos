// src/screens/habits/HabitsView.tsx
import { Habit } from '@/src/models/Habit'; // 💡 Pense à importer Habit
import { feedbackService } from '@/src/services/feedbackService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Award, Plus, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../src/constants/Colors';
import { useHabitStore } from '../../../src/store/useHabitStore';
import { useUserStore } from '../../../src/store/useUserStore';
import { BodyText, Subtitle, Title } from '../../components/atoms/Typography';
import { PaywallModal } from '../../components/organisms/PaywallModal';
import { getLogicalTodayKey } from '../../utils/dateUtils';
import { CreateHabitModal } from './components/CreateHabitModal';
import { HabitItem } from './components/HabitItem';
import { HabitTimerModal } from './components/HabitTimerModal';

export const HabitsView = () => {
    const { habits, toggleHabitCompletion, progressHabit, logs } = useHabitStore();
    const { isPremium } = useUserStore();

    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null); // 💡 NOUVEAU
    const [isPaywallVisible, setPaywallVisible] = useState(false);
    const [timerData, setTimerData] = useState<{ id: string, name: string, remaining: number, color: string } | null>(null);

    const todayKey = getLogicalTodayKey();
    const todayLabel = format(new Date(), 'EEEE d MMMM', { locale: fr });

    const handleAddHabitClick = () => {
        if (!isPremium && habits.length >= 3) {
            setPaywallVisible(true);
        } else {
            setHabitToEdit(null); // On s'assure que c'est une création
            setCreateModalVisible(true);
        }
    };

    const calculateGlobalStats = () => {
        if (habits.length === 0) return { completionRate: 0, completedCount: 0 };
        let completedCount = 0;
        const todayLogs = logs[todayKey] || {};

        habits.forEach(habit => {
            const loggedValue = todayLogs[habit.id];
            if (habit.type === 'UNIQUE' && loggedValue) {
                completedCount++;
            } else if (habit.targetValue && (loggedValue as number) >= habit.targetValue) {
                completedCount++;
            }
        });
        const completionRate = Math.round((completedCount / habits.length) * 100);
        return { completionRate, completedCount };
    };

    const { completionRate, completedCount } = calculateGlobalStats();

    const renderStatsHeader = () => (
        <View style={styles.glassStatsCard}>
            <View style={styles.statItem}>
                <View style={[styles.iconBlurBg, { backgroundColor: 'rgba(212, 175, 55, 0.15)' }]}>
                    <TrendingUp color={Colors.primary} size={20} />
                </View>
                <View>
                    <Text style={styles.statValue}>{completionRate}%</Text>
                    <Text style={styles.statLabel}>Aujourd'hui</Text>
                </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
                <View style={[styles.iconBlurBg, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                    <Award color="#4CAF50" size={20} />
                </View>
                <View>
                    <Text style={styles.statValue}>{completedCount} / {habits.length}</Text>
                    <Text style={styles.statLabel}>Ancrées</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Title style={styles.mainTitle}>Habitudes</Title>
                    <Subtitle style={styles.dateText}>{todayLabel}</Subtitle>
                </View>
            </View>

            <FlatList
                data={habits}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={habits.length > 0 ? renderStatsHeader() : null}
                renderItem={({ item }) => {
                    const loggedValue = (logs[todayKey]?.[item.id] as number) || 0;
                    return (
                        <HabitItem
                            habit={item}
                            currentValue={loggedValue}
                            onToggle={() => toggleHabitCompletion(item.id)}
                            onProgress={(amount) => progressHabit(item.id, amount)}
                            onEdit={() => { // 💡 NOUVEAU
                                setHabitToEdit(item);
                                setCreateModalVisible(true);
                            }}
                            logs={logs}
                            logicalTodayKey={todayKey}
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
                        <BodyText center style={{ color: Colors.textMuted, fontStyle: 'italic' }}>
                            Aucune habitude pour le moment. Crée ta première routine pour accumuler de la consistance.
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
                habitToEdit={habitToEdit} // 💡 NOUVEAU
            />
            <PaywallModal isVisible={isPaywallVisible} onClose={() => setPaywallVisible(false)} />
            <HabitTimerModal isVisible={timerData !== null} habitName={timerData?.name || ''} remainingMinutes={timerData?.remaining || 0} color={timerData?.color || Colors.primary} onClose={() => setTimerData(null)} onComplete={(minutesDone) => { if (timerData && minutesDone > 0) progressHabit(timerData.id, minutesDone); }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 20 },
    header: { paddingTop: 60, paddingBottom: 20 },
    mainTitle: { fontSize: 32, letterSpacing: -0.5, marginBottom: 2 },
    dateText: { color: Colors.textMuted, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 },
    listContent: { paddingBottom: 120 },
    emptyContainer: { paddingVertical: 40, paddingHorizontal: 20 },

    // GLASS STATS HEADER
    glassStatsCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(30, 30, 30, 0.5)',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'space-around',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'center' },
    iconBlurBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    statValue: { fontSize: 20, fontFamily: 'PoppinsBold', color: Colors.text },
    statLabel: { fontSize: 11, color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', textTransform: 'uppercase' },
    statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255, 255, 255, 0.1)' },

    // GLASS ADD BUTTON
    glassAddBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.08)', // Fond léger doré
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)', // Bordure dorée très fine
    },
    addIconBg: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(212, 175, 55, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    addBtnText: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 15 },
});