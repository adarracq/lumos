// src/screens/profile/ProfileView.tsx
import React, { useMemo, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PaywallModal } from '../../components/organisms/PaywallModal';
import { Colors } from '../../constants/Colors';
import { THEMES } from '../../constants/Themes';
import { useHabitStore } from '../../store/useHabitStore';
import { useJournalStore } from '../../store/useJournalStore';
import { useTaskStore } from '../../store/useTaskStore';
import { ToolModalId, useUIStore } from '../../store/useUIStore';
import { useUserStore } from '../../store/useUserStore';

import { LumosButton } from '@/src/components/atoms/LumosButton';
import { JournalVaultModal } from '@/src/components/organisms/JournalVaultModal';
import { feedbackService } from '@/src/services/feedbackService';
import { useAlertStore } from '@/src/store/useAlertStore';
import { BarChart2, BookOpen, Mail, Settings, Wrench } from 'lucide-react-native';
import { DataBackupSettings } from './components/DataBackupSettings';
import { NotificationSettings } from './components/NotificationSettings';
import { ProfileDashboard } from './components/ProfileDashboard';
import { ProfileHeader } from './components/ProfileHeader';
import { Toolbox } from './components/Toolbox';
import { VaultWidget } from './components/VaultWidget';
import { WisdomAccordion } from './components/WisdomAccordion';
import { WisdomRadarSection } from './components/WisdomRadarSection';
import { AXIS_CONFIG } from './profile.constants';

type TabType = 'STATS' | 'WISDOM' | 'TOOLS' | 'SETTINGS';

export const ProfileView = () => {
    const { lumens, streak, onboardingDay, themeLevels, isPremium, trackToolUsage } = useUserStore();
    const { tasks, totalCompletedTasks } = useTaskStore();
    const { habits, logs } = useHabitStore();
    const { openModal } = useUIStore();
    const { entries } = useJournalStore();
    const { showAlert } = useAlertStore();

    const [activeTab, setActiveTab] = useState<TabType>('STATS');
    const [isPaywallVisible, setPaywallVisible] = useState(false);
    const [isVaultVisible, setVaultVisible] = useState(false);

    // --- CALCULS (Conservés) ---
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

    // --- ACTIONS ---
    const handleToolPress = (id: ToolModalId) => {
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

    const handleSendFeedback = () => {
        const email = 'lumos.app.mobile@gmail.com';
        const subject = 'Lumos Feedbacks';
        const body = 'Bonjour, voici quelques retours sur l\'application...';

        Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
            .catch(() => showAlert("Erreur", "Impossible d'ouvrir l'application mail."));
    };

    // --- RENDUS DES ONGLETS ---
    const renderContent = () => {
        switch (activeTab) {
            case 'STATS':
                return (
                    <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>Tableau de Bord</Text>

                        <ProfileDashboard />

                    </View>
                );
            case 'WISDOM':
                return (
                    <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>Sagesse Acquise</Text>
                        <VaultWidget onPress={() => {
                            feedbackService.medium();
                            setVaultVisible(true);
                        }} />
                        <WisdomRadarSection
                            isPremium={isPremium}
                            radarData={radarData}
                            onUnlockPress={() => setPaywallVisible(true)}
                        />
                        <WisdomAccordion
                            themeLevels={themeLevels}
                            calculateAxisScore={calculateAxisScore}
                        />
                    </View>
                );
            case 'TOOLS':
                return (
                    <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>Boîte à Outils</Text>
                        <Toolbox
                            isPremium={isPremium}
                            onToolPress={handleToolPress}
                            onRequirePremium={() => { setPaywallVisible(true); feedbackService.medium(); }}
                        />
                    </View>
                );
            case 'SETTINGS':
                return (
                    <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>Préférences</Text>
                        <NotificationSettings />
                        <Text style={styles.sectionTitle}>Données et Sauvegardes</Text>
                        <DataBackupSettings />

                        <View style={styles.feedbackCard}>
                            <View style={styles.feedbackIconWrapper}>
                                <Mail color={Colors.textMuted} size={20} />
                            </View>
                            <Text style={styles.feedbackTitle}>Un avis ? Un bug ?</Text>
                            <Text style={styles.feedbackText}>
                                Lumos évolue grâce à vous. N'hésitez pas à nous faire part de vos idées ou des problèmes rencontrés.
                            </Text>

                            <LumosButton
                                title="Envoyer un message"
                                variant="outline"
                                onPress={handleSendFeedback}
                                style={{ height: 46, marginTop: 4 }}
                            />
                        </View>

                        {/*<DebugMenu />*/}
                    </View>
                );
        }
    };

    const TABS: { id: TabType; label: string; icon: any }[] = [
        { id: 'STATS', label: 'Stats', icon: BarChart2 },
        { id: 'WISDOM', label: 'Sagesse', icon: BookOpen },
        { id: 'TOOLS', label: 'Outils', icon: Wrench },
        { id: 'SETTINGS', label: 'Réglages', icon: Settings },
    ];

    return (
        <View style={styles.container}>
            {/* EN-TÊTE FIXE (Nom, Lumens, Badge) */}
            <ProfileHeader
                lumens={lumens}
                isPremium={isPremium}
                onSubscriptionClick={handleSubscriptionClick}
            />

            {/* NAVIGATION INTERNE (Pills) */}
            <View style={styles.tabBarContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarScroll}>
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <TouchableOpacity
                                key={tab.id}
                                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                                onPress={() => {
                                    setActiveTab(tab.id);
                                    feedbackService.light();
                                }}
                            >
                                <Icon color={isActive ? Colors.text : Colors.textMuted} size={16} />
                                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* CONTENU SCROLLABLE DYNAMIQUE */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {renderContent()}
            </ScrollView>

            <PaywallModal isVisible={isPaywallVisible} onClose={() => setPaywallVisible(false)} />
            <JournalVaultModal isVisible={isVaultVisible} onClose={() => setVaultVisible(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    // Nouveaux styles pour la navigation par onglets
    tabBarContainer: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
        backgroundColor: Colors.background // Assure que le fond cache bien le reste
    },
    tabBarScroll: {
        paddingHorizontal: 20,
        gap: 10
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        gap: 8,
    },
    tabButtonActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.15)',
    },
    tabButtonText: {
        color: Colors.textMuted,
        fontFamily: 'PoppinsMedium',
        fontSize: 13,
    },
    tabButtonTextActive: {
        color: Colors.text,
        fontFamily: 'PoppinsSemiBold',
    },

    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 },
    tabContent: { flex: 1 }, // Pour envelopper le contenu de chaque onglet

    sectionTitle: { fontSize: 13, fontFamily: 'PoppinsBold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 16, marginBottom: 12, marginLeft: 4 },

    // Styles existants
    glassCard: {
        backgroundColor: 'rgba(30, 30, 30, 0.5)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        marginBottom: 20,
    },
    feedbackCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
        marginTop: 16,
        marginBottom: 10,
        alignItems: 'center',
    },
    feedbackIconWrapper: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    feedbackTitle: {
        color: Colors.text,
        fontSize: 16,
        fontFamily: 'PoppinsSemiBold',
        marginBottom: 4,
    },
    feedbackText: {
        color: Colors.textMuted,
        fontSize: 12,
        fontFamily: 'InterRegular',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 18,
        paddingHorizontal: 10,
    },
});