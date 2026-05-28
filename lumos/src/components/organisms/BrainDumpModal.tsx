// src/components/organisms/BrainDumpModal.tsx
import { feedbackService } from '@/src/services/feedbackService';
import { useUserStore } from '@/src/store/useUserStore';
import { Cloud, Trash2, Wind } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface BrainDumpModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const THEME_COLOR = '#607D8B'; // Gris/Bleu apaisant
const DUMP_TIME = 120; // 2 minutes

export const BrainDumpModal = ({ isVisible, onClose }: BrainDumpModalProps) => {

    const [gameState, setGameState] = useState<'intro' | 'writing' | 'evaporating' | 'result'>('intro');
    const [timeLeft, setTimeLeft] = useState(DUMP_TIME);
    const [text, setText] = useState('');
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    // Animation d'évaporation
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            setGameState('intro');
            setText('');
            fadeAnim.setValue(1);
            translateYAnim.setValue(0);
        }
    }, [isVisible]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (gameState === 'writing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'writing') {
            finishDump();
        }
        return () => clearTimeout(timer);
    }, [timeLeft, gameState]);

    const startWriting = () => {
        setTimeLeft(DUMP_TIME);
        setText('');
        setGameState('writing');
        setTimeout(() => {
            // Optionnel : focus automatique sur le champ texte
        }, 300);
    };

    const finishDump = () => {
        Keyboard.dismiss();
        setGameState('evaporating');
        feedbackService.heavy();
        trackToolUsage('brainDump');

        // 1. Animation de disparition (le texte monte et s'efface)
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 3000,
                useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
                toValue: -50,
                duration: 3000,
                useNativeDriver: true,
            })
        ]).start(() => {
            // 2. Fin de l'animation -> Affichage du résultat
            setGameState('result');
        });
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal isVisible={isVisible} onClose={onClose} title="Surcharge mentale">
            {/* --- INTRO --- */}
            {gameState === 'intro' && (
                <View style={styles.centerContent}>
                    <View style={styles.readyIconWrapper}>
                        <Cloud color={THEME_COLOR} size={48} />
                    </View>
                    <Title center style={{ marginTop: 16 }}>Vider le brouillard</Title>

                    <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 10, marginTop: 15 }}>
                        Surcharge mentale ? Pensées en boucle ? {'\n\n'}
                        Tu as 2 minutes pour taper ABSOLUMENT TOUT ce qui te passe par la tête, sans filtrer ni corriger tes fautes. {'\n\n'}
                        Ce texte ne sera pas sauvegardé. Il s'évaporera à la fin du temps.
                    </BodyText>

                    <LumosButton title="Commencer (2 min)" onPress={startWriting} color={THEME_COLOR} style={{ width: '100%' }} />
                </View>
            )}

            {/* --- PHASE D'ÉCRITURE --- */}
            {gameState === 'writing' && (
                <View style={styles.writingContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.writingTitle}>Vide ton esprit...</Text>
                        <View style={[styles.timerBadge, timeLeft <= 15 && { borderColor: Colors.error, backgroundColor: 'rgba(207, 102, 121, 0.1)' }]}>
                            <Text style={[styles.timerText, timeLeft <= 15 && { color: Colors.error }]}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </Text>
                        </View>
                    </View>

                    <TextInput
                        style={styles.textArea}
                        placeholder="Écris tout ce qui te pèse, les trucs à faire, tes frustrations..."
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        multiline
                        autoFocus
                        textAlignVertical="top"
                        value={text}
                        onChangeText={setText}
                    />

                    {/* Bouton pour finir plus tôt si l'utilisateur a tout vidé */}
                    <TouchableOpacity style={styles.finishEarlyBtn} onPress={finishDump} activeOpacity={0.7}>
                        <Trash2 color={Colors.textMuted} size={18} />
                        <Text style={styles.finishEarlyText}>J'ai tout vidé (Terminer)</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* --- PHASE D'ÉVAPORATION (Animation) --- */}
            {gameState === 'evaporating' && (
                <View style={styles.evaporatingContainer}>
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: translateYAnim }], flex: 1, width: '100%' }}>
                        <Text style={styles.evaporatingText}>
                            {text || "Rien à évacuer..."}
                        </Text>
                    </Animated.View>
                    <View style={styles.evaporatingOverlay}>
                        <Wind color={THEME_COLOR} size={40} style={{ opacity: 0.5 }} />
                        <Text style={styles.evaporatingLabel}>Le brouillard se dissipe...</Text>
                    </View>
                </View>
            )}

            {/* --- RÉSULTATS --- */}
            {gameState === 'result' && (
                <View style={styles.centerContent}>
                    <View style={[styles.readyIconWrapper, { borderColor: THEME_COLOR }]}>
                        <Wind color={THEME_COLOR} size={48} />
                    </View>
                    <Title center style={{ marginTop: 16 }}>Esprit libéré</Title>

                    <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, marginTop: 15 }}>
                        Tes pensées ont quitté ton esprit et n'existent plus nulle part. {'\n\n'}
                        Prends une grande inspiration, et reprends ta journée avec plus de légèreté.
                    </BodyText>

                    <LumosButton title="Fermer" onPress={onClose} color={THEME_COLOR} style={{ width: '100%' }} />
                </View>
            )}
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: { minHeight: 450, justifyContent: 'center' },
    centerContent: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingTop: 10 },

    readyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(96, 125, 139, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: 'rgba(96, 125, 139, 0.3)' },

    // Écriture
    writingContainer: { flex: 1, paddingTop: 10, paddingBottom: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    writingTitle: { color: Colors.text, fontSize: 16, fontFamily: 'PoppinsSemiBold' },
    timerBadge: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
    timerText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 14 },

    textArea: {
        flex: 1,
        minHeight: 200,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 16,
        color: Colors.text,
        fontSize: 16,
        fontFamily: 'InterRegular',
        lineHeight: 24,
    },

    finishEarlyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, paddingVertical: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12 },
    finishEarlyText: { color: Colors.textMuted, fontSize: 13, fontFamily: 'PoppinsMedium', marginLeft: 8 },

    // Évaporation
    evaporatingContainer: { flex: 1, paddingTop: 10, position: 'relative', minHeight: 250 },
    evaporatingText: {
        color: Colors.text,
        fontSize: 16,
        fontFamily: 'InterRegular',
        lineHeight: 24,
        opacity: 0.5,
    },
    evaporatingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(18, 18, 18, 0.7)', // Fond semi-transparent qui masque le texte
    },
    evaporatingLabel: {
        color: THEME_COLOR,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 16,
        marginTop: 15,
        letterSpacing: 1,
    }
});