// src/components/organisms/BoredomModal.tsx
import { Hourglass, Smile } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

export const BoredomModal = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {
    const [timeLeft, setTimeLeft] = useState(120);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const endTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (isVisible) {
            const durationSeconds = 120;
            setTimeLeft(durationSeconds);
            endTimeRef.current = Date.now() + durationSeconds * 1000;
            setIsActive(true);
            setIsFinished(false);
        } else {
            setIsActive(false);
        }
    }, [isVisible]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive) {
            interval = setInterval(() => {
                if (endTimeRef.current) {
                    const now = Date.now();
                    const newTimeLeft = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
                    setTimeLeft(newTimeLeft);
                    if (newTimeLeft === 0) {
                        setIsActive(false);
                        setIsFinished(true);
                    }
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    return (

        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Éloge de l'Ennui"
        >

            {isFinished ? (
                <View style={styles.center}>
                    <View style={[styles.iconWrapper, { backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.2)' }]}>
                        <Smile color={Colors.primary} size={48} />
                    </View>
                    <Title center style={{ marginBottom: 10 }}>Attention restaurée</Title>
                    <BodyText center style={{ marginBottom: 30 }}>Tu as été capable de rester 120 secondes avec tes propres pensées. Ton attention est restaurée.</BodyText>
                    <LumosButton title="Retour au monde" onPress={onClose} style={{ width: '100%' }} />
                </View>
            ) : (
                <View style={styles.center}>
                    <View style={[styles.iconWrapper, { backgroundColor: 'rgba(255, 152, 0, 0.1)', borderColor: 'rgba(255, 152, 0, 0.2)' }]}>
                        <Hourglass color="#FF9800" size={40} />
                    </View>
                    <Text style={styles.timer}>{timeLeft}s</Text>
                    <Text style={styles.instruction}>Pose ton téléphone ou verrouille l'écran. Ne fais absolument rien. Laisse tes pensées vagabonder.</Text>
                </View>
            )}
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: Colors.surface,
        height: '65%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },

    // NOUVEAU: Icon Wrapper Glass
    iconWrapper: { padding: 24, borderRadius: 40, borderWidth: 1, marginBottom: 20 },

    timer: { fontSize: 72, fontFamily: 'PoppinsBold', color: '#FF9800', marginBottom: 20, letterSpacing: 2 },
    instruction: { color: Colors.textMuted, fontSize: 15, textAlign: 'center', lineHeight: 24, fontFamily: 'InterRegular' }
});