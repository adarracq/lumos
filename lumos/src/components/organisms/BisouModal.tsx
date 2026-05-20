import { feedbackService } from '@/src/services/feedbackService';
import { Check, Clock, Copy, MapPin, ShoppingBag, Wrench } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface BisouModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const BISOU_STEPS = [
    {
        letter: "B", title: "Besoin",
        question: "À quel besoin cet achat répond-il ?",
        desc: "Est-ce un besoin d'estime, de confort, de réconfort émotionnel ? L'objet lui-même est-il le seul moyen d'y répondre ?",
        icon: ShoppingBag, color: "#E91E63"
    },
    {
        letter: "I", title: "Immédiateté",
        question: "En ai-je besoin immédiatement ?",
        desc: "L'urgence est souvent créée de toutes pièces par le marketing (promotions, rareté). Que se passe-t-il si tu attends 48h ?",
        icon: Clock, color: "#FF9800"
    },
    {
        letter: "S", title: "Semblable",
        question: "Ai-je déjà un objet similaire ?",
        desc: "Possèdes-tu déjà quelque chose qui fait à peu près la même chose ou qui pourrait être réparé/réutilisé ?",
        icon: Copy, color: "#2196F3"
    },
    {
        letter: "O", title: "Origine",
        question: "Quelle est l'origine de ce produit ?",
        desc: "Où a-t-il été fabriqué ? Par qui ? Dans quelles conditions ? Ce produit correspond-il à tes valeurs éthiques ?",
        icon: MapPin, color: "#4CAF50"
    },
    {
        letter: "U", title: "Utilité",
        question: "Cet objet me sera-t-il vraiment utile ?",
        desc: "Va-t-il t'apporter une vraie valeur ajoutée au quotidien, ou va-t-il finir dans un placard dans 3 mois ?",
        icon: Wrench, color: "#9C27B0"
    }
];

export const BisouModal = ({ isVisible, onClose }: BisouModalProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < BISOU_STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleResetAndClose = () => {
        setCurrentStep(0);
        onClose();
    };

    if (!isVisible) return null;

    const isFinished = currentStep === BISOU_STEPS.length;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={handleResetAndClose}
            title="Filtre d'Acquisition"
        >

            {isFinished ? (
                <View style={styles.centerContent}>
                    <View style={styles.successIconBg}>
                        <Check color={Colors.primary} size={48} />
                    </View>
                    <Title center>Le test est terminé.</Title>
                    <BodyText center style={{ paddingHorizontal: 20, marginBottom: 30 }}>
                        Si tu as un doute sur une seule de ces questions, applique la <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>règle des 48 heures</Text>. Attends deux jours. Si l'envie est toujours là et justifiée, tu pourras l'acheter l'esprit tranquille.
                    </BodyText>

                    <LumosButton
                        title="Je reporte mon achat (48h)"
                        onPress={handleResetAndClose}
                        style={{ width: '100%', marginBottom: 15 }}
                    />
                    <TouchableOpacity onPress={handleResetAndClose}>
                        <Text style={styles.secondaryBtnText}>J'achète de manière éclairée</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.stepContainer}>
                    <View style={styles.progressRow}>
                        {BISOU_STEPS.map((step, index) => (
                            <Text
                                key={step.letter}
                                style={[
                                    styles.progressLetter,
                                    index === currentStep && { color: step.color, transform: [{ scale: 1.3 }] },
                                    index < currentStep && { color: Colors.textMuted }
                                ]}
                            >
                                {step.letter}
                            </Text>
                        ))}
                    </View>

                    <View style={[styles.iconCircle, { backgroundColor: `${BISOU_STEPS[currentStep].color}15`, borderColor: BISOU_STEPS[currentStep].color }]}>
                        {React.createElement(BISOU_STEPS[currentStep].icon, { color: BISOU_STEPS[currentStep].color, size: 48 })}
                    </View>

                    <Title center style={{ color: BISOU_STEPS[currentStep].color, marginBottom: 10 }}>
                        {BISOU_STEPS[currentStep].title}
                    </Title>

                    <Text style={styles.questionText}>{BISOU_STEPS[currentStep].question}</Text>
                    <Text style={styles.descText}>{BISOU_STEPS[currentStep].desc}</Text>

                    <LumosButton
                        title={currentStep === BISOU_STEPS.length - 1 ? "Terminer" : "Suivant"}
                        onPress={() => { handleNext(); feedbackService.light(); }}
                        color={BISOU_STEPS[currentStep].color}
                        style={{ width: '80%' }}
                    />
                </View>
            )}

        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.surface, height: '80%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
    successIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(212, 175, 55, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' },
    secondaryBtnText: { color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline', fontWeight: '500' },

    stepContainer: { flex: 1, alignItems: 'center', paddingTop: 10, gap: 16 },

    // Glass Progress Row
    progressRow: { flexDirection: 'row', gap: 15, marginBottom: 30, backgroundColor: 'rgba(255, 255, 255, 0.03)', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    progressLetter: { fontSize: 24, fontFamily: 'PoppinsBold', color: Colors.surfaceLight, transition: 'all 0.3s ease' } as any,

    iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 2, marginBottom: 20 },
    questionText: { color: Colors.text, fontSize: 20, fontFamily: 'PoppinsSemiBold', textAlign: 'center', marginBottom: 15 },
    descText: { color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 10, fontSize: 14, lineHeight: 22 },

    nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, marginTop: 'auto', marginBottom: 20 },
    nextBtnText: { color: Colors.background, fontSize: 18, fontWeight: 'bold' }
});