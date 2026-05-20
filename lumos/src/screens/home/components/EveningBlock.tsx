// src/components/organisms/EveningBlock.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { FocusTimerModal } from '@/src/components/organisms/FocusTimerModal';
import { JournalModal } from '@/src/components/organisms/JournalModal';
import { Colors } from '@/src/constants/Colors';
import { XP_REWARDS } from '@/src/constants/Rewards';
import { ExerciseDef, RitualDef, RitualFamily, ThemeDef } from '@/src/constants/Themes';
import { feedbackService } from '@/src/services/feedbackService';
import { useDailyStore } from '@/src/store/useDailyStore';
import { useJournalStore } from '@/src/store/useJournalStore';
import { useTaskStore } from '@/src/store/useTaskStore';
import { getLogicalTodayKey } from '@/src/utils/dateUtils';
import { grantXP } from '@/src/utils/rewardManager';
import { BookOpen, Brain, CheckCircle2, Cloud, CloudRain, Leaf, Lock, Moon, Sparkles, Star, Sun, Target, TrendingUp, Wind, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RitualDetailModal } from './RitualDetailModal';


interface EveningBlockProps {
    theme: ThemeDef;
    eveningRitual: RitualDef;
    solo: ExerciseDef;
    social: ExerciseDef;
}

const MOODS = [
    { id: 'EXHAUSTED', icon: CloudRain, label: 'Épuisé', color: '#CF6679' },
    { id: 'NEUTRAL', icon: Cloud, label: 'Neutre', color: Colors.textMuted },
    { id: 'PEACEFUL', icon: Sun, label: 'Paisible', color: '#4CAF50' },
    { id: 'RADIANT', icon: Sparkles, label: 'Rayonnant', color: Colors.primary }
];

const DIFFICULTY_LEVELS = [
    { id: 'EASY', icon: Leaf, label: 'Confort' },
    { id: 'MEDIUM', icon: TrendingUp, label: 'Évolution' },
    { id: 'HARD', icon: Zap, label: 'Résistance' }
];

