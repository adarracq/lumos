// src/components/organisms/SchulteTableModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { feedbackService } from '@/src/services/feedbackService';
import { grantXP } from '@/src/utils/rewardManager';
import { Eye, Target, Trophy } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { XP_REWARDS } from '../../constants/Rewards';
import { useUserStore } from '../../store/useUserStore';

interface SchulteTableModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const SchulteTableModal = ({ isVisible, onClose }: SchulteTableModalProps) => {
    const updateHighScore = useUserStore(state => state.updateHighScore);
    const bestScore = useUserStore(state => state.highScores['schulte'] || 0);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
    const [grid, setGrid] = useState<number[]>([]);
    const [currentExpected, setCurrentExpected] = useState(1);
    const [timeLeft, setTimeLeft] = useState(30); // 30 secondes max
    const [score, setScore] = useState(0);
    const [isNewRecord, setIsNewRecord] = useState(false);

    useEffect(() => {
        if (isVisible) setGameState('intro');
    }, [isVisible]);

    // Chronomètre du jeu
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            endGame(false);
        }
        return () => clearTimeout(timer);
    }, [timeLeft, gameState]);

    const generateGrid = () => {
        // Crée un tableau de 1 à 25 et le mélange
        const newGrid = Array.from({ length: 25 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
        setGrid(newGrid);
    };

    const startGame = () => {
        setCurrentExpected(1);
        setScore(0);
        setTimeLeft(30);
        setIsNewRecord(false);
        generateGrid();
        setGameState('playing');
    };

    const endGame = (finished: boolean) => {
        setGameState('result');
        feedbackService.heavy();

        // Calcul du score final : 100 pts par case + 10 pts par seconde sauvée si terminé
        const finalScore = ((currentExpected - 1) * 2) + (finished ? timeLeft * 1 : 0);
        setScore(finalScore);
        trackToolUsage('schulte');

        if (finalScore > bestScore) {
            setIsNewRecord(true);
            updateHighScore('schulte', finalScore);
            grantXP(XP_REWARDS.GAME_NEW_RECORD);
        }
    };

    const handleTilePress = (num: number) => {
        if (gameState !== 'playing') return;

        if (num === currentExpected) {
            // Bonne case touchée
            feedbackService.light();

            if (num === 25) {
                // Grille terminée !
                setCurrentExpected(26); // Pour tout afficher en "validé"
                endGame(true);
            } else {
                setCurrentExpected(prev => prev + 1);
            }
        } else if (num > currentExpected) {
            // Mauvaise case (déjà cliquée on ignore, mais si > on signale l'erreur)
            feedbackService.error();
        }
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal isVisible={isVisible} onClose={onClose} title="Table de Schulte">
            <View style={styles.container}>
                {/* --- INTRO --- */}
                {gameState === 'intro' && (
                    <View style={styles.centerContent}>
                        <View style={styles.readyIconWrapper}>
                            <Eye color="#2196F3" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Vision Périphérique</Title>

                        <View style={styles.recordBadge}>
                            <Trophy color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                            <Text style={styles.recordText}>Record : {bestScore} pts</Text>
                        </View>

                        <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 10 }}>
                            Garde les yeux fixés au centre de la grille et retrouve les nombres de 1 à 25 dans l'ordre croissant, le plus vite possible. {'\n\n'}
                            Tu as 30 secondes. Bonus de score si tu finis avant la fin du temps !
                        </BodyText>

                        <LumosButton title="Démarrer (30s)" onPress={startGame} color="#2196F3" style={{ width: '100%' }} />
                    </View>
                )}

                {/* --- JEU --- */}
                {gameState === 'playing' && (
                    <View style={styles.gameContent}>
                        <View style={styles.statsRow}>
                            <View style={styles.glassBadge}>
                                <Target color="#2196F3" size={14} style={{ marginRight: 6 }} />
                                <Text style={styles.progressText}>CIBLE : {currentExpected <= 25 ? currentExpected : '-'}</Text>
                            </View>
                            <View style={[styles.glassBadge, timeLeft <= 10 && { borderColor: Colors.error, backgroundColor: 'rgba(207, 102, 121, 0.1)' }]}>
                                <Text style={[styles.progressText, timeLeft <= 10 && { color: Colors.error }]}>
                                    00:{timeLeft.toString().padStart(2, '0')}
                                </Text>
                            </View>
                        </View>

                        {/* GRILLE 5x5 */}
                        <View style={styles.gridContainer}>
                            {grid.map((num, index) => {
                                const isDone = num < currentExpected;

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.tileBase, isDone && styles.tileDone]}
                                        activeOpacity={0.6}
                                        onPress={() => handleTilePress(num)}
                                    >
                                        <Text style={[styles.tileText, isDone && styles.tileTextDone]}>
                                            {num}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* --- RÉSULTATS --- */}
                {gameState === 'result' && (
                    <View style={styles.centerContent}>
                        <View style={[styles.readyIconWrapper, { borderColor: '#2196F3' }]}>
                            <Eye color="#2196F3" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Terminé !</Title>
                        <Text style={[styles.scoreText, { color: '#2196F3' }]}>{score}</Text>

                        {isNewRecord ? (
                            <Text style={styles.newRecordTag}>NOUVEAU RECORD !</Text>
                        ) : (
                            <Text style={styles.subRecordText}>Record actuel : {bestScore} pts</Text>
                        )}

                        <LumosButton title="Rejouer" onPress={startGame} color="#2196F3" style={{ width: '100%', marginBottom: 12 }} />
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

    gameContent: { paddingTop: 10, paddingBottom: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    glassBadge: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
    progressText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 13 },

    // Grille 5x5
    gridContainer: {
        width: '100%',
        aspectRatio: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignContent: 'space-between',
        marginBottom: 20
    },
    tileBase: {
        width: '18%', // 5 cases par ligne avec de l'espace
        height: '18%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tileDone: {
        backgroundColor: 'rgba(33, 150, 243, 0.15)',
        borderColor: 'rgba(33, 150, 243, 0.3)',
        opacity: 0.6
    },
    tileText: {
        fontSize: 22,
        fontFamily: 'PoppinsBold',
        color: Colors.text
    },
    tileTextDone: {
        color: '#2196F3'
    },

    scoreText: { fontSize: 72, fontFamily: 'PoppinsBold', marginVertical: 10 },
    newRecordTag: { color: '#2196F3', fontFamily: 'PoppinsBold', fontSize: 14, letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    subRecordText: { color: Colors.textMuted, fontFamily: 'PoppinsMedium', fontSize: 13, marginBottom: 15 },
    closeText: { color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline', fontFamily: 'PoppinsMedium' },
});