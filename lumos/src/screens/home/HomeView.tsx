// src/screens/home/HomeView.tsx
import { feedbackService } from '@/src/services/feedbackService';
import { Flame, Moon, Sun, Sunrise, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { AppState, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../src/constants/Colors';
import { useDailyStore } from '../../../src/store/useDailyStore';
import { useUserStore } from '../../../src/store/useUserStore';
import { getDailyContent } from '../../../src/utils/cycleManager';
import { DailyThemeHeader } from './components/DailyThemeHeader';
import { DayExerciseBlock } from './components/DayExerciseBlock';
import { EveningBlock } from './components/EveningBlock';
import { MorningRoutine } from './components/MorningRoutine';
import { StreakModal } from './components/StreakModal';


type TimePhase = 'morning' | 'day' | 'evening';

export const HomeView = () => {
    const { lumens, onboardingDay, streak } = useUserStore();
    const { checkAndResetNewDay } = useDailyStore();
    const { theme, levels, solo, social, eveningRitual } = getDailyContent(onboardingDay);

    const [activeTab, setActiveTab] = useState<TimePhase>('morning');
    const [greeting, setGreeting] = useState("Bonjour");

    useEffect(() => {
        const initDay = () => {
            checkAndResetNewDay();
            const hour = new Date().getHours();

            // Auto-sélection de l'onglet et du message selon l'heure
            if (hour >= 5 && hour < 11) {
                setActiveTab('morning');
                setGreeting("Bonjour");
            } else if (hour >= 11 && hour < 17) {
                setActiveTab('day');
                setGreeting("Bonne journée");
            } else if (hour >= 17 && hour < 22) {
                setActiveTab('evening');
                setGreeting("Bonsoir");
            } else {
                setActiveTab('evening');
                setGreeting("Douce nuit");
            }
        };

        initDay();
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') initDay();
        });
        return () => subscription.remove();
    }, []);

    return (
        <View style={styles.container}>
            {/* 1. HEADER DYNAMIQUE */}
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.greetingText}>{greeting}</Text>
                    <Text style={styles.dayInfoText}>Jour {onboardingDay} • {theme.name}</Text>
                </View>

                {/* Badge de stats façon "Pill" iOS */}
                <View style={styles.glassPill}>
                    <View style={styles.statItem}>
                        <Flame color={Colors.error} size={14} fill={Colors.error} />
                        <Text style={styles.streakText}>{streak}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.statItem}>
                        <Zap color={Colors.primary} size={14} fill={Colors.primary} />
                        <Text style={styles.lumensText}>{lumens}</Text>
                    </View>
                </View>
            </View>

            <DailyThemeHeader theme={theme} />

            {/* 3. LE SÉLECTEUR DE PHASE (TABS GLASSMORPHISM) */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'morning' && styles.tabBtnActive]}
                    onPress={() => { setActiveTab('morning'); feedbackService.light(); }} activeOpacity={0.8}
                >
                    <Sunrise color={activeTab === 'morning' ? Colors.text : Colors.textMuted} size={18} />
                    <Text style={[styles.tabText, activeTab === 'morning' && styles.tabTextActive]}>Matin</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'day' && styles.tabBtnActive]}
                    onPress={() => { setActiveTab('day'); feedbackService.light(); }} activeOpacity={0.8}
                >
                    <Sun color={activeTab === 'day' ? Colors.text : Colors.textMuted} size={18} />
                    <Text style={[styles.tabText, activeTab === 'day' && styles.tabTextActive]}>Journée</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'evening' && styles.tabBtnActive]}
                    onPress={() => { setActiveTab('evening'); feedbackService.light(); }} activeOpacity={0.8}
                >
                    <Moon color={activeTab === 'evening' ? Colors.text : Colors.textMuted} size={18} />
                    <Text style={[styles.tabText, activeTab === 'evening' && styles.tabTextActive]}>Soir</Text>
                </TouchableOpacity>
            </View>

            {/* 4. LE CONTENU (Une seule phase affichée à la fois) */}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {activeTab === 'morning' && (
                    <View style={styles.fadeInContainer}>
                        {/* On passe une chaîne vide car le Mantra est déjà affiché en haut */}
                        <MorningRoutine mantra={theme.mantra} />
                    </View>
                )}

                {activeTab === 'day' && (
                    <View style={styles.fadeInContainer}>
                        <DayExerciseBlock theme={theme} levels={levels} solo={solo} social={social} />
                    </View>
                )}

                {activeTab === 'evening' && (
                    <View style={styles.fadeInContainer}>
                        <EveningBlock theme={theme} eveningRitual={eveningRitual} solo={solo} social={social} />
                    </View>
                )}
            </ScrollView>
            <StreakModal />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15 },
    headerTextContainer: { flex: 1, paddingRight: 10 },
    greetingText: { fontSize: 26, fontFamily: 'PoppinsBold', color: Colors.text, letterSpacing: -0.5, marginBottom: 2 },
    dayInfoText: { color: Colors.primary, fontSize: 13, fontFamily: 'PoppinsSemiBold', textTransform: 'uppercase', letterSpacing: 1 },

    // Pill Stats
    glassPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 30, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    streakText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 13, height: 18 },
    lumensText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 13, height: 18 },
    separator: { width: 1, height: 12, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginHorizontal: 10 },

    // Mantra en Héro
    mantraWrapper: { paddingHorizontal: 20, marginBottom: 20 },
    mantraGlassBox: {
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    mantraLabel: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
    mantraText: { color: Colors.text, fontSize: 18, fontFamily: 'PoppinsMedium', textAlign: 'center', lineHeight: 26 },

    // Onglets (Tabs)
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 16,
        padding: 4,
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 8 },
    tabBtnActive: { backgroundColor: 'rgba(255, 255, 255, 0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
    tabText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 13 },
    tabTextActive: { color: Colors.text },

    // Contenu
    content: { paddingHorizontal: 20, paddingBottom: 120 },
    fadeInContainer: { flex: 1 } // Optionnel: tu pourras ajouter une animation d'opacité ici plus tard si tu veux
});