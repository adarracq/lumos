// src/screens/home/components/DayExerciseBlock.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { Colors } from '@/src/constants/Colors';
import { EXERCISES } from '@/src/constants/Exercises';
import { ExerciseDef, ThemeDef } from '@/src/constants/Themes';
import { feedbackService } from '@/src/services/feedbackService';
import { useDailyStore } from '@/src/store/useDailyStore';
import { CheckCircle2, ChevronRight, Circle, Edit3, Handshake, Lock, Moon, Target, User, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DayExerciseBlockProps {
    theme: ThemeDef;
    levels: { solo: number; social: number };
    solo: ExerciseDef;
    social: ExerciseDef;
}

export const DayExerciseBlock = ({ theme, levels, solo, social }: DayExerciseBlockProps) => {
    const {
        dayExerciseCompleted,
        selectedExerciseType,
        setExerciseType,
        exerciseCommitment,
        commitToExercise,
        cancelCommitment
    } = useDailyStore();

    const [isModalVisible, setModalVisible] = useState(false);

    const activeType = exerciseCommitment || selectedExerciseType;
    const currentExercise = activeType === 'SOLO' ? solo : social;
    const isCommitted = exerciseCommitment !== null;

    const handleCommit = () => {
        feedbackService.heavy();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        commitToExercise();
        setModalVisible(false);
    };

    const handleUndoCommit = () => {
        feedbackService.light();
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        cancelCommitment();
    };

    const renderExerciseTrack = () => {
        const type = selectedExerciseType === 'SOLO' ? 'solo' : 'social';
        const currentLevel = levels[type];
        const themeContent = EXERCISES.find(e => e.themeId === theme.dayId);

        if (!themeContent) return null;

        const exercises = [];

        for (let i = 1; i <= 5; i++) {
            const isCompleted = i < currentLevel;
            const isActive = i === currentLevel;
            const isLocked = i > currentLevel;

            const exerciseDef = themeContent[type]?.find(e => e.level === i);
            const actionText = exerciseDef?.action || "Défi inconnu.";

            let displayText = "";
            if (isCompleted) {
                displayText = actionText;
            } else if (isActive) {
                displayText = actionText;
            } else {
                displayText = "Défi verrouillé.";
            }

            const RowComponent = isActive ? TouchableOpacity : View;
            const rowProps = isActive
                ? {
                    onPress: () => { setModalVisible(true); feedbackService.light(); },
                    activeOpacity: 0.7
                }
                : {};

            exercises.push(
                <RowComponent
                    key={i}
                    style={[
                        styles.trackRow,
                        isActive && styles.trackRowActive,
                        isLocked && styles.trackRowLocked
                    ]}
                    {...rowProps}
                >
                    <View style={styles.trackIconContainer}>
                        {isCompleted ? (
                            <CheckCircle2 color="#4CAF50" size={16} />
                        ) : isLocked ? (
                            <Lock color="rgba(255,255,255,0.25)" size={14} />
                        ) : (
                            <Circle color={Colors.primary} size={16} />
                        )}
                    </View>
                    <View style={styles.trackContentContainer}>
                        <Text style={[
                            styles.trackLevelTitle,
                            isCompleted && styles.textCompleted,
                            isLocked && styles.textLocked
                        ]}>
                            Niveau {i} {isActive && <Text style={styles.activeLabel}>• À faire</Text>}
                        </Text>
                        <Text
                            style={[styles.trackActionText, isLocked && styles.textLocked]}
                            numberOfLines={isCompleted ? 2 : undefined}
                        >
                            {displayText}
                        </Text>
                    </View>

                    {isActive && (
                        <View style={styles.chevronContainer}>
                            <ChevronRight color={Colors.primary} size={18} />
                        </View>
                    )}
                </RowComponent>
            );
        }

        return <View style={styles.trackContainer}>{exercises}</View>;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Exercice du Jour</Text>
            </View>

            {/* --- ÉTAPE 1 : MODE SÉLECTION --- */}
            {!isCommitted && !dayExerciseCompleted && (
                <>
                    <BodyText style={{ marginBottom: 12, fontSize: 14 }}>
                        Choisis ton approche et clique sur ton défi du jour :
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

                    {renderExerciseTrack()}
                </>
            )}

            {/* --- ÉTAPE 2 : MODE PACTE SCELLÉ --- */}
            {isCommitted && (
                <View style={[styles.pactContainer, dayExerciseCompleted && styles.pactContainerCompleted]}>
                    {/* Icône de fond décorative */}
                    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                        <Target
                            color={dayExerciseCompleted ? "#4CAF50" : Colors.primary}
                            size={120}
                            style={styles.pactBgIcon}
                            opacity={0.04}
                        />
                    </View>

                    <View style={styles.pactHeader}>
                        <View style={styles.pactBadge}>
                            <Handshake color={dayExerciseCompleted ? "#4CAF50" : Colors.primary} size={14} />
                            <Text style={[styles.pactBadgeText, dayExerciseCompleted && { color: "#4CAF50" }]}>
                                {dayExerciseCompleted ? 'MISSION ACCOMPLIE' : 'PACTE SCELLÉ'} • {activeType === 'SOLO' ? 'Solo' : 'Social'} • Niv {activeType === 'SOLO' ? levels.solo : levels.social}
                            </Text>
                        </View>

                        {!dayExerciseCompleted && (
                            <TouchableOpacity onPress={handleUndoCommit} style={styles.undoBtn} activeOpacity={0.7}>

                                <Edit3 color={Colors.textMuted} size={14} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={styles.pactActionText}>
                        {currentExercise.action}
                    </Text>

                    <View style={styles.pactFooter}>
                        {dayExerciseCompleted ? (
                            <>
                                <CheckCircle2 color="#4CAF50" size={18} />
                                <Text style={[styles.pactFooterText, { color: "#4CAF50" }]}>
                                    Défi validé. Analyse prévue ce soir.
                                </Text>
                            </>
                        ) : (
                            <>
                                <Moon color={Colors.primary} size={16} />
                                <Text style={styles.pactFooterText}>
                                    {`Garde cette action en tête. Tu feras le point ce soir.`}
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            )}

            {/* MODALE D'ENGAGEMENT DE L'EXERCICE */}
            <BaseBottomSheetModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                title={`Exercice ${selectedExerciseType === 'SOLO' ? 'Solo' : 'Social'} - Niv ${selectedExerciseType === 'SOLO' ? levels.solo : levels.social}`}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalActionText}>{currentExercise.action}</Text>

                    <View style={styles.modalAnalysisBox}>
                        <Text style={styles.modalAnalysisTitle}>POURQUOI CET EXERCICE ?</Text>
                        <Text style={styles.modalAnalysisText}>{currentExercise.analysis}</Text>
                    </View>

                    <LumosButton
                        title="Sceller le pacte"
                        onPress={handleCommit}
                        style={{ marginTop: 24 }}
                    />
                </View>
            </BaseBottomSheetModal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 0, marginBottom: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { color: Colors.text, fontSize: 18, fontFamily: 'PoppinsSemiBold' },

    segmentedControl: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 14, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    segmentBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10 },
    segmentBtnActive: { backgroundColor: 'rgba(255, 255, 255, 0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
    segmentText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', marginLeft: 8, fontSize: 13 },
    segmentTextActive: { color: Colors.text },
    badgePill: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
    badgePillActive: { backgroundColor: 'rgba(212, 175, 55, 0.2)' },
    badgeText: { color: Colors.textMuted, fontSize: 9, fontFamily: 'PoppinsBold' },
    badgeTextActive: { color: Colors.primary },

    // Piste de progression
    trackContainer: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', paddingVertical: 4, paddingHorizontal: 12, marginBottom: 0 },
    trackRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.03)' },
    trackRowActive: { backgroundColor: 'rgba(212, 175, 55, 0.08)', marginHorizontal: -12, paddingHorizontal: 12, borderRadius: 8, borderBottomWidth: 0, borderColor: 'rgba(212, 175, 55, 0.2)', borderWidth: 1 },
    trackRowLocked: { opacity: 0.5 },
    trackIconContainer: { marginTop: 2, marginRight: 12, width: 20, alignItems: 'center' },
    trackContentContainer: { flex: 1 },
    trackLevelTitle: { fontSize: 13, fontFamily: 'PoppinsSemiBold', color: Colors.text },
    activeLabel: { color: Colors.primary, fontSize: 11, fontFamily: 'PoppinsBold' },
    trackActionText: { fontSize: 12, color: Colors.textMuted, marginTop: 4, fontFamily: 'PoppinsMedium', lineHeight: 18 },
    chevronContainer: { justifyContent: 'center', alignItems: 'center', paddingLeft: 8, alignSelf: 'center' },
    textCompleted: { color: '#4CAF50', fontFamily: 'PoppinsSemiBold' },
    textLocked: { color: Colors.textMuted },

    // NOUVEAU STYLE DU PACTE SCELLÉ
    pactContainer: {
        backgroundColor: 'rgba(212, 175, 55, 0.03)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
        position: 'relative',
        overflow: 'hidden',
    },
    pactContainerCompleted: {
        backgroundColor: 'rgba(76, 175, 80, 0.03)',
        borderColor: 'rgba(76, 175, 80, 0.2)',
    },
    pactBgIcon: {
        position: 'absolute',
        top: -15,
        right: -20,
        transform: [{ rotate: '-10deg' }]
    },
    pactHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    pactBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6
    },
    pactBadgeText: {
        color: Colors.primary,
        fontSize: 10,
        fontFamily: 'PoppinsBold',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    undoBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 10,
        borderRadius: 12,
        gap: 6
    },
    undoBtnText: {
        color: Colors.textMuted,
        fontSize: 11,
        fontFamily: 'PoppinsSemiBold'
    },
    pactActionText: {
        color: Colors.text,
        fontSize: 16,
        fontFamily: 'PoppinsMedium',
        lineHeight: 24,
        marginBottom: 20
    },
    pactFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        paddingTop: 16,
        gap: 8
    },
    pactFooterText: {
        color: Colors.textMuted,
        fontSize: 13,
        fontFamily: 'InterMedium',
        flex: 1
    },

    // Modale d'engagement
    modalContent: { paddingVertical: 10 },
    modalActionText: { color: Colors.text, fontSize: 16, fontFamily: 'InterRegular', lineHeight: 24, marginBottom: 20 },
    modalAnalysisBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 16, borderLeftWidth: 2, borderLeftColor: Colors.primary },
    modalAnalysisTitle: { color: Colors.text, fontSize: 10, fontFamily: 'PoppinsBold', letterSpacing: 1, marginBottom: 6 },
    modalAnalysisText: { color: Colors.textMuted, fontSize: 13, lineHeight: 20, fontFamily: 'InterRegular' },
});