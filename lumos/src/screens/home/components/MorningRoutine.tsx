import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { FocusTimerModal } from '@/src/components/organisms/FocusTimerModal';
import { SelectTaskModal } from '@/src/components/organisms/SelectTaskModal';
import { StretchingModal } from '@/src/components/organisms/StretchingModal';
import { Colors } from '@/src/constants/Colors';
import { feedbackService } from '@/src/services/feedbackService';
import { useDailyStore } from '@/src/store/useDailyStore';
import { useUserStore } from '@/src/store/useUserStore';
import { Activity, Check, CheckCircle2, Droplet, Quote, Settings2, Smile, Target, Wind } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ALL_STEPS_CONFIG = [
    { id: 'water', icon: Droplet, title: "Hydratation", desc: "Boire un grand verre d'eau" },
    { id: 'mantra', icon: Quote, title: "Mantra du jour", desc: "Répéter 5 fois à voix haute" },
    { id: 'stretching', icon: Activity, title: "Éveil corporel", desc: "2 min d'étirements légers" },
    { id: 'focus', icon: Wind, title: "Concentration", desc: "Respiration ou contemplation" },
    { id: 'smile', icon: Smile, title: "Ancrage positif", desc: "Sourire dans un miroir" },
    { id: 'task', icon: Target, title: "Priorité", desc: "Définir l'objectif du jour" }
];

