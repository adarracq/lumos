// src/components/organisms/AntidoteModal.tsx
import { useUserStore } from '@/src/store/useUserStore';
import { BatteryCharging, EyeOff, Heart, Play, Sun } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { feedbackService } from '../../services/feedbackService';
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
    const [timeLeft, setTimeLeft] = useState(30);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const { showToast } = useToastStore();
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    // Gestion du chronomètre pour l'étape 2
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (step === 2 && isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (step === 2 && isTimerRunning && timeLeft === 0) {
            // Fin du chrono : on vibre fortement et on joue le son de succès
            feedbackService.heavy();
            setTimeout(() => feedbackService.success(true), 200);
            setIsTimerRunning(false);
            setStep(3);
        }

        return () => clearInterval(interval);
    }, [step, isTimerRunning, timeLeft]);

    const handleOpenSMS = () => {
        Linking.openURL(`sms:?body=Salut, je pensais à toi. Je voulais juste te dire merci d'être dans ma vie et pour tout ce que tu m'apportes. Ça compte beaucoup pour moi. 🙏`);
        showToast("Action enregistrée");
        trackToolUsage('antidote');
        handleResetAndClose();
    };

    const handleResetAndClose = () => {
        setStep(1);
        setTimeLeft(30);
        setIsTimerRunning(false);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={handleResetAndClose}
            title="Baisse de moral"
        >
            {/* ÉTAPE 1 : EXPLICATION */}
            {step === 1 && (
                <View style={styles.centerContent}>
                    <View style={[styles.iconCircle, { borderColor: "#009688", backgroundColor: 'rgba(0, 150, 136, 0.1)' }]}>
                        <BatteryCharging color="#009688" size={40} />
                    </View>

                    <Title center style={{ color: "#009688" }}>Recadrage Mental</Title>

                    <BodyText center style={{ paddingHorizontal: 10, marginTop: 15, marginBottom: 15 }}>
                        L'ingratitude détruit notre bien-être, isole et génère du stress. Pour reprogrammer ton cerveau, nous allons pratiquer la visualisation négative.
                    </BodyText>

                    <LumosButton
                        title="Découvrir l'exercice"
                        onPress={() => { feedbackService.light(); setStep(2); }}
                        style={{ width: '100%', marginTop: 'auto' }}
                        color={"#009688"}
                    />
                </View>
            )}

            {/* ÉTAPE 2 : LE CHRONO (VISUALISATION NÉGATIVE) */}
            {step === 2 && (
                <View style={styles.centerContent}>
                    <View style={[styles.iconCircle, { borderColor: "#CF6679", backgroundColor: 'rgba(207, 102, 121, 0.1)' }]}>
                        <EyeOff color="#CF6679" size={40} />
                    </View>

                    <Title center style={{ color: "#CF6679" }}>Visualisation</Title>

                    <View style={[styles.quoteBox, { borderLeftColor: "#CF6679" }]}>
                        <Text style={styles.quoteText}>
                            "Imagine que tu perds tout. Que tes proches disparaissent. Que ta santé s'envole. Imagine le vide absolu."
                        </Text>
                    </View>

                    {/* Bloc Chrono avec hauteur fixe pour éviter les sauts d'écran */}
                    <View style={styles.timerBlock}>
                        <Text style={styles.timerText}>{timeLeft}s</Text>

                        {!isTimerRunning ? (
                            <TouchableOpacity
                                style={styles.playCircle}
                                onPress={() => { feedbackService.medium(); setIsTimerRunning(true); }}
                                activeOpacity={0.7}
                            >
                                <Play color="#CF6679" size={22} fill="#CF6679" style={{ marginLeft: 3 }} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.playPlaceholder} />
                        )}
                    </View>

                    <BodyText center color={Colors.textMuted} style={{ paddingHorizontal: 10 }}>
                        Lis bien la phrase, lance le chrono et ferme les yeux. Le téléphone vibrera à la fin.
                    </BodyText>

                    <TouchableOpacity onPress={() => { setIsTimerRunning(false); setStep(3); feedbackService.light(); }} style={{ marginTop: 'auto', padding: 10 }}>
                        <Text style={{ color: Colors.textMuted, textDecorationLine: 'underline', fontSize: 12 }}>Passer le chrono</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* ÉTAPE 3 : LE RÉVEIL */}
            {step === 3 && (
                <View style={styles.centerContent}>
                    <View style={[styles.iconCircle, { borderColor: "#4CAF50", backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                        <Sun color="#4CAF50" size={40} />
                    </View>

                    <Title center style={{ color: "#4CAF50" }}>Ouvre les yeux</Title>

                    <BodyText center style={{ paddingHorizontal: 10, marginTop: 15, marginBottom: 30, fontSize: 16 }}>
                        Tout est toujours là. Rien n'a disparu.{"\n\n"}
                        Qui est la personne que tu as peut-être un peu négligée récemment et qui contribue au fait que ta vie n'est pas vide aujourd'hui ?
                    </BodyText>

                    <LumosButton
                        title="J'ai une personne en tête"
                        onPress={() => { setStep(4); feedbackService.light(); }}
                        style={{ width: '100%', marginTop: 'auto' }}
                        color={"#4CAF50"}
                    />
                </View>
            )}

            {/* ÉTAPE 4 : L'ACTION */}
            {step === 4 && (
                <View style={styles.centerContent}>
                    <View style={[styles.iconCircle, { borderColor: Colors.primary, backgroundColor: 'rgba(212, 175, 55, 0.1)' }]}>
                        <Heart color={Colors.primary} size={40} />
                    </View>

                    <Title center>Le Pouvoir de l'Action</Title>

                    <BodyText center style={{ paddingHorizontal: 10, marginTop: 15, marginBottom: 30 }}>
                        Ne garde pas cette gratitude pour toi. L'émotion redescendra vite. Envoie-lui un message maintenant.
                    </BodyText>

                    <View style={[styles.smsPreview, { borderColor: Colors.primary }]}>
                        <Text style={styles.smsPreviewText}>
                            "Salut, je pensais à toi. Je voulais juste te dire merci d'être dans ma vie..."
                        </Text>
                    </View>

                    <LumosButton
                        title="Envoyer le message"
                        onPress={handleOpenSMS}
                        style={{ width: '100%', marginTop: 'auto' }}
                    />

                    <TouchableOpacity onPress={handleResetAndClose} style={{ marginTop: 15, padding: 10 }}>
                        <Text style={{ color: Colors.textMuted, textDecorationLine: 'underline', fontSize: 12 }}>Je le ferai plus tard (Déconseillé)</Text>
                    </TouchableOpacity>
                </View>
            )}
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    centerContent: { flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 20, gap: 8 },
    iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 2, marginBottom: 5 },

    // Glass Quote Box (Étape 2)
    quoteBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 16, borderLeftWidth: 3, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginTop: 10, width: '100%' },
    quoteText: { color: Colors.text, fontSize: 14, fontStyle: 'italic', lineHeight: 22, fontFamily: 'PoppinsMedium', textAlign: 'center' },

    // Zone du chrono à hauteur fixe pour éviter les sauts (Layout Shift)
    timerBlock: {
        height: 120, // Hauteur fixe pour contenir le texte ET le bouton
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    timerText: {
        fontSize: 54,
        fontFamily: 'PoppinsBold',
        color: Colors.text,
        lineHeight: 60 // Évite que le texte soit coupé sur certains Android
    },
    playCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: 'rgba(207, 102, 121, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(207, 102, 121, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    playPlaceholder: {
        width: 46,
        height: 46,
        marginTop: 8,
    }, // Espace vide qui remplace le bouton Play quand il tourne

    // Glass SMS Preview (Étape 4)
    smsPreview: { backgroundColor: 'rgba(0, 0, 0, 0.3)', padding: 20, borderRadius: 20, borderWidth: 1, borderBottomRightRadius: 4, width: '100%' },
    smsPreviewText: { color: Colors.text, fontSize: 15, lineHeight: 22, fontFamily: 'InterRegular' }
});