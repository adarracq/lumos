import { Anchor, CheckCircle2, Coffee, Eye, Hand, Headphones } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface GroundingModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const STEPS = [
    { count: 5, sense: "que tu peux VOIR", icon: Eye, color: "#2196F3", desc: "Regarde autour de toi. Un stylo, une ombre, le ciel..." },
    { count: 4, sense: "que tu peux TOUCHER", icon: Hand, color: "#4CAF50", desc: "La texture de tes vêtements, le sol sous tes pieds, la température de l'air..." },
    { count: 3, sense: "que tu peux ENTENDRE", icon: Headphones, color: "#FF9800", desc: "Le vent, une horloge, le bruit lointain de la circulation..." },
    { count: 2, sense: "que tu peux SENTIR", icon: Coffee, color: "#9C27B0", desc: "L'odeur du café, de la pluie, de ta propre peau..." },
    { count: 1, sense: "chose POSITIVE sur toi", icon: Anchor, color: Colors.primary, desc: "Une qualité, une réussite récente, ou simplement le fait que tu respires." }
];

export const GroundingModal = ({ isVisible, onClose }: GroundingModalProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleResetAndClose = () => {
        setCurrentStep(0);
        onClose();
    };

    if (!isVisible) return null;

    const isFinished = currentStep === STEPS.length;
    const stepData = STEPS[currentStep];

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Ancrage Sensoriel"
        >

            {isFinished ? (
                <View style={styles.centerContent}>
                    <View style={[styles.iconCircle, { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: 'rgba(76, 175, 80, 0.2)' }]}>
                        <CheckCircle2 color="#4CAF50" size={48} />
                    </View>
                    <Title center>Te voilà de retour.</Title>
                    <BodyText center style={{ paddingHorizontal: 20, marginBottom: 30, marginTop: 10 }}>
                        Ton esprit est maintenant reconnecté à ton corps et à ton environnement présent.
                    </BodyText>
                    <LumosButton title="Fermer" onPress={handleResetAndClose} style={{ width: '100%' }} />
                </View>
            ) : (
                <View style={styles.stepContainer}>
                    <BodyText style={{ marginBottom: 20, textAlign: 'center' }}>
                        Prends ton temps. Trouve consciemment :
                    </BodyText>

                    <View style={[styles.iconCircle, { backgroundColor: `${stepData.color}15`, borderColor: stepData.color }]}>
                        <stepData.icon color={stepData.color} size={48} />
                    </View>

                    <Text style={[styles.countText, { color: stepData.color }]}>{stepData.count}</Text>
                    <Text style={styles.senseText}>choses</Text>
                    <Text style={styles.senseTextEmphasized}>{stepData.sense}</Text>

                    <Text style={styles.descText}>{stepData.desc}</Text>

                    <LumosButton
                        title={currentStep === STEPS.length - 1 ? "Terminer" : "Suivant"}
                        onPress={handleNext}
                        color={stepData.color}
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

    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    stepContainer: { flex: 1, alignItems: 'center', paddingTop: 20, gap: 16 },
    iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 2, marginBottom: 20 },
    countText: { fontSize: 64, fontFamily: 'PoppinsBold', lineHeight: 70 },
    senseText: { color: Colors.text, fontSize: 20 },
    senseTextEmphasized: { color: Colors.text, fontSize: 24, fontFamily: 'PoppinsBold', textAlign: 'center', marginTop: 4 },
    descText: { color: Colors.textMuted, textAlign: 'center', marginTop: 20, paddingHorizontal: 20, fontSize: 14, fontStyle: 'italic', height: 40 },

    nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 30, marginTop: 'auto', marginBottom: 20 },
    nextBtnText: { color: Colors.background, fontSize: 18, fontWeight: 'bold' }
});