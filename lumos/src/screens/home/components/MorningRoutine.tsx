import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { BreathingModal } from '@/src/components/organisms/BreathingModal';
import { SelectTaskModal } from '@/src/components/organisms/SelectTaskModal';
import { StretchingModal } from '@/src/components/organisms/StretchingModal';
import { Colors } from '@/src/constants/Colors';
import { XP_REWARDS } from '@/src/constants/Rewards';
import { feedbackService } from '@/src/services/feedbackService';
import { useDailyStore } from '@/src/store/useDailyStore';
import { useUserStore } from '@/src/store/useUserStore';
import { useNetInfo } from '@react-native-community/netinfo'; // 👈 Import de NetInfo
import { Activity, BedDouble, Check, CheckCircle2, Droplet, Plane, Quote, Settings2, ShowerHead, Smile, Sunrise, Target, Wind } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ALL_STEPS_CONFIG = [
    { id: 'water', icon: Droplet, title: "Hydratation", desc: "Boire un grand verre d'eau" },
    { id: 'bed', icon: BedDouble, title: "Faire son lit", desc: "Un geste simple pour commencer" },
    { id: 'mantra', icon: Quote, title: "Mantra du jour", desc: "Répéter 5 fois à voix haute" },
    { id: 'stretching', icon: Activity, title: "Éveil corporel", desc: "Étirements légers" },
    { id: 'breathing', icon: Wind, title: "Respiration", desc: "Apaiser votre système nerveux" },
    { id: 'smile', icon: Smile, title: "Ancrage positif", desc: "Sourire dans un miroir" },
    { id: 'shower', icon: ShowerHead, title: "Douche froide", desc: "Revigore le corps et l'esprit" },
    { id: 'task', icon: Target, title: "Priorité", desc: "Définir l'objectif du jour" }
];