export const EveningBlock = ({ theme, eveningRitual, solo, social }: EveningBlockProps) => {
    const {
        mainTaskId, selectedExerciseType, dayExerciseCompleted, completeDayExercise,
        eveningRitualCompleted, completeEveningRitual,
        eveningReviewDraft, updateEveningDraft
    } = useDailyStore();

    const { tasks, toggleTask } = useTaskStore();
    const { entries, addEntry } = useJournalStore();

    const todayKey = getLogicalTodayKey();
    const isDayLocked = entries?.some(e => e.date === todayKey && e.title.startsWith('Bilan J'));

    const [isEvening, setIsEvening] = useState(false);

    // Visibilité des Modales
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [isJournalVisible, setIsJournalVisible] = useState(false);
    const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false);
    const [isMoodModalVisible, setIsMoodModalVisible] = useState(false);
    const [isRitualModalVisible, setIsRitualModalVisible] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        setIsEvening(hour >= 11 || hour <= 2);
    }, []);

    const mainTask = tasks.find(t => t.id === mainTaskId);
    const exerciseText = selectedExerciseType === 'SOLO' ? solo.action : social.action;

    // État de complétion des étapes (basé sur le store persistant)
    const isExerciseReviewed = eveningReviewDraft.difficulty !== null && eveningReviewDraft.impact > 0;
    const isMoodGratitudeDone = eveningReviewDraft.mood !== null && eveningReviewDraft.pride.trim().length > 0 && eveningReviewDraft.gratitude.trim().length > 0;
    const allEveningDone = isExerciseReviewed && eveningRitualCompleted && isMoodGratitudeDone;

    const handleValidateExercise = () => {
        if (eveningReviewDraft.difficulty && eveningReviewDraft.impact > 0) {
            feedbackService.success();
            completeDayExercise(theme.dayId, selectedExerciseType);
            setIsExerciseModalVisible(false);
        }
    };

    const handleValidateMood = () => {
        if (eveningReviewDraft.mood && eveningReviewDraft.pride.trim().length > 0 && eveningReviewDraft.gratitude.trim().length > 0) {
            feedbackService.success();
            setIsMoodModalVisible(false);
        }
    };

    const handleLockDay = () => {
        if (allEveningDone) {
            const diffLabel = DIFFICULTY_LEVELS.find(d => d.id === eveningReviewDraft.difficulty)?.label;

            // 💡 NOUVEAU FORMATAGE PREMIUM (Sans émojis, avec des crochets pour les titres)
            const combinedContent = `[Analyse du Défi]
Action : ${exerciseText}
Difficulté : ${diffLabel} | Impact : ${eveningReviewDraft.impact}/5
Remarque : ${eveningReviewDraft.reflection.trim() || 'Aucune remarque'}

[Fierté du Jour]
${eveningReviewDraft.pride.trim()}

[Gratitude]
${eveningReviewDraft.gratitude.trim()}`;

            if (addEntry) {
                addEntry({
                    title: `Bilan J${theme.dayId} : ${theme.name}`,
                    content: combinedContent,
                    date: todayKey,
                    isFavorite: false,
                    mood: eveningReviewDraft.mood!
                });
            }

            feedbackService.heavy();
            setTimeout(() => feedbackService.success(), 300);
            grantXP(XP_REWARDS.END_DAY);
        }
    };

    const getRitualIcon = (family: RitualFamily) => {
        switch (family) {
            case 'BREATHING': return Wind;
            case 'JOURNALING': return BookOpen;
            case 'REFLECTION': return Brain;
            case 'ACTION': return Zap;
            default: return Moon;
        }
    };

    const ActionTile = ({ icon: Icon, title, desc, isDone, onPress }: any) => (
        <TouchableOpacity style={[styles.tile, isDone && styles.tileDone]} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconBox, isDone && styles.iconBoxDone]}>
                <Icon color={isDone ? Colors.background : Colors.text} size={22} strokeWidth={isDone ? 2.5 : 2} />
            </View>
            <View style={styles.tileTextContainer}>
                <Text style={[styles.tileTitle, isDone && styles.textDone]}>{title}</Text>
                <Text style={styles.tileDesc} numberOfLines={1}>{desc}</Text>
            </View>
            {isDone && <CheckCircle2 color={Colors.primary} size={20} />}
        </TouchableOpacity>
    );

    if (!isEvening) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>Bilan du Soir</Text>
                    <Lock color={Colors.textMuted} size={18} />
                </View>
                <View style={[styles.glassCard, styles.cardLocked]}>
                    <BodyText color={Colors.textMuted} style={{ fontSize: 13, textAlign: 'center' }}>
                        Ce bloc se déverrouillera à partir de 16h00 pour faire le point sur ta journée.
                    </BodyText>
                </View>
            </View>
        );
    }

    // 🟢 JOURNÉE VERROUILLÉE (Design Premium)
    if (isDayLocked) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>Bilan du Soir</Text>
                </View>
                <View style={[styles.glassCard, styles.cardLockedDay]}>
                    <View style={styles.lockedDayIconWrapper}>
                        <Moon color={Colors.primary} size={24} strokeWidth={1.5} />
                    </View>
                    <Text style={styles.lockedDayTitle}>CYCLE ACCOMPLI</Text>
                    <View style={styles.lockedDayDivider} />
                    <BodyText center color={Colors.textMuted} style={{ fontSize: 13, lineHeight: 22, paddingHorizontal: 10 }}>
                        Ton bilan est scellé et ta gratitude est notée. Repose-toi, demain est un nouveau départ.
                    </BodyText>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Bilan du Soir</Text>
            </View>

            <View style={styles.grid}>
                {mainTask && (
                    <ActionTile
                        icon={Target} title="Priorité du jour" desc={mainTask.title}
                        isDone={mainTask.isCompleted} onPress={() => { toggleTask(mainTask.id); feedbackService.light(); }}
                    />
                )}

                <ActionTile
                    icon={Sun} title="Analyse du Défi" desc={exerciseText}
                    isDone={isExerciseReviewed} onPress={() => setIsExerciseModalVisible(true)}
                />

                <ActionTile
                    icon={getRitualIcon(eveningRitual.family)} title={`Rituel : ${eveningRitual.title}`} desc={eveningRitual.description}
                    isDone={eveningRitualCompleted} onPress={() => {
                        if (eveningRitual.family === 'BREATHING') setIsTimerVisible(true);
                        else if (eveningRitual.family === 'JOURNALING') setIsJournalVisible(true);
                        else { setIsRitualModalVisible(true); }
                    }}
                />

                <ActionTile
                    icon={Sparkles} title="Météo & Gratitude" desc="Clôturer sur une note positive"
                    isDone={isMoodGratitudeDone} onPress={() => setIsMoodModalVisible(true)}
                />
            </View>

            {allEveningDone && (
                <LumosButton
                    title="Verrouiller ma journée"
                    onPress={handleLockDay}
                    style={{ marginTop: 30 }}
                    disabled={!allEveningDone}
                />

            )}

            {/* MODALE 1 : ANALYSE DU DÉFI */}
            <BaseBottomSheetModal
                isVisible={isExerciseModalVisible}
                onClose={() => setIsExerciseModalVisible(false)}
                title="Analyse du Défi"
            >

                <Text style={styles.exerciseTargetText}>"{exerciseText}"</Text>

                <View style={styles.reviewRow}>
                    <Text style={styles.reviewQuestion}>Niveau de résistance ?</Text>
                    <View style={styles.difficultyContainer}>
                        {DIFFICULTY_LEVELS.map(lvl => {
                            const isActive = eveningReviewDraft.difficulty === lvl.id;
                            return (
                                <TouchableOpacity
                                    key={lvl.id} style={[styles.diffBtn, isActive && styles.diffBtnActive]}
                                    onPress={() => { feedbackService.light(); updateEveningDraft({ difficulty: lvl.id }); }}
                                >
                                    <lvl.icon color={isActive ? Colors.primary : Colors.textMuted} size={20} style={{ marginBottom: 6 }} />
                                    <Text style={[styles.diffLabel, isActive && styles.diffLabelActive]}>{lvl.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.reviewRow}>
                    <Text style={styles.reviewQuestion}>Valeur & Impact</Text>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <TouchableOpacity key={star} onPress={() => { feedbackService.light(); updateEveningDraft({ impact: star }); }}>
                                <Star color={star <= eveningReviewDraft.impact ? Colors.primary : 'rgba(255,255,255,0.1)'} fill={star <= eveningReviewDraft.impact ? Colors.primary : 'transparent'} size={32} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TextInput
                    style={styles.microInput} placeholder="Une remarque ? (Optionnel, 140 car. max)"
                    placeholderTextColor={Colors.textMuted} value={eveningReviewDraft.reflection} maxLength={140} multiline
                    onChangeText={(text) => updateEveningDraft({ reflection: text })}
                />

                <LumosButton title="Valider le défi" onPress={handleValidateExercise} disabled={!eveningReviewDraft.difficulty || eveningReviewDraft.impact === 0} style={{ marginTop: 10 }} />
            </BaseBottomSheetModal>

            {/* MODALE 2 : MÉTÉO, FIERTÉ & GRATITUDE */}
            <BaseBottomSheetModal
                isVisible={isMoodModalVisible}
                onClose={() => setIsMoodModalVisible(false)}
                title="Bilan Émotionnel"
            >
                <Text style={styles.reviewQuestion}>Comment te sens-tu ce soir ?</Text>
                <View style={styles.moodContainer}>
                    {MOODS.map(mood => {
                        const isActive = eveningReviewDraft.mood === mood.id;
                        return (
                            <TouchableOpacity
                                key={mood.id} style={[styles.moodBtn, isActive && { borderColor: mood.color, backgroundColor: `${mood.color}15` }]}
                                onPress={() => { feedbackService.light(); updateEveningDraft({ mood: mood.id }); }}
                            >
                                <mood.icon color={isActive ? mood.color : Colors.textMuted} size={24} style={{ marginBottom: 6 }} />
                                <Text style={[styles.moodLabel, isActive && { color: mood.color, fontFamily: 'PoppinsBold' }]}>{mood.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={styles.reviewQuestion}>Une chose dont tu es fier aujourd'hui ?</Text>
                <TextInput
                    style={styles.gratitudeInput} placeholder="Écris ta fierté du jour..."
                    placeholderTextColor={Colors.textMuted} value={eveningReviewDraft.pride} multiline textAlignVertical="top"
                    onChangeText={(text) => updateEveningDraft({ pride: text })}
                />

                <Text style={styles.reviewQuestion}>Une chose pour laquelle tu as de la gratitude ?</Text>
                <TextInput
                    style={styles.gratitudeInput} placeholder="Écris ta gratitude..."
                    placeholderTextColor={Colors.textMuted} value={eveningReviewDraft.gratitude} multiline textAlignVertical="top"
                    onChangeText={(text) => updateEveningDraft({ gratitude: text })}
                />

                <LumosButton
                    title="Valider"
                    onPress={handleValidateMood}
                    disabled={!eveningReviewDraft.mood || eveningReviewDraft.pride.trim().length === 0 || eveningReviewDraft.gratitude.trim().length === 0}
                    style={{ marginTop: 5 }}
                />
            </BaseBottomSheetModal>

            {/* Modales du Rituel */}
            <FocusTimerModal isVisible={isTimerVisible} onClose={() => setIsTimerVisible(false)} onComplete={() => { setIsTimerVisible(false); completeEveningRitual(); }} />
            <JournalModal isVisible={isJournalVisible} title={eveningRitual.title} instruction={eveningRitual.description} onClose={() => setIsJournalVisible(false)} onComplete={() => { setIsJournalVisible(false); completeEveningRitual(); }} />
            <RitualDetailModal
                isVisible={isRitualModalVisible}
                onClose={() => setIsRitualModalVisible(false)}
                ritual={eveningRitual}
                onComplete={() => {
                    completeEveningRitual();
                    feedbackService.success();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 0, marginBottom: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { color: Colors.text, fontSize: 18, fontFamily: 'PoppinsSemiBold' },
    grid: { gap: 10 },

    tile: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 14, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    tileDone: { borderColor: Colors.primary, backgroundColor: 'rgba(212, 175, 55, 0.05)' },
    iconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.08)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    iconBoxDone: { backgroundColor: Colors.primary },
    tileTextContainer: { flex: 1, marginRight: 10 },
    tileTitle: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsSemiBold', marginBottom: 2 },
    tileDesc: { color: Colors.textMuted, fontSize: 12, fontFamily: 'InterRegular' },
    textDone: { textDecorationLine: 'line-through', color: Colors.textMuted, opacity: 0.6 },

    reviewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, marginTop: 20, gap: 10, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
    reviewBtnText: { color: Colors.background, fontFamily: 'PoppinsBold', fontSize: 15, letterSpacing: 0.5 },

    glassCard: { backgroundColor: 'rgba(30, 30, 30, 0.5)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
    cardLocked: { opacity: 0.8, backgroundColor: 'rgba(20, 20, 20, 0.4)', paddingVertical: 24 },

    cardLockedDay: {
        backgroundColor: 'rgba(212, 175, 55, 0.03)',
        borderColor: 'rgba(212, 175, 55, 0.15)',
        paddingVertical: 32,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderRadius: 24
    },
    lockedDayIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    lockedDayTitle: {
        color: Colors.primary,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 13,
        letterSpacing: 2,
        marginBottom: 12,
    },
    lockedDayDivider: {
        width: 40,
        height: 1,
        backgroundColor: 'rgba(212, 175, 55, 0.3)',
        marginBottom: 16,
    },
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    glassCardModal: { backgroundColor: 'rgba(30, 30, 30, 0.95)', padding: 24, borderRadius: 24, width: '100%', borderWidth: 1, borderColor: Colors.surfaceLight, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { color: Colors.text, fontSize: 20, fontFamily: 'PoppinsBold' },
    closeBtn: { padding: 4 },

    exerciseTargetText: { fontSize: 14, fontFamily: 'InterRegular', color: Colors.primary, fontStyle: 'italic', textAlign: 'center', marginBottom: 24, opacity: 0.9 },
    reviewRow: { marginBottom: 20 },
    reviewQuestion: { fontSize: 13, fontFamily: 'PoppinsSemiBold', color: Colors.text, marginBottom: 12, textAlign: 'center' },

    difficultyContainer: { flexDirection: 'row', gap: 10 },
    diffBtn: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    diffBtnActive: { backgroundColor: 'rgba(212, 175, 55, 0.15)', borderColor: Colors.primary },
    diffLabel: { fontSize: 11, fontFamily: 'PoppinsMedium', color: Colors.textMuted },
    diffLabelActive: { color: Colors.primary, fontFamily: 'PoppinsBold' },

    starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12 },

    moodContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20, gap: 10 },
    moodBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 16, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    moodLabel: { fontSize: 10, color: Colors.textMuted, fontFamily: 'PoppinsMedium' },

    microInput: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: 14, color: Colors.text, fontSize: 13, fontFamily: 'InterRegular', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', minHeight: 70, textAlignVertical: 'top', marginBottom: 10 },
    gratitudeInput: { width: '100%', height: 75, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 14, color: Colors.text, fontSize: 13, fontFamily: 'InterRegular', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 15, lineHeight: 20 }
});