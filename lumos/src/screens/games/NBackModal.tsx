// src/components/organisms/NBackModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { XP_REWARDS } from '@/src/constants/Rewards';
import { feedbackService } from '@/src/services/feedbackService';
import { grantXP } from '@/src/utils/rewardManager';
import { Activity, Award, Check, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useUserStore } from '../../store/useUserStore';

interface NBackModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const TOTAL_ROUNDS = 20;

export const NBackModal = ({ isVisible, onClose }: NBackModalProps) => {
    const updateHighScore = useUserStore(state => state.updateHighScore);
    const bestScore = useUserStore(state => state.highScores['nback'] || 0);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [gameState, setGameState] = useState<'intro' | 'showing_initial' | 'playing' | 'result'>('intro');
    const [sequence, setSequence] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [flashColor, setFlashColor] = useState<string | null>(null); // Pour l'effet visuel entre les lettres

    useEffect(() => {
        if (isVisible) setGameState('intro');
    }, [isVisible]);

    const startGame = () => {
        // 1. Générer une séquence de lettres
        const newSeq: string[] = [];
        for (let i = 0; i < TOTAL_ROUNDS; i++) {
            if (i < 2) {
                // Les deux premières lettres sont aléatoires
                newSeq.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
            } else {
                // 40% de chance d'avoir une correspondance (2-Back)
                if (Math.random() < 0.4) {
                    newSeq.push(newSeq[i - 2]);
                } else {
                    let nextLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
                    // S'assurer que ce n'est PAS une correspondance
                    while (nextLetter === newSeq[i - 2]) {
                        nextLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
                    }
                    newSeq.push(nextLetter);
                }
            }
        }

        setSequence(newSeq);
        setScore(0);
        setIsNewRecord(false);
        setCurrentIndex(0);
        setGameState('showing_initial');
    };

    // Gérer l'affichage automatique des 2 premières lettres (qui servent de base)
    useEffect(() => {
        if (gameState === 'showing_initial') {
            if (currentIndex < 2) {
                const timer = setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                }, 1200); // 1.2s par lettre initiale
                return () => clearTimeout(timer);
            } else {
                setGameState('playing');
            }
        }
    }, [gameState, currentIndex]);

    const handleAnswer = (userSaysMatch: boolean) => {
        if (gameState !== 'playing') return;

        const isActuallyMatch = sequence[currentIndex] === sequence[currentIndex - 2];

        if (userSaysMatch === isActuallyMatch) {
            setScore(prev => prev + 1);
            feedbackService.light();
            setFlashColor('rgba(76, 175, 80, 0.1)'); // Vert léger
        } else {
            feedbackService.error();
            setFlashColor('rgba(207, 102, 121, 0.1)'); // Rouge léger
        }

        setTimeout(() => setFlashColor(null), 200);

        if (currentIndex + 1 >= TOTAL_ROUNDS) {
            setGameState('result');
            trackToolUsage('nback');

            if (score > bestScore) {
                setIsNewRecord(true);
                grantXP(XP_REWARDS.GAME_NEW_RECORD);
                updateHighScore('nback', score + (userSaysMatch === isActuallyMatch ? 1 : 0));
            }
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal isVisible={isVisible} onClose={onClose} title="Surcharge N-Back">
            <View style={styles.container}>
                {/* --- INTRO --- */}
                {gameState === 'intro' && (
                    <View style={styles.centerContent}>
                        <View style={styles.readyIconWrapper}>
                            <Activity color="#2196F3" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Mémoire de Travail</Title>
                        <View style={styles.recordBadge}>
                            <Award color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                            <Text style={styles.recordText}>Record : {bestScore} pts</Text>
                        </View>
                        <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 10 }}>
                            Une série de lettres va défiler. {'\n\n'}
                            Pour chaque lettre, indique si c'est <Text style={{ fontFamily: 'PoppinsBold', color: Colors.text }}>la même qu'il y a 2 tours.</Text> C'est difficile, reste bien concentré !
                        </BodyText>
                        <LumosButton title="Démarrer" onPress={startGame} color="#2196F3" />
                    </View>
                )}

                {/* --- JEU --- */}
                {(gameState === 'showing_initial' || gameState === 'playing') && (
                    <View style={[styles.gameContent, flashColor ? { backgroundColor: flashColor } : null]}>
                        <View style={styles.statsRow}>
                            <View style={styles.glassBadge}>
                                <Text style={styles.progressText}>
                                    Tour {Math.min(currentIndex + 1, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}
                                </Text>
                            </View>
                            <View style={styles.glassBadge}>
                                <Text style={styles.progressText}>Score: {score}</Text>
                            </View>
                        </View>

                        <View style={styles.letterBox}>
                            <Text style={styles.instructionText}>
                                {gameState === 'showing_initial' ? "Mémorise les premières lettres..." : "Est-ce la même qu'il y a 2 tours ?"}
                            </Text>

                            <View style={styles.bigLetterContainer}>
                                <Text style={styles.bigLetterText}>
                                    {sequence[currentIndex]}
                                </Text>
                            </View>
                        </View>

                        {/* Boutons cachés pendant les 2 premières lettres */}
                        <View style={[styles.actionRow, gameState === 'showing_initial' && { opacity: 0 }]} pointerEvents={gameState === 'showing_initial' ? 'none' : 'auto'}>
                            <TouchableOpacity style={[styles.choiceBtn, styles.btnNo]} onPress={() => handleAnswer(false)} activeOpacity={0.7}>
                                <X color={Colors.text} size={24} style={{ marginBottom: 4 }} />
                                <Text style={styles.choiceBtnText}>DIFFÉRENT</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.choiceBtn, styles.btnYes]} onPress={() => handleAnswer(true)} activeOpacity={0.7}>
                                <Check color={Colors.text} size={24} style={{ marginBottom: 4 }} />
                                <Text style={styles.choiceBtnText}>PAREIL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* --- RÉSULTATS --- */}
                {gameState === 'result' && (
                    <View style={styles.centerContent}>
                        <View style={[styles.readyIconWrapper, { borderColor: '#2196F3' }]}>
                            <Activity color="#2196F3" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Terminé !</Title>
                        <Text style={[styles.scoreText, { color: '#2196F3' }]}>{score} / {TOTAL_ROUNDS - 2}</Text>

                        {isNewRecord ? (
                            <Text style={styles.newRecordTag}>NOUVEAU RECORD !</Text>
                        ) : (
                            <Text style={styles.subRecordText}>Record actuel : {bestScore} pts</Text>
                        )}
                        <LumosButton title="Rejouer" onPress={startGame} color="#2196F3" style={{ marginBottom: 12 }} />
                        <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={{ padding: 10 }}>
                            <Text style={styles.closeText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: { minHeight: 480, justifyContent: 'center' },
    centerContent: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingTop: 10 },
    readyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(33, 150, 243, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: 'rgba(33, 150, 243, 0.3)' },

    recordBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8, marginBottom: 20 },
    recordText: { color: Colors.primary, fontSize: 12, fontFamily: 'PoppinsBold' },

    gameContent: { flex: 1, paddingTop: 10, borderRadius: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    glassBadge: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
    progressText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 13 },

    letterBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    instructionText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 14, textAlign: 'center', marginBottom: 30 },
    bigLetterContainer: { width: 160, height: 160, backgroundColor: 'rgba(33, 150, 243, 0.05)', borderRadius: 40, borderWidth: 2, borderColor: 'rgba(33, 150, 243, 0.3)', justifyContent: 'center', alignItems: 'center' },
    bigLetterText: { fontSize: 80, fontFamily: 'PoppinsBold', color: Colors.text },

    actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 15, marginTop: 30, marginBottom: 10 },
    choiceBtn: { flex: 1, height: 80, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    btnNo: { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' },
    btnYes: { backgroundColor: 'rgba(33, 150, 243, 0.1)', borderColor: 'rgba(33, 150, 243, 0.3)' },
    choiceBtnText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 14, letterSpacing: 1 },

    scoreText: { fontSize: 72, fontFamily: 'PoppinsBold', marginVertical: 10 },
    newRecordTag: { color: '#2196F3', fontFamily: 'PoppinsBold', fontSize: 14, letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    subRecordText: { color: Colors.textMuted, fontFamily: 'PoppinsMedium', fontSize: 13, marginBottom: 15 },
    closeText: { color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline', fontFamily: 'PoppinsMedium' },
});