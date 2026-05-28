// src/components/organisms/HabitTimerModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { Colors } from '@/src/constants/Colors';
import { feedbackService } from '@/src/services/feedbackService';
import { Timer } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HabitTimerModalProps {
    isVisible: boolean;
    habitName: string;
    remainingMinutes: number; // Peut maintenant être un nombre à virgule (ex: 13.5)
    color: string;
    onClose: () => void;
    onComplete: (minutesDone: number) => void;
}

export const HabitTimerModal = ({ isVisible, habitName, remainingMinutes, color, onClose, onComplete }: HabitTimerModalProps) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const endTimeRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (isVisible && remainingMinutes > 0) {
            // Même si remainingMinutes est un float (ex: 13.5), totalSeconds sera juste (810)
            const totalSeconds = remainingMinutes * 60;
            setTimeLeft(totalSeconds);
            setElapsedSeconds(0);
            const now = Date.now();
            endTimeRef.current = now + totalSeconds * 1000;
            startTimeRef.current = now;
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [isVisible, remainingMinutes]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive) {
            interval = setInterval(() => {
                const now = Date.now();
                if (endTimeRef.current && startTimeRef.current) {
                    const newTimeLeft = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
                    const newElapsed = Math.max(0, Math.round((now - startTimeRef.current) / 1000));
                    setTimeLeft(newTimeLeft);
                    setElapsedSeconds(newElapsed);
                    if (newTimeLeft === 0) setIsActive(false);
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    // Quand le timer arrive naturellement à 0
    useEffect(() => {
        if (isVisible && timeLeft === 0 && elapsedSeconds > 0 && !isActive) {
            feedbackService.success(true);
            const minutesDone = elapsedSeconds / 60;
            onComplete(minutesDone);
            onClose();
        }
    }, [timeLeft, isActive, isVisible]);

    // Quand l'utilisateur clique sur "Interrompre & Sauvegarder"
    const handleStopEarly = () => {
        setIsActive(false);
        // 💡 MODIFICATION ICI : On enlève Math.floor pour renvoyer la fraction de minutes exacte
        const minutesDone = elapsedSeconds / 60;
        onComplete(minutesDone);
        onClose();
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60); // Math.floor rajouté par sécurité sur les secondes
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title={habitName}
        >
            <View style={styles.centerContent}>
                <View style={[styles.iconWrapper, { backgroundColor: `${color}15`, borderColor: `${color}30` }]}>
                    <Timer color={color} size={48} />
                </View>

                <Title center style={{ color, marginTop: 24 }}>{habitName}</Title>

                <Text style={[styles.timerText, { color }]}>
                    {formatTime(timeLeft)}
                </Text>

                <BodyText center color={Colors.textMuted} style={{ marginBottom: 40, opacity: 0.8 }}>
                    Tu peux verrouiller ton écran, le minuteur continue en arrière-plan.
                </BodyText>

                <LumosButton
                    title="Interrompre & Sauvegarder"
                    onPress={handleStopEarly}
                    color={color}
                    style={{ marginBottom: 12, width: '100%' }}
                />
            </View>
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: Colors.surface,
        height: '75%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.2, shadowRadius: 20
    },
    closeBtn: { alignSelf: 'flex-end', marginBottom: 10, padding: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20 },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    iconWrapper: {
        padding: 24,
        borderRadius: 40,
        borderWidth: 1,
        marginBottom: 8
    },
    timerText: {
        fontSize: 80,
        fontFamily: 'InterRegular',
        fontWeight: '800',
        letterSpacing: 2,
        marginVertical: 24
    },
    stopButton: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    stopButtonText: {
        fontFamily: 'PoppinsBold',
        fontSize: 15,
        letterSpacing: 0.5
    }
});