// src/components/organisms/DayExerciseBlock.tsx
import { BodyText } from '@/src/components/atoms/Typography';
import { Colors } from '@/src/constants/Colors';
import { ExerciseDef, ThemeDef } from '@/src/constants/Themes';
import { feedbackService } from '@/src/services/feedbackService';
import { useDailyStore } from '@/src/store/useDailyStore';
import { CheckCircle2, Info, User, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DayExerciseBlockProps {
    theme: ThemeDef;
    levels: { solo: number; social: number };
    solo: ExerciseDef;
    social: ExerciseDef;
}

export const DayExerciseBlock = ({ theme, levels, solo, social }: DayExerciseBlockProps) => {
    const { dayExerciseCompleted, selectedExerciseType, setExerciseType } = useDailyStore();
    const currentExercise = selectedExerciseType === 'SOLO' ? solo : social;
    const [showInfo, setShowInfo] = useState(false);

    const toggleInfo = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShowInfo(!showInfo);
    };

    return (
        <View style={styles.container}>
            {/* EN-TÊTE HARMONISÉ */}
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Exercice du Jour</Text>
                <TouchableOpacity onPress={toggleInfo} style={styles.iconBtn}>
                    <Info color={showInfo ? Colors.primary : Colors.textMuted} size={20} />
                </TouchableOpacity>
            </View>

            {/* CONTENU DIRECTEMENT SUR LE FOND */}
            <View style={[styles.ruleBox, dayExerciseCompleted && styles.ruleBoxCompleted]}>
                <Text style={styles.ruleLabel}>RÈGLE D'OR</Text>
                <Text style={styles.ruleText}>{theme.ruleLabel}</Text>
            </View>

            <BodyText style={{ marginBottom: 12, fontSize: 14 }}>
                Selon ton programme d'aujourd'hui, choisis ton approche :
            </BodyText>

            <View style={styles.segmentedControl}>
                <TouchableOpacity
                    style={[styles.segmentBtn, selectedExerciseType === 'SOLO' && styles.segmentBtnActive]}
                    onPress={() => { setExerciseType('SOLO'); feedbackService.light(); }}
                    activeOpacity={0.8}
                >
                    <User color={selectedExerciseType === 'SOLO' ? Colors.text : Colors.textMuted} size={16} />
                    <Text style={[styles.segmentText, selectedExerciseType === 'SOLO' && styles.segmentTextActive]}>Solo</Text>
                    <View style={[styles.badgePill, selectedExerciseType === 'SOLO' && styles.badgePillActive]}>
                        <Text style={[styles.badgeText, selectedExerciseType === 'SOLO' && styles.badgeTextActive]}>Niv {levels.solo}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.segmentBtn, selectedExerciseType === 'SOCIAL' && styles.segmentBtnActive]}
                    onPress={() => { setExerciseType('SOCIAL'); feedbackService.light(); }}
                    activeOpacity={0.8}
                >
                    <Users color={selectedExerciseType === 'SOCIAL' ? Colors.text : Colors.textMuted} size={16} />
                    <Text style={[styles.segmentText, selectedExerciseType === 'SOCIAL' && styles.segmentTextActive]}>Social</Text>
                    <View style={[styles.badgePill, selectedExerciseType === 'SOCIAL' && styles.badgePillActive]}>
                        <Text style={[styles.badgeText, selectedExerciseType === 'SOCIAL' && styles.badgeTextActive]}>Niv {levels.social}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.exerciseContent}>
                <BodyText style={styles.exerciseText}>
                    {currentExercise.action}
                </BodyText>
            </View>

            {showInfo && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>POURQUOI CET EXERCICE ?</Text>
                    <Text style={styles.infoText}>{currentExercise.analysis}</Text>
                </View>
            )}

            <View style={styles.footerInfo}>
                {dayExerciseCompleted ? (
                    <>
                        <CheckCircle2 color={Colors.primary} size={16} />
                        <Text style={[styles.footerText, { color: Colors.primary, marginLeft: 6 }]}>Défi validé. Analyse prévue ce soir.</Text>
                    </>
                ) : (
                    <Text style={styles.footerText}>
                        Garde cette action en tête. Tu feras le point ce soir. 🌙
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 0, marginBottom: 20 },

    // Header standardisé (identique à MorningRoutine)
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { color: Colors.text, fontSize: 18, fontFamily: 'PoppinsSemiBold' },
    iconBtn: { padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 10 },

    // Tuiles Glassmorphism internes
    ruleBox: { backgroundColor: 'rgba(30, 30, 30, 0.5)', padding: 16, borderRadius: 18, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
    ruleBoxCompleted: { borderColor: 'rgba(212, 175, 55, 0.3)', backgroundColor: 'rgba(212, 175, 55, 0.05)' },
    ruleLabel: { color: Colors.primary, fontSize: 10, fontFamily: 'PoppinsBold', letterSpacing: 1.5, marginBottom: 4 },
    ruleText: { color: Colors.text, fontSize: 16, fontFamily: 'PoppinsMedium' },

    // iOS Segmented Control
    segmentedControl: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 14, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    segmentBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10 },
    segmentBtnActive: { backgroundColor: 'rgba(255, 255, 255, 0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
    segmentText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', marginLeft: 8, fontSize: 13 },
    segmentTextActive: { color: Colors.text },

    badgePill: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
    badgePillActive: { backgroundColor: 'rgba(212, 175, 55, 0.2)' },
    badgeText: { color: Colors.textMuted, fontSize: 9, fontFamily: 'PoppinsBold' },
    badgeTextActive: { color: Colors.primary },

    exerciseContent: { marginBottom: 10, paddingHorizontal: 4 },
    exerciseText: { fontSize: 16, lineHeight: 24, color: Colors.text, fontFamily: 'InterRegular' },

    infoBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 16, marginTop: 15, borderLeftWidth: 2, borderLeftColor: Colors.primary },
    infoTitle: { color: Colors.text, fontSize: 10, fontFamily: 'PoppinsBold', letterSpacing: 1, marginBottom: 6 },
    infoText: { color: Colors.textMuted, fontSize: 13, lineHeight: 20, fontFamily: 'InterRegular' },

    footerInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingTop: 16 },
    footerText: { color: Colors.textMuted, fontSize: 12, fontFamily: 'InterRegular' }
});