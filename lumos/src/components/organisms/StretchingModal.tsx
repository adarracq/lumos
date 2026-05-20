import { feedbackService } from '@/src/services/feedbackService';
import { CheckCircle2, ChevronRight, Pause, Play, RefreshCw } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ALL_STRETCHES, StretchDef } from '../../constants/Stretches';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface StretchingModalProps {
    isVisible: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export const StretchingModal = ({ isVisible, onClose, onComplete }: StretchingModalProps) => {
    const [dailyStretches, setDailyStretches] = useState<StretchDef[]>([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const endTimeRef = useRef<number | null>(null);
    const remainingTimeRef = useRef<number>(30);

    useEffect(() => {
        if (isVisible) {
            const shuffled = [...ALL_STRETCHES].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 4);

            setDailyStretches(selected);
            setCurrentIndex(0);

            const initialDuration = selected[0].duration;
            setTimeLeft(initialDuration);
            remainingTimeRef.current = initialDuration;

            setIsActive(false);
            setIsFinished(false);
            endTimeRef.current = null;
        } else {
            setIsActive(false);
            setDailyStretches([]);
        }
    }, [isVisible]);

    const currentStretch = dailyStretches[currentIndex];

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive && !isFinished) {
            interval = setInterval(() => {
                if (endTimeRef.current) {
                    const now = Date.now();
                    const newTimeLeft = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
                    setTimeLeft(newTimeLeft);
                    remainingTimeRef.current = newTimeLeft;
                    if (newTimeLeft === 0) handleNext();
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isActive, isFinished, currentIndex]);

    const handleNext = () => {
        feedbackService.medium();
        if (currentIndex < dailyStretches.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            const nextDuration = dailyStretches[nextIndex].duration;

            setTimeLeft(nextDuration);
            remainingTimeRef.current = nextDuration;

            setIsActive(false);
            endTimeRef.current = null;
        } else {
            setIsActive(false);
            setIsFinished(true);
            feedbackService.success();
        }
    };

    const togglePause = () => {
        if (isActive) {
            setIsActive(false);
            endTimeRef.current = null;
        } else {
            setIsActive(true);
            endTimeRef.current = Date.now() + remainingTimeRef.current * 1000;
        }
    };

    // 💡 NOUVEAU: Fonction pour changer l'étirement en cours
    const handleSwapCurrent = () => {
        // On cherche les étirements qui ne sont pas déjà dans la session en cours
        const availableStretches = ALL_STRETCHES.filter(
            (stretch) => !dailyStretches.some((ds) => ds.id === stretch.id)
        );

        if (availableStretches.length === 0) return; // Sécurité si on a déjà tout mis

        // On en prend un au hasard
        const randomNewStretch = availableStretches[Math.floor(Math.random() * availableStretches.length)];

        // On le remplace dans la liste du jour
        const updatedStretches = [...dailyStretches];
        updatedStretches[currentIndex] = randomNewStretch;

        setDailyStretches(updatedStretches);

        // On remet le chrono à zéro pour ce nouvel exercice et on met en pause
        const newDuration = randomNewStretch.duration;
        setTimeLeft(newDuration);
        remainingTimeRef.current = newDuration;
        setIsActive(false);
        endTimeRef.current = null;
    };

    const handleFinish = () => {
        onComplete();
        onClose();
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Éveil corporel"
        >
            {isFinished ? (
                <View style={styles.centerContent}>
                    <View style={[styles.iconCircle, { borderColor: 'rgba(76, 175, 80, 0.2)', backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                        <CheckCircle2 color={Colors.primary} size={64} />
                    </View>
                    <Title center style={{ marginTop: 20 }}>Excellent !</Title>
                    <BodyText center style={{ marginBottom: 30 }}>
                        Ton corps est réveillé et prêt pour la journée.
                    </BodyText>
                    <LumosButton title="Valider l'éveil" onPress={handleFinish} style={{ width: '100%' }} />
                </View>
            ) : currentStretch ? (
                <View style={styles.centerContent}>
                    <View style={styles.glassProgressBadge}>
                        <Text style={styles.progressText}>
                            Posture {currentIndex + 1} / {dailyStretches.length}
                        </Text>
                    </View>

                    <Title center>{currentStretch.name}</Title>
                    <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 20 }}>
                        {currentStretch.description}
                    </BodyText>

                    <View style={styles.glassImageContainer}>
                        <currentStretch.image width={120} height={120} color={Colors.primary} />
                    </View>

                    <Text style={[styles.timerText, { color: timeLeft <= 5 ? Colors.error : Colors.primary }]}>
                        {timeLeft}s
                    </Text>

                    <View style={styles.controls}>
                        <TouchableOpacity style={styles.glassSecondaryControlBtn} onPress={() => { handleSwapCurrent(); feedbackService.error(); }} activeOpacity={0.7}>
                            <RefreshCw color={Colors.textMuted} size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.glassControlBtn} onPress={() => { togglePause(); feedbackService.light(); }} activeOpacity={0.7}>
                            {isActive ? <Pause color={Colors.text} size={24} /> : <Play color={Colors.text} size={24} style={{ marginLeft: 4 }} />}
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.glassControlBtn, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]} onPress={handleNext}>
                            <ChevronRight color={Colors.text} size={24} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.centerContent}><Text style={{ color: Colors.textMuted }}>Chargement...</Text></View>
            )}

        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.surface, height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

    centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },

    glassProgressBadge: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
    progressText: { color: Colors.primary, fontFamily: 'PoppinsBold', letterSpacing: 1, fontSize: 11, textTransform: 'uppercase' },

    glassImageContainer: { width: 200, height: 200, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 30, borderWidth: 2, borderColor: 'rgba(212, 175, 55, 0.3)' },
    timerText: { fontSize: 64, fontFamily: 'PoppinsBold', marginBottom: 30 },

    controls: { flexDirection: 'row', gap: 20, alignItems: 'center' },

    // NOUVEAU: Style pour le bouton secondaire (Swap)
    glassSecondaryControlBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },

    glassControlBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
});