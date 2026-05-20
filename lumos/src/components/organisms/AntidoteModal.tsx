import { BatteryCharging, Heart } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useToastStore } from '../../store/useToastStore';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface AntidoteModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const AntidoteModal = ({ isVisible, onClose }: AntidoteModalProps) => {
    const [step, setStep] = useState(1);
    const { showToast } = useToastStore();

    const handleOpenSMS = () => {
        Linking.openURL(`sms:?body=Salut, je pensais à toi. Je voulais juste te dire merci d'être dans ma vie et pour tout ce que tu m'apportes. Ça compte beaucoup pour moi. 🙏`);
        showToast("Action enregistrée");
        handleResetAndClose();
    };

    const handleResetAndClose = () => {
        setStep(1);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={handleResetAndClose}
            title="L'Antidote"
        >
            {step === 1 ? (
                <View style={styles.centerContent}>
                    <View style={[styles.iconCircle, { borderColor: "#009688", backgroundColor: 'rgba(0, 150, 136, 0.1)' }]}>
                        <BatteryCharging color="#009688" size={40} />
                    </View>

                    <Title center style={{ color: "#009688" }}>Visualisation Négative</Title>

                    <BodyText center style={{ paddingHorizontal: 10, marginTop: 15, marginBottom: 15 }}>
                        L'ingratitude détruit notre bien-être, isole et génère du stress. Pour recadrer ton cerveau, fais cet exercice :
                    </BodyText>

                    <View style={styles.quoteBox}>
                        <Text style={styles.quoteText}>
                            "Ferme les yeux 30 secondes. Imagine que tu perds tout. Que tes proches disparaissent. Que ta santé s'envole. Imagine le vide absolu."
                        </Text>
                    </View>

                    <BodyText center style={{ paddingHorizontal: 10, marginTop: 15 }}>
                        Maintenant, ouvre les yeux. Tout est toujours là. Qui est la personne que tu as négligée récemment et qui contribue à ce que tu as aujourd'hui ?
                    </BodyText>

                    <LumosButton
                        title="J'ai une personne en tête"
                        onPress={() => setStep(2)}
                        style={{ width: '100%', }}
                        color={"#009688"}
                    />
                </View>
            ) : (
                <View style={styles.centerContent}>
                    <View style={[styles.iconCircle, { borderColor: Colors.primary, backgroundColor: 'rgba(212, 175, 55, 0.1)' }]}>
                        <Heart color={Colors.primary} size={40} />
                    </View>

                    <Title center>Le Pouvoir de l'Action</Title>

                    <BodyText center style={{ paddingHorizontal: 10, marginTop: 15, marginBottom: 30 }}>
                        Ne garde pas cette gratitude pour toi. La règle des 48h indique que l'émotion redescendra vite. Envoie-lui un message maintenant.
                    </BodyText>

                    <View style={styles.smsPreview}>
                        <Text style={styles.smsPreviewText}>
                            "Salut, je pensais à toi. Je voulais juste te dire merci d'être dans ma vie..."
                        </Text>
                    </View>

                    <LumosButton
                        title="Envoyer le message"
                        onPress={handleOpenSMS}
                        style={{ width: '100%', marginTop: 'auto' }}
                    />

                    <TouchableOpacity onPress={handleResetAndClose} style={{ marginTop: 15 }}>
                        <Text style={{ color: Colors.textMuted, textDecorationLine: 'underline' }}>Je le ferai plus tard (Déconseillé)</Text>
                    </TouchableOpacity>
                </View>
            )}

        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.surface, height: '90%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

    centerContent: { flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 20, gap: 16 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 2, marginBottom: 15 },

    // Glass Quote Box
    quoteBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 20, borderRadius: 16, borderLeftWidth: 3, borderLeftColor: "#009688", borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginTop: 10 },
    quoteText: { color: Colors.text, fontSize: 16, fontStyle: 'italic', lineHeight: 24, fontFamily: 'PoppinsSemiBold' },

    // Glass SMS Preview (Plus sombre pour simuler un input)
    smsPreview: { backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', width: '100%', borderBottomRightRadius: 4 },
    smsPreviewText: { color: Colors.text, fontSize: 15, lineHeight: 22 }
});