export const MorningRoutine = ({ mantra }: { mantra: string }) => {
    const { morningRoutine, toggleMorningStep, morningFocusCompleted, completeMorningFocus } = useDailyStore();
    const { morningRoutinePreferences, setMorningRoutinePreferences } = useUserStore();

    const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
    const [isBreathingModalVisible, setIsBreathingModalVisible] = useState(false);
    const [isStretchingModalVisible, setStretchingModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // 👈 Détection automatique de la connexion
    const netInfo = useNetInfo();
    const isOffline = netInfo.isConnected === false;

    // Détermination des étapes actives
    const activeSteps = ALL_STEPS_CONFIG.filter(step => morningRoutinePreferences.includes(step.id));

    // 👈 LOGIQUE D'AUTOMATISATION
    useEffect(() => {
        if (activeSteps.length > 0 && !morningFocusCompleted) {
            // On vérifie si TOUTES les étapes actives sont à `true` dans `morningRoutine`
            const isAllCompleted = activeSteps.every(step => morningRoutine[step.id as keyof typeof morningRoutine]);

            if (isAllCompleted) {
                // Petit délai pour laisser l'animation de la dernière case se faire
                setTimeout(() => {
                    completeMorningFocus(isOffline);
                    feedbackService.success(true);
                }, 500);
            }
        }
    }, [morningRoutine, activeSteps, morningFocusCompleted, isOffline, completeMorningFocus]);


    const handleStepAction = (id: string) => {
        if (id === 'stretching') {
            !morningRoutine.stretching ? setStretchingModalVisible(true) : toggleMorningStep('stretching');
        } else if (id === 'breathing') {
            morningRoutine.breathing ? toggleMorningStep('breathing') : setIsBreathingModalVisible(true);
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Routine Matinale</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(true)} style={styles.editBtn}>
                    <Settings2 color={Colors.textMuted} size={20} />
                </TouchableOpacity>
            </View>

            {/* Badge incitatif / confirmant le Mode Avion */}
            {!morningFocusCompleted && activeSteps.length > 0 && (
                <View style={[styles.offlineBadge, !isOffline && styles.offlineBadgeInactive]}>
                    <Plane color={isOffline ? Colors.primary : Colors.textMuted} size={14} />
                    <Text style={[styles.offlineBadgeText, !isOffline && styles.offlineBadgeTextInactive]}>
                        {isOffline
                            ? `Mode Déconnexion : Bonus +${XP_REWARDS.AIRPLANE_BONUS} XP actif`
                            : `Activez le mode avion pour +${XP_REWARDS.AIRPLANE_BONUS} XP bonus`}
                    </Text>
                </View>
            )}
            <View style={styles.grid}>
                {activeSteps.length === 0 ? (
                    <Text style={styles.emptyText}>Votre routine est vide. Cliquez sur l'icône de réglages pour l'assembler.</Text>
                ) : !morningFocusCompleted && (
                    activeSteps.map(step => <ActionTile key={step.id} {...step} />)
                )}
            </View>

            {/* Message de succès une fois tout complété */}
            {morningFocusCompleted && activeSteps.length > 0 && (
                <View style={styles.completedCard}>
                    {/* Icône de fond décorative */}
                    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                        <Sunrise
                            color={Colors.primary}
                            size={120}
                            style={styles.completedBgIcon}
                            opacity={0.04}
                        />
                    </View>

                    <View style={styles.completedHeader}>
                        <View style={styles.completedBadge}>
                            <CheckCircle2 color={Colors.primary} size={14} />
                            <Text style={styles.completedBadgeText}>MATINÉE ACCOMPLIE</Text>
                        </View>
                    </View>

                    <Text style={styles.completedTitle}>
                        La journée t'appartient.
                    </Text>

                    <View style={styles.completedFooter}>
                        <Text style={styles.completedFooterText}>
                            Ton esprit est clair et ton corps est réveillé. Utilise cette dynamique pour relever tes prochains défis avec calme et détermination.
                        </Text>
                    </View>
                </View>
            )}

            {/* MODALE D'ÉDITION (inchangée) */}
            <BaseBottomSheetModal
                isVisible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                title="Personnaliser"
            >
                <Text style={styles.modalSubtitle}>Sélectionnez les étapes de votre matinée idéale.</Text>
                <View style={styles.listContainer}>
                    {ALL_STEPS_CONFIG.map(step => {
                        const isSelected = morningRoutinePreferences.includes(step.id);
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
                                <View style={[styles.checkbox, isSelected && styles.checkboxCompleted]}>
                                    {isSelected && <Check size={14} color={Colors.background} strokeWidth={4} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BaseBottomSheetModal>

            <BreathingModal
                isVisible={isBreathingModalVisible}
                onClose={() => setIsBreathingModalVisible(false)}
                onComplete={() => { toggleMorningStep('breathing'); setIsBreathingModalVisible(false); }}
            />
            <SelectTaskModal
                isVisible={isTaskModalVisible}
                onClose={() => setIsTaskModalVisible(false)}
            />
            <StretchingModal
                isVisible={isStretchingModalVisible}
                onClose={() => setStretchingModalVisible(false)}
                onComplete={() => { if (!morningRoutine.stretching) toggleMorningStep('stretching'); }}
            />
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
    validationContainer: {
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        gap: 15
    },
    airplaneToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    airplaneCheckbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    airplaneCheckboxActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary
    },
    airplaneText: {
        color: Colors.textMuted,
        fontSize: 13,
        fontFamily: 'InterRegular',
        flex: 1,
        lineHeight: 18
    },
    airplaneTextActive: {
        color: Colors.text,
        fontFamily: 'PoppinsMedium'
    },
    validateBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    validateBtnText: {
        color: Colors.background,
        fontSize: 15,
        fontFamily: 'PoppinsBold'
    },
    offlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 15,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)'
    },
    offlineBadgeText: {
        color: Colors.primary,
        fontSize: 12,
        fontFamily: 'PoppinsSemiBold'
    },

    offlineBadgeInactive: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    offlineBadgeTextInactive: {
        color: Colors.textMuted,
        fontFamily: 'InterRegular' // Police plus standard pour contraster avec le gras de l'activation
    },
    completedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 15,
        padding: 12,
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)'
    },
    completedText: {
        color: Colors.primary,
        fontSize: 13,
        fontFamily: 'PoppinsSemiBold'
    },
    // NOUVEAU STYLE DE LA MATINÉE ACCOMPLIE
    completedCard: {
        backgroundColor: 'rgba(212, 175, 55, 0.03)',
        borderRadius: 20,
        padding: 20,
        marginTop: 15,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
        position: 'relative',
        overflow: 'hidden',
    },
    completedBgIcon: {
        position: 'absolute',
        top: -15,
        right: -20,
        transform: [{ rotate: '-10deg' }]
    },
    completedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6
    },
    completedBadgeText: {
        color: Colors.primary,
        fontSize: 10,
        fontFamily: 'PoppinsBold',
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    completedTitle: {
        color: Colors.text,
        fontSize: 16,
        fontFamily: 'PoppinsMedium',
        lineHeight: 24,
        marginBottom: 16
    },
    completedFooter: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(212, 175, 55, 0.1)',
        paddingTop: 16,
    },
    completedFooterText: {
        color: Colors.textMuted,
        fontSize: 13,
        fontFamily: 'InterMedium',
        lineHeight: 20
    }
});