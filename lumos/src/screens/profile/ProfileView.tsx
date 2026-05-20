// src/screens/profile/ProfileView.tsx
import React, { useMemo, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PaywallModal } from '../../components/organisms/PaywallModal';
import { Colors } from '../../constants/Colors';
import { THEMES } from '../../constants/Themes';
import { useHabitStore } from '../../store/useHabitStore';
import { useJournalStore } from '../../store/useJournalStore';
import { useTaskStore } from '../../store/useTaskStore';
import { ToolModalId, useUIStore } from '../../store/useUIStore';
import { useUserStore } from '../../store/useUserStore';

import { feedbackService } from '@/src/services/feedbackService';
import { useAlertStore } from '@/src/store/useAlertStore';
import { DebugMenu } from './components/DebugMenu';
import { MoodChart } from './components/MoodChart';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileStats } from './components/ProfileStats';
import { Toolbox } from './components/Toolbox';
import { WisdomAccordion } from './components/WisdomAccordion';
import { WisdomRadarSection } from './components/WisdomRadarSection';
import { AXIS_CONFIG } from './profile.constants';

export const ProfileView = () => {
    const { lumens, streak, onboardingDay, themeLevels, isPremium, trackToolUsage } = useUserStore();
    const { tasks, totalCompletedTasks } = useTaskStore();
    const { habits, logs } = useHabitStore();
    const { openModal } = useUIStore();
    const { entries } = useJournalStore();
    const { showAlert } = useAlertStore();

    const [isPaywallVisible, setPaywallVisible] = useState(false);

    const completedTasksCount = totalCompletedTasks || tasks.filter(t => t.isCompleted).length;

    const completedHabitsCount = useMemo(() => {
        let count = 0;
        Object.keys(logs).forEach((date) => {
            const dayLogs = logs[date] || {};
            habits.forEach((habit) => {
                const val = dayLogs[habit.id];
                if (val !== undefined) {
                    if (habit.type === 'UNIQUE' && val === true) count++;
                    else if (habit.targetValue && (val as number) >= habit.targetValue) count++;
                }
            });
        });
        return count;
    }, [logs, habits]);

    const calculateAxisScore = (axisName: string) => {
        const themesInAxis = THEMES.filter(t => t.axis === axisName);
        let score = 0;
        themesInAxis.forEach(theme => {
            const levels = themeLevels[theme.dayId] || { solo: 1, social: 1 };
            score += levels.solo + levels.social;
        });
        return score;
    };

    const radarData = Object.keys(AXIS_CONFIG).map(axisKey => {
        const themesInAxis = THEMES.filter(t => t.axis === axisKey).length;
        return {
            label: AXIS_CONFIG[axisKey].label,
            value: calculateAxisScore(axisKey),
            max: themesInAxis * 10
        };
    });

    const handleToolPress = (id: ToolModalId) => {
        if (id) trackToolUsage(id);
        feedbackService.medium();
        openModal(id);
    };

    const handleSubscriptionClick = () => {
        if (isPremium) {
            showAlert(
                "Gérer l'abonnement",
                "Vous bénéficiez actuellement de Lumos Premium. Souhaitez-vous gérer votre abonnement ?",
                [
                    { text: "Retour", style: "cancel" },
                    {
                        text: "Gérer",
                        onPress: () => {
                            const url = Platform.OS === 'ios'
                                ? 'https://apps.apple.com/account/subscriptions'
                                : 'https://play.google.com/store/account/subscriptions';
                            Linking.openURL(url);
                        }
                    }
                ]
            );
        } else {
            setPaywallVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <ProfileHeader
                lumens={lumens}
                isPremium={isPremium}
                onSubscriptionClick={handleSubscriptionClick}
            />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <Text style={styles.sectionTitle}>Tableau de Bord</Text>
                <ProfileStats
                    streak={streak}
                    onboardingDay={onboardingDay}
                    completedTasksCount={completedTasksCount}
                    completedHabitsCount={completedHabitsCount}
                />

                <Text style={styles.sectionTitle}>Météo Intérieure (7 Jours)</Text>
                <View style={styles.glassCard}>
                    <MoodChart entries={entries} />
                </View>

                <WisdomRadarSection
                    isPremium={isPremium}
                    radarData={radarData}
                    onUnlockPress={() => setPaywallVisible(true)}
                />

                <Text style={styles.sectionTitle}>Sagesse Acquise</Text>
                <WisdomAccordion
                    themeLevels={themeLevels}
                    calculateAxisScore={calculateAxisScore}
                />

                <Text style={styles.sectionTitle}>Boîte à Outils</Text>
                <Toolbox
                    isPremium={isPremium}
                    onToolPress={handleToolPress}
                    onRequirePremium={() => { setPaywallVisible(true); feedbackService.medium(); }}
                />

                <DebugMenu />
                <PaywallModal isVisible={isPaywallVisible} onClose={() => setPaywallVisible(false)} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 },
    sectionTitle: { fontSize: 13, fontFamily: 'PoppinsBold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 24, marginBottom: 12, marginLeft: 4 },
    glassCard: {
        backgroundColor: 'rgba(30, 30, 30, 0.5)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        marginBottom: 20,
    }
});