export const MorningRoutine = ({ mantra }: { mantra: string }) => {
    const { morningRoutine, toggleMorningStep } = useDailyStore();
    const { morningRoutinePreferences, setMorningRoutinePreferences } = useUserStore();

    const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
    const [timerTarget, setTimerTarget] = useState<'focus' | 'stretching' | null>(null);
    const [isStretchingModalVisible, setStretchingModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const handleStepAction = (id: string) => {
        if (id === 'stretching') {
            !morningRoutine.stretching ? setStretchingModalVisible(true) : toggleMorningStep('stretching');
        } else if (id === 'focus') {
            morningRoutine.focus ? toggleMorningStep('focus') : setTimerTarget('focus');
        } else if (id === 'task') {
            setIsTaskModalVisible(true);
        } else {
            toggleMorningStep(id as any);
        }
    };

    const togglePreference = (id: string) => {
        if (morningRoutinePreferences.includes(id)) {
            setMorningRoutinePreferences(morningRoutinePreferences.filter(item => item !== id));
        } else {
            feedbackService.heavy();
            setMorningRoutinePreferences([...morningRoutinePreferences, id]);
        }
    };

    const ActionTile = ({ id, icon: Icon, title, desc }: any) => {
        const isDone = morningRoutine[id as keyof typeof morningRoutine];
        return (
            <TouchableOpacity style={[styles.tile, isDone && styles.tileDone]} onPress={() => handleStepAction(id)} activeOpacity={0.7}>
                <View style={[styles.iconBox, isDone && styles.iconBoxDone]}>
                    <Icon color={isDone ? Colors.background : Colors.text} size={22} strokeWidth={isDone ? 2.5 : 2} />
                </View>
                <View style={styles.tileTextContainer}>
                    <Text style={[styles.tileTitle, isDone && styles.textDone]}>{title}</Text>
                    <Text style={styles.tileDesc}>{desc}</Text>
                </View>
                {isDone && <CheckCircle2 color={Colors.primary} size={20} />}
            </TouchableOpacity>
        );
    };

    const activeSteps = ALL_STEPS_CONFIG.filter(step => morningRoutinePreferences.includes(step.id));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Routine Matinale</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(true)} style={styles.editBtn}>
                    <Settings2 color={Colors.textMuted} size={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {activeSteps.length === 0 ? (
                    <Text style={styles.emptyText}>Votre routine est vide. Cliquez sur l'icône de réglages pour l'assembler.</Text>
                ) : (
                    activeSteps.map(step => <ActionTile key={step.id} {...step} />)
                )}
            </View>

            {/* MODALE D'ÉDITION */}
            <BaseBottomSheetModal
                isVisible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                title="Personnaliser"
            >

                <Text style={styles.modalSubtitle}>Sélectionnez les étapes de votre matinée idéale.</Text>

                <View style={styles.listContainer}>
                    {ALL_STEPS_CONFIG.map(step => {
                        const isSelected = morningRoutinePreferences.includes(step.id);

                        // Couleurs dynamiques basées sur TaskItem & HabitItem
                        const rowBorderColor = isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)';
                        const rowBgColor = isSelected ? 'rgba(30, 30, 30, 0.5)' : 'rgba(20, 20, 20, 0.3)';

                        return (
                            <TouchableOpacity
                                key={step.id}
                                style={[styles.editRow, { borderColor: rowBorderColor, backgroundColor: rowBgColor }]}
                                onPress={() => togglePreference(step.id)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.editRowLeft}>
                                    <View style={[styles.modalIconWrapper, { backgroundColor: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)' }]}>
                                        <step.icon color={isSelected ? Colors.primary : Colors.textMuted} size={18} strokeWidth={2} />
                                    </View>
                                    <Text style={[styles.editRowText, isSelected && styles.editRowTextSelected]}>
                                        {step.title}
                                    </Text>
                                </View>

                                {/* Checkbox "Squircle" fidèle au TaskItem */}
                                <View style={[styles.checkbox, isSelected && styles.checkboxCompleted]}>
                                    {isSelected && <Check size={14} color={Colors.background} strokeWidth={4} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BaseBottomSheetModal>

            <FocusTimerModal isVisible={timerTarget !== null} onClose={() => setTimerTarget(null)} onComplete={() => { if (timerTarget) toggleMorningStep(timerTarget); setTimerTarget(null); }} />
            <SelectTaskModal isVisible={isTaskModalVisible} onClose={() => setIsTaskModalVisible(false)} />
            <StretchingModal isVisible={isStretchingModalVisible} onClose={() => setStretchingModalVisible(false)} onComplete={() => { if (!morningRoutine.stretching) toggleMorningStep('stretching'); }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 0 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { color: Colors.text, fontSize: 18, fontFamily: 'PoppinsSemiBold' },
    editBtn: { padding: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 10 },
    grid: { gap: 10 },
    emptyText: { color: Colors.textMuted, fontSize: 14, fontFamily: 'InterRegular', fontStyle: 'italic', textAlign: 'center', padding: 20 },

    // Tuiles principales
    tile: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 14, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    tileDone: { borderColor: Colors.primary, backgroundColor: 'rgba(212, 175, 55, 0.05)' },
    iconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.08)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    iconBoxDone: { backgroundColor: Colors.primary },
    tileTextContainer: { flex: 1 },
    tileTitle: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsSemiBold', marginBottom: 2 },
    tileDesc: { color: Colors.textMuted, fontSize: 12, fontFamily: 'InterRegular' },
    textDone: { textDecorationLine: 'line-through', color: Colors.textMuted, opacity: 0.6 },

    // Modale d'édition
    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    glassCard: { backgroundColor: 'rgba(30, 30, 30, 0.95)', padding: 24, borderRadius: 24, width: '100%', borderWidth: 1, borderColor: Colors.surfaceLight, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },

    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    modalTitle: { color: Colors.text, fontSize: 20, fontFamily: 'PoppinsBold' },
    closeBtn: { padding: 4 },
    modalSubtitle: { color: Colors.textMuted, fontSize: 14, fontFamily: 'InterRegular', marginBottom: 24, lineHeight: 20 },

    listContainer: { gap: 12 }, // Espace constant entre chaque ligne

    // Ligne individuelle (ADN TaskItem)
    editRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1
    },
    editRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    modalIconWrapper: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },

    editRowText: { color: Colors.textMuted, fontSize: 15, fontFamily: 'InterRegular' },
    editRowTextSelected: { color: Colors.text, fontFamily: 'PoppinsSemiBold' },

    // Checkbox ADN TaskItem
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxCompleted: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary
    },
});