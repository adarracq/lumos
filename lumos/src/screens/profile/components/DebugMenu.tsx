// src/screens/profile/components/DebugMenu.tsx
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { LumosButton } from '../../../components/atoms/LumosButton';
import { Colors } from '../../../constants/Colors';

import { useDailyStore } from '../../../store/useDailyStore';
import { useHabitStore } from '../../../store/useHabitStore';
import { useJournalStore } from '../../../store/useJournalStore';
import { useTaskStore } from '../../../store/useTaskStore';
import { useUserStore } from '../../../store/useUserStore';

import { Habit } from '@/src/models/Habit';
import { format, subDays } from 'date-fns';
import { getLogicalTodayKey } from '../../../utils/dateUtils';

export const DebugMenu = () => {
    const { onboardingDay, lumens, streak, streakFreezes } = useUserStore();
    const { dateKey, debugSimulateTimePassage } = useDailyStore();

    const injectScreenshotData = () => {
        Alert.alert(
            "Générer les données ?",
            "Attention : Cela va écraser toutes vos données actuelles pour les remplacer par des fausses données parfaites pour les screenshots.",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Injecter",
                    style: "destructive",
                    onPress: () => {
                        const today = getLogicalTodayKey();
                        const todayDate = new Date();

                        // 1. PROFIL & STATS (Beau radar chart, gros streak)
                        useUserStore.setState({
                            lumens: 3450,
                            streak: 42,
                            streakFreezes: 2,
                            onboardingDay: 14,
                            isPremium: true,
                            themeLevels: {
                                "1": { solo: 5, social: 3 }, // Donne du volume au radar
                                "2": { solo: 4, social: 4 },
                                "3": { solo: 3, social: 5 },
                                "4": { solo: 5, social: 2 },
                                "5": { solo: 2, social: 4 },
                            },
                            morningRoutinePreferences: ['water', 'stretching', 'focus', 'task'],
                        });

                        // 2. HABITUDES (5 habitudes avec des couleurs variées et des logs complets)
                        const h1 = { id: 'h1', name: 'Méditation', type: 'TIME' as const, targetValue: 15, icon: 'Wind', color: '#4CAF50', frequency: [0, 1, 2, 3, 4, 5, 6] } as Habit;
                        const h2 = { id: 'h2', name: 'Lecture', type: 'QUANTITY' as const, targetValue: 20, icon: 'BookOpen', color: '#009688', frequency: [1, 3, 5] } as Habit;
                        const h3 = { id: 'h3', name: 'Sport', type: 'UNIQUE' as const, icon: 'Activity', color: '#CF6679', frequency: [0, 2, 5] } as Habit;
                        const h4 = { id: 'h4', name: 'Hydratation (2L)', type: 'QUANTITY' as const, targetValue: 4, icon: 'Droplet', color: '#2196F3', frequency: [0, 1, 2, 3, 4, 5, 6] } as Habit;
                        const h5 = { id: 'h5', name: 'Espagnol', type: 'TIME' as const, targetValue: 10, icon: 'MessageCircle', color: '#9C27B0', frequency: [0, 1, 2, 3, 4] } as Habit;

                        const logs: Record<string, Record<string, number | boolean>> = {};
                        for (let i = 0; i <= 10; i++) {
                            const d = format(subDays(todayDate, i), 'yyyy-MM-dd');
                            logs[d] = {
                                'h1': i % 3 !== 0 ? 15 : 5,
                                'h2': i % 2 === 0 ? 20 : 10,
                                'h3': i % 4 !== 0,
                                'h4': i % 3 === 0 ? 3 : 4, // 3 ou 4 verres d'eau
                                'h5': i % 5 !== 0 ? 10 : 0, // Souvent fait
                            };
                        }
                        useHabitStore.setState({ habits: [h1, h2, h3, h4, h5], logs });

                        // 3. TÂCHES (Mix pour matrice Eisenhower et liste bien remplie)
                        useTaskStore.setState({
                            tasks: [
                                { id: 't1', title: 'Préparer la roadmap Q3', isCompleted: false, isImportant: true, isUrgent: true, createdAt: Date.now() },
                                { id: 't2', title: 'Réserver les billets d\'avion', isCompleted: false, isImportant: true, isUrgent: false, createdAt: Date.now() },
                                { id: 't3', title: 'Appeler le comptable', isCompleted: false, isImportant: false, isUrgent: true, createdAt: Date.now() },
                                { id: 't4', title: 'Trier les emails de la semaine', isCompleted: false, isImportant: false, isUrgent: false, createdAt: Date.now() },
                                { id: 't5', title: 'Séance Jambes / Dos', isCompleted: true, isImportant: true, isUrgent: false, createdAt: Date.now() - 86400000 },
                                { id: 't6', title: 'Acheter du pain', isCompleted: true, isImportant: false, isUrgent: true, createdAt: Date.now() - 3600000 },
                            ],
                            totalCompletedTasks: 142,
                        });

                        // 4. JOURNAL (Générer les 8 derniers jours pour une belle météo intérieure)
                        const moodHistory = ['PEACEFUL', 'RADIANT', 'NEUTRAL', 'PEACEFUL', 'RADIANT', 'EXHAUSTED', 'PEACEFUL', 'RADIANT'];
                        const journalEntries = moodHistory.map((mood, index) => {
                            let title = `Bilan J${14 - index} : L'Alignement`;
                            let content = "Une très bonne journée, j'ai réussi à tenir mes engagements et mon exercice social a eu un vrai impact sur mon entourage.";

                            if (index === 0) {
                                title = 'Brain Dump : Idées Vrac';
                                content = "Il faut absolument que je pense à relancer l'agence de design la semaine prochaine...";
                            } else if (index === 5) {
                                content = "Beaucoup de fatigue aujourd'hui, j'ai eu du mal à rester concentré. Je dois dormir plus tôt.";
                            }

                            return {
                                id: `j${index}`,
                                title: title,
                                content: content,
                                date: format(subDays(todayDate, index), 'yyyy-MM-dd'),
                                isFavorite: index === 1 || index === 4,
                                mood: mood as any
                            };
                        });

                        useJournalStore.setState({ entries: journalEntries });

                        // 5. JOURNÉE EN COURS
                        useDailyStore.setState({
                            morningRoutine: { water: true, stretching: true, breathing: false, mantra: false, smile: false, task: true, shower: false },
                            morningFocusCompleted: false,
                            mainTaskId: 't1',
                            dayExerciseCompleted: true,
                            selectedExerciseType: 'SOLO'
                        });

                        Alert.alert("Succès", "Données générées ! Vous pouvez prendre vos screenshots.");
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🛠 MODE DÉVELOPPEUR</Text>

            <View style={styles.statBox}>
                <Text style={styles.text}>Jour Onboarding : {onboardingDay}</Text>
                <Text style={styles.text}>Streak actuel : 🔥 {streak}</Text>
                <Text style={styles.text}>Freezes dispos : ❄️ {streakFreezes}</Text>
                <Text style={styles.text}>Clé Date : {dateKey}</Text>
            </View>

            <View style={styles.row}>
                <LumosButton
                    title="Simuler Demain (+1j)"
                    style={styles.smallBtn}
                    onPress={() => debugSimulateTimePassage(1)}
                />
                <LumosButton
                    title="Manquer 1 jour (+2j)"
                    style={styles.smallBtn}
                    variant="outline"
                    onPress={() => debugSimulateTimePassage(2)}
                />
            </View>

            {/* LE BOUTON MAGIQUE POUR LES SCREENSHOTS */}
            <LumosButton
                title="✨ Générer Données (Screenshots)"
                style={{ marginTop: 20 }}
                color={Colors.primary}
                onPress={injectScreenshotData}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: Colors.surface, borderRadius: 16, marginTop: 20, marginBottom: 40 },
    title: { color: Colors.primary, fontWeight: 'bold', marginBottom: 15 },
    statBox: { marginBottom: 15 },
    text: { color: '#FFF', fontSize: 14, marginBottom: 5 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    smallBtn: { width: '48%' }
});