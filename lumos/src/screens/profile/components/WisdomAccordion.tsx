// src/screens/profile/components/WisdomAccordion.tsx
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { feedbackService } from '@/src/services/feedbackService';
import { CheckCircle2, ChevronDown, ChevronUp, Circle, Lock, User, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { EXERCISES } from '../../../constants/Exercises';
import { THEMES, ThemeDef } from '../../../constants/Themes';
import { useUserStore } from '../../../store/useUserStore';
import { AXIS_CONFIG } from '../profile.constants';

interface WisdomAccordionProps {
    themeLevels: Record<string, { solo: number; social: number }>;
    calculateAxisScore: (axisName: string) => number;
}

export const WisdomAccordion = ({ themeLevels, calculateAxisScore }: WisdomAccordionProps) => {
    const onboardingDay = useUserStore(state => state.onboardingDay);
    const [expandedAxis, setExpandedAxis] = useState<string | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<ThemeDef | null>(null);

    const toggleAxis = (axisKey: string) => setExpandedAxis(expandedAxis === axisKey ? null : axisKey);

    // Fonction pour générer la liste des 5 niveaux d'exercices (Solo ou Social)
    const renderExerciseTrack = (type: 'solo' | 'social', currentLevel: number) => {
        if (!selectedTheme) return null;

        const themeContent = EXERCISES.find(e => e.themeId === selectedTheme.dayId);
        const daysUntil = selectedTheme.dayId - onboardingDay;
        const exercises = [];

        for (let i = 1; i <= 5; i++) {
            const isCompleted = i < currentLevel;
            const isActive = i === currentLevel;
            const isLocked = i > currentLevel;

            // Récupération de l'intitulé réel de l'exercice
            const exerciseDef = themeContent?.[type]?.find(e => e.level === i);
            const actionText = exerciseDef?.action || "Défi inconnu.";

            let displayText = "";
            if (isCompleted) {
                displayText = actionText; // Exercice terminé : on affiche ce qu'il a accompli
            } else if (isActive) {
                if (daysUntil > 0) {
                    // Thème du futur
                    displayText = `Ce défi sera débloqué dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}.`;
                } else {
                    // Thème du jour ou passé, prêt à être accompli
                    displayText = actionText;
                }
            } else {
                displayText = "Défi verrouillé.";
            }

            exercises.push(
                <View
                    key={i}
                    style={[
                        styles.exerciseRow,
                        isActive && styles.exerciseRowActive,
                        isLocked && styles.exerciseRowLocked
                    ]}
                >
                    <View style={styles.exerciseIconContainer}>
                        {isCompleted ? (
                            <CheckCircle2 color="#4CAF50" size={18} />
                        ) : isLocked ? (
                            <Lock color="rgba(255,255,255,0.25)" size={16} />
                        ) : (
                            <Circle color={Colors.primary} size={18} />
                        )}
                    </View>
                    <View style={styles.exerciseContent}>
                        <Text style={[
                            styles.exerciseLevelTitle,
                            isCompleted && styles.textCompleted,
                            isLocked && styles.textLocked
                        ]}>
                            Niveau {i} {isActive && daysUntil <= 0 && <Text style={styles.activeLabel}>• En cours</Text>}
                        </Text>
                        <Text style={[styles.exerciseActionText, isLocked && styles.textLocked]}>
                            {displayText}
                        </Text>
                    </View>
                </View>
            );
        }
        return exercises;
    };

    const activeLevels = selectedTheme ? (themeLevels[selectedTheme.dayId] || { solo: 1, social: 1 }) : { solo: 1, social: 1 };

    return (
        <View style={[styles.glassCard, { padding: 0, overflow: 'hidden' }]}>
            {Object.keys(AXIS_CONFIG).map((axisKey) => {
                const axis = AXIS_CONFIG[axisKey];
                const axisThemes = THEMES.filter(t => t.axis === axisKey);
                const totalScore = calculateAxisScore(axisKey);
                const isOpen = expandedAxis === axisKey;

                const themeCount = axisThemes.length;
                const minScore = themeCount * 2;
                const maxScore = themeCount * 10;

                const progress = Math.max(0, totalScore - minScore);
                const totalToGain = Math.max(1, maxScore - minScore);
                const masteryPercent = Math.min(100, Math.floor((progress / totalToGain) * 100));

                return (
                    <View key={axisKey} style={[styles.axisAccordion, isOpen && styles.axisAccordionOpen]}>
                        <TouchableOpacity style={styles.axisHeader} onPress={() => { toggleAxis(axisKey); feedbackService.light(); }} activeOpacity={0.8}>
                            <View style={styles.axisHeaderLeft}>
                                <View style={[styles.axisIconBg, { backgroundColor: `${axis.color}15` }]}>
                                    <axis.icon color={axis.color} size={20} />
                                </View>
                                <View>
                                    <Text style={styles.axisTitle}>{axis.label}</Text>
                                    <Text style={styles.axisSubtitle}>Maîtrise : {masteryPercent}%</Text>
                                </View>
                            </View>
                            {isOpen ? <ChevronUp color={Colors.textMuted} size={18} /> : <ChevronDown color={Colors.textMuted} size={18} />}
                        </TouchableOpacity>

                        {isOpen && (
                            <View style={styles.axisContent}>
                                {axisThemes.map((theme) => {
                                    const levels = themeLevels[theme.dayId] || { solo: 1, social: 1 };
                                    return (
                                        <TouchableOpacity
                                            key={theme.dayId}
                                            style={styles.themeRowClickable}
                                            onPress={() => { setSelectedTheme(theme); feedbackService.light(); }}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.themeLeftBlock}>
                                                <View style={styles.dayBadge}>
                                                    <Text style={styles.dayBadgeText}>J{theme.dayId}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.themeNameText}>{theme.name}</Text>
                                                    <Text style={styles.themeMantraText} numberOfLines={1}>« {theme.mantra} »</Text>
                                                </View>
                                            </View>

                                            <View style={styles.themeRightBlock}>
                                                <View style={styles.trackBadge}>
                                                    <User color={Colors.text} size={11} />
                                                    <Text style={styles.trackBadgeText}>Lvl {levels.solo}</Text>
                                                </View>
                                                <View style={styles.trackBadge}>
                                                    <Users color={Colors.text} size={11} />
                                                    <Text style={styles.trackBadgeText}>Lvl {levels.social}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                );
            })}

            {/* MODAL DE DÉTAIL DU THÈME */}
            <BaseBottomSheetModal
                isVisible={selectedTheme !== null}
                onClose={() => setSelectedTheme(null)}
                title={selectedTheme?.name || ''}
            >

                <Text style={styles.modalMantra}>« {selectedTheme?.mantra} »</Text>

                {selectedTheme?.ruleLabel && (
                    <View style={styles.ruleCard}>
                        <Text style={styles.ruleTitle}>RÈGLE D'OR</Text>
                        <Text style={styles.ruleText}>{selectedTheme.ruleLabel}</Text>
                    </View>
                )}

                <Text style={styles.modalDescription}>{selectedTheme?.description}</Text>

                {/* Section Quêtes Solo */}
                <View style={styles.trackSectionHeader}>
                    <User color={Colors.text} size={18} />
                    <Text style={styles.trackSectionTitle}>Exercices Solo</Text>
                </View>
                <View style={styles.trackCardContainer}>
                    {renderExerciseTrack('solo', activeLevels.solo)}
                </View>

                {/* Section Quêtes Sociales */}
                <View style={styles.trackSectionHeader}>
                    <Users color={Colors.text} size={18} />
                    <Text style={styles.trackSectionTitle}>Exercices Sociaux</Text>
                </View>
                <View style={styles.trackCardContainer}>
                    {renderExerciseTrack('social', activeLevels.social)}
                </View>

                <View style={{ height: 40 }} />
            </BaseBottomSheetModal>
        </View>
    );
};

const styles = StyleSheet.create({
    glassCard: { backgroundColor: 'rgba(30, 30, 30, 0.5)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', marginBottom: 20 },
    axisAccordion: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    axisAccordionOpen: { backgroundColor: 'rgba(255,255,255,0.02)' },
    axisHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    axisHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    axisIconBg: { padding: 10, borderRadius: 12 },
    axisTitle: { color: Colors.text, fontFamily: 'PoppinsSemiBold', fontSize: 15 },
    axisSubtitle: { color: Colors.textMuted, fontSize: 11, marginTop: 1 },
    axisContent: { backgroundColor: 'transparent', paddingHorizontal: 12, paddingBottom: 8 },

    themeRowClickable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.03)'
    },
    themeLeftBlock: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, marginRight: 8 },
    dayBadge: { width: 32, height: 26, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
    dayBadgeText: { color: Colors.textMuted, fontSize: 11, fontFamily: 'PoppinsBold' },
    themeNameText: { color: Colors.text, fontFamily: 'PoppinsSemiBold', fontSize: 14 },
    themeMantraText: { color: Colors.textMuted, fontSize: 11, fontFamily: 'PoppinsMedium', marginTop: 1, opacity: 0.7 },

    themeRightBlock: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    trackBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
    trackBadgeText: { fontSize: 10, fontFamily: 'PoppinsBold', color: Colors.text },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(10, 10, 10, 0.85)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#161616', borderTopLeftRadius: 28, borderTopRightRadius: 28, height: '85%', paddingHorizontal: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderBottomWidth: 0 },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    modalHeaderSubtitle: { color: Colors.primary, fontSize: 10, fontFamily: 'PoppinsBold', letterSpacing: 1.5 },
    modalHeaderTitle: { color: Colors.text, fontSize: 22, fontFamily: 'PoppinsBold', marginTop: 2 },
    closeButton: { backgroundColor: 'rgba(255,255,255,0.06)', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    modalScroll: { flex: 1, marginTop: 16 },
    modalMantra: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsSemiBold', fontStyle: 'italic', textAlign: 'center', marginBottom: 16 },

    ruleCard: { backgroundColor: 'rgba(255, 152, 0, 0.08)', borderWidth: 1, borderColor: 'rgba(255, 152, 0, 0.2)', borderRadius: 14, padding: 12, marginBottom: 16 },
    ruleTitle: { color: '#FF9800', fontSize: 9, fontFamily: 'PoppinsBold', letterSpacing: 1 },
    ruleText: { color: Colors.text, fontSize: 13, fontFamily: 'PoppinsSemiBold', marginTop: 2 },

    modalDescription: { color: Colors.textMuted, fontSize: 13, lineHeight: 20, fontFamily: 'PoppinsMedium', marginBottom: 24, opacity: 0.9 },

    trackSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 8 },
    trackSectionTitle: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsBold' },
    trackCardContainer: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', paddingVertical: 4, paddingHorizontal: 12, marginBottom: 20 },

    exerciseRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
    exerciseRowActive: { backgroundColor: 'rgba(255,255,255,0.02)', marginHorizontal: -12, paddingHorizontal: 12, borderRadius: 8 },
    exerciseRowLocked: { opacity: 0.4 },
    exerciseIconContainer: { marginTop: 2, marginRight: 12, width: 20, alignItems: 'center' },
    exerciseContent: { flex: 1 },
    exerciseLevelTitle: { fontSize: 13, fontFamily: 'PoppinsSemiBold', color: Colors.text },
    activeLabel: { color: Colors.primary, fontSize: 11, fontFamily: 'PoppinsBold' },
    exerciseActionText: { fontSize: 12, color: Colors.textMuted, marginTop: 4, fontFamily: 'PoppinsMedium', lineHeight: 18 },

    textCompleted: { color: '#4CAF50', fontFamily: 'PoppinsSemiBold' },
    textLocked: { color: Colors.textMuted },
});