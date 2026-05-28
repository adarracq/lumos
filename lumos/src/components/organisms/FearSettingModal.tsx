// src/components/organisms/FearSettingModal.tsx
import { Compass, Hourglass, ShieldAlert, ShieldCheck, Wrench } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '../../constants/Colors';
import { feedbackService } from '../../services/feedbackService';
import { useJournalStore } from '../../store/useJournalStore';
import { getLogicalTodayKey } from '../../utils/dateUtils';

import { useUserStore } from '@/src/store/useUserStore';
import { LumosButton } from '../atoms/LumosButton';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface FearSettingModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const FearSettingModal = ({ isVisible, onClose }: FearSettingModalProps) => {
    const [step, setStep] = useState(1);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    // Les réponses de la méthode de Tim Ferriss
    const [decision, setDecision] = useState('');
    const [worstCase, setWorstCase] = useState('');
    const [prevention, setPrevention] = useState('');
    const [repair, setRepair] = useState('');
    const [inactionCost, setInactionCost] = useState('');

    const { addEntry } = useJournalStore();

    const handleNextStep = () => {
        feedbackService.medium();
        setStep(step + 1);
    };

    const handleFinish = () => {
        if (addEntry) {
            const combinedContent = `[ACTION REDOUTÉE :]
${decision.trim()}

[PIRE SCÉNARIO :]
${worstCase.trim()}

[PRÉVENTION :]
${prevention.trim()}

[RÉPARATION (Si le pire arrive) :]
${repair.trim()}

[COÛT DE L'INACTION (Dans 1 an) :]
${inactionCost.trim()}`;

            addEntry({
                title: `Fear-Setting : Décision Difficile`,
                content: combinedContent,
                date: getLogicalTodayKey(),
                isFavorite: true, // On le met en favori car c'est un exercice profond
                mood: 'RADIANT'
            });
        }

        feedbackService.heavy();
        trackToolUsage('fearSetting');
        setTimeout(() => feedbackService.success(), 300);

        // Reset
        setStep(1); setDecision(''); setWorstCase(''); setPrevention(''); setRepair(''); setInactionCost('');
        onClose();
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Peur de l'échec"
        >
            {/* ÉTAPE 1 : LA DÉCISION */}
            {step === 1 && (
                <View style={styles.stepContainer}>
                    <Compass color={Colors.primary} size={40} strokeWidth={1.5} style={{ marginBottom: 15 }} />
                    <Text style={styles.questionText}>Quelle action repousses-tu par peur ou par anxiété ?</Text>
                    <Text style={styles.subQuestionText}>(Changer de travail, rompre, lancer un projet...)</Text>
                    <TextInput
                        style={styles.inputArea} placeholder="Je repousse le fait de..."
                        placeholderTextColor={Colors.textMuted} value={decision} multiline textAlignVertical="top"
                        onChangeText={setDecision}
                    />
                    <LumosButton title="Suivant" onPress={handleNextStep} disabled={decision.trim().length === 0} style={{ width: '100%', marginTop: 10 }} />
                </View>
            )}

            {/* ÉTAPE 2 : DÉFINIR & PRÉVENIR */}
            {step === 2 && (
                <View style={styles.stepContainer}>
                    <ShieldAlert color={Colors.error} size={40} strokeWidth={1.5} style={{ marginBottom: 15 }} />
                    <Text style={styles.questionText}>Quel est le pire scénario absolu si tu passes à l'action ?</Text>
                    <TextInput
                        style={styles.inputArea} placeholder="Le pire qui puisse arriver est..."
                        placeholderTextColor={Colors.textMuted} value={worstCase} multiline textAlignVertical="top"
                        onChangeText={setWorstCase}
                    />

                    <ShieldCheck color="#4CAF50" size={24} style={{ marginTop: 10, marginBottom: 10 }} />
                    <Text style={styles.questionText}>Que pourrais-tu faire pour empêcher ce scénario de se produire ?</Text>
                    <TextInput
                        style={styles.inputArea} placeholder="Pour l'éviter, je peux..."
                        placeholderTextColor={Colors.textMuted} value={prevention} multiline textAlignVertical="top"
                        onChangeText={setPrevention}
                    />
                    <LumosButton title="Suivant" onPress={handleNextStep} disabled={worstCase.trim().length === 0 || prevention.trim().length === 0} style={{ width: '100%', marginTop: 10 }} />
                </View>
            )}

            {/* ÉTAPE 3 : RÉPARER */}
            {step === 3 && (
                <View style={styles.stepContainer}>
                    <Wrench color={Colors.primary} size={40} strokeWidth={1.5} style={{ marginBottom: 15 }} />
                    <Text style={styles.questionText}>Si le pire devait tout de même arriver, comment pourrais-tu te relever ou réparer les dégâts ?</Text>
                    <Text style={styles.subQuestionText}>As-tu déjà surmonté une difficulté similaire par le passé ?</Text>
                    <TextInput
                        style={styles.inputArea} placeholder="Je pourrais rebondir en..."
                        placeholderTextColor={Colors.textMuted} value={repair} multiline textAlignVertical="top"
                        onChangeText={setRepair}
                    />
                    <LumosButton title="Suivant" onPress={handleNextStep} disabled={repair.trim().length === 0} style={{ width: '100%', marginTop: 10 }} />
                </View>
            )}

            {/* ÉTAPE 4 : LE COÛT DE L'INACTION */}
            {step === 4 && (
                <View style={styles.stepContainer}>
                    <Hourglass color="#CF6679" size={40} strokeWidth={1.5} style={{ marginBottom: 15 }} />
                    <Text style={styles.questionText}>Le Coût de l'Inaction</Text>
                    <Text style={styles.subQuestionText}>Si tu ne prends pas cette décision, que te coûtera cette inaction dans 1 an ? (Émotionnellement, physiquement, financièrement)</Text>
                    <TextInput
                        style={styles.inputArea} placeholder="Si je ne fais rien, dans 1 an je serai..."
                        placeholderTextColor={Colors.textMuted} value={inactionCost} multiline textAlignVertical="top"
                        onChangeText={setInactionCost}
                    />
                    <LumosButton title="Désamorcer la Peur" onPress={handleFinish} disabled={inactionCost.trim().length === 0} style={{ width: '100%', marginTop: 10 }} />
                </View>
            )}

        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    glassCardModal2: { backgroundColor: 'rgba(30, 30, 30, 0.95)', padding: 24, borderRadius: 24, width: '100%', borderWidth: 1, borderColor: Colors.surfaceLight, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
    glassCardModal: {
        backgroundColor: Colors.surface,
        height: '80%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    stepBadge: { backgroundColor: 'rgba(212, 175, 55, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' },
    stepBadgeText: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 11, letterSpacing: 1 },
    modalTitle: { color: Colors.text, fontSize: 18, fontFamily: 'PoppinsBold' },
    closeBtn: { padding: 4 },

    stepContainer: { alignItems: 'center', paddingBottom: 10 },
    questionText: { fontSize: 15, fontFamily: 'PoppinsSemiBold', color: Colors.text, textAlign: 'center', marginBottom: 6 },
    subQuestionText: { fontSize: 12, fontFamily: 'InterRegular', color: Colors.textMuted, textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },

    inputArea: { width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: 16, color: Colors.text, fontSize: 14, fontFamily: 'InterRegular', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', minHeight: 100, textAlignVertical: 'top', marginBottom: 20, lineHeight: 22 }
});