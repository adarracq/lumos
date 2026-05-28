// src/components/organisms/MathRushModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { XP_REWARDS } from '@/src/constants/Rewards';
import { feedbackService } from '@/src/services/feedbackService';
import { useUserStore } from '@/src/store/useUserStore';
import { grantXP } from '@/src/utils/rewardManager';
import { Award, Brain, Target } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface MathRushModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const MathRushModal = ({ isVisible, onClose }: MathRushModalProps) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [equation, setEquation] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [options, setOptions] = useState<number[]>([]);

    const updateHighScore = useUserStore(state => state.updateHighScore);
    const bestScore = useUserStore(state => state.highScores['mathRush'] || 0);

    // Réinitialiser l'état quand la modale s'ouvre/ferme
    useEffect(() => {
        if (isVisible) {
            setGameState('intro');
        }
    }, [isVisible]);

    // Chronomètre du jeu
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('result');
            feedbackService.heavy();
            trackToolUsage('mathRush');

            if (score > bestScore) {
                setIsNewRecord(true);
                grantXP(XP_REWARDS.GAME_NEW_RECORD);
                updateHighScore('mathRush', score);
            }
        }
        return () => clearTimeout(timer);
    }, [timeLeft, gameState, bestScore]);

    // Générateur d'équations
    const generateEquation = () => {
        const operations = ['+', '-', '*'];
        // On augmente un peu la difficulté si le score est élevé
        const difficultyMultiplier = score > 10 ? 2 : 1;

        const op = operations[Math.floor(Math.random() * operations.length)];
        let num1 = 0, num2 = 0, ans = 0;

        if (op === '+') {
            num1 = Math.floor(Math.random() * (20 * difficultyMultiplier)) + 5;
            num2 = Math.floor(Math.random() * (20 * difficultyMultiplier)) + 5;
            ans = num1 + num2;
        } else if (op === '-') {
            num1 = Math.floor(Math.random() * (30 * difficultyMultiplier)) + 10;
            num2 = Math.floor(Math.random() * num1); // Pour éviter les résultats négatifs
            ans = num1 - num2;
        } else if (op === '*') {
            num1 = Math.floor(Math.random() * (8 * difficultyMultiplier)) + 2;
            num2 = Math.floor(Math.random() * 9) + 2;
            ans = num1 * num2;
        }

        setEquation(`${num1} ${op} ${num2}`);
        setCorrectAnswer(ans);

        // Générer 3 mauvaises réponses proches
        let fakeOptions = new Set<number>();
        while (fakeOptions.size < 3) {
            const offset = Math.floor(Math.random() * 10) - 5; // Erreur de -5 à +5
            const fakeAns = ans + (offset === 0 ? 1 : offset);
            if (fakeAns >= 0 && fakeAns !== ans) {
                fakeOptions.add(fakeAns);
            }
        }

        // Mélanger les options
        const allOptions = [ans, ...Array.from(fakeOptions)].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
    };

    const startGame = () => {
        setScore(0);
        setIsNewRecord(false);
        setTimeLeft(30);
        setGameState('playing');
        generateEquation();
    };

    const handleAnswer = (selectedAnswer: number) => {
        if (selectedAnswer === correctAnswer) {
            setScore(score + 1);
            feedbackService.light(); // Bonne réponse
        } else {
            setScore(Math.max(0, score - 1));
            feedbackService.error(); // Mauvaise réponse
        }
        generateEquation();
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Calcul Éclair"
        >
            <View style={styles.container}>
                {/* --- ÉCRAN D'INTRODUCTION --- */}
                {gameState === 'intro' && (
                    <View style={styles.centerContent}>
                        <View style={styles.readyIconWrapper}>
                            <Brain color="#FF9800" size={48} />
                        </View>

                        <Title center style={{ marginTop: 16 }}>Vitesse de traitement</Title>

                        <View style={styles.recordBadge}>
                            <Award color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                            <Text style={styles.recordText}>Record : {bestScore} pts</Text>
                        </View>

                        <BodyText center color={Colors.textMuted} style={{ marginTop: 8, marginBottom: 30, paddingHorizontal: 10 }}>
                            30 secondes pour résoudre un maximum de calculs mentaux. {'\n\n'}
                            Attention, les mauvaises réponses font perdre des points ! Prêt à faire chauffer tes neurones ?
                        </BodyText>

                        <LumosButton
                            title="Démarrer (30s)"
                            onPress={startGame}
                            color="#FF9800"
                            style={{ width: '100%' }}
                        />
                    </View>
                )}

                {/* --- ÉCRAN DE JEU --- */}
                {gameState === 'playing' && (
                    <View style={styles.gameContent}>
                        <View style={styles.statsRow}>
                            <View style={styles.glassProgressBadge}>
                                <Target color="#FF9800" size={14} style={{ marginRight: 6 }} />
                                <Text style={styles.progressText}>Score: {score}</Text>
                            </View>
                            <View style={[styles.glassProgressBadge, timeLeft <= 5 && { borderColor: Colors.error, backgroundColor: 'rgba(207, 102, 121, 0.1)' }]}>
                                <Text style={[styles.progressText, timeLeft <= 5 && { color: Colors.error }]}>
                                    00:{timeLeft.toString().padStart(2, '0')}
                                </Text>
                            </View>
                        </View>

                        {/* L'Équation */}
                        <View style={styles.equationContainer}>
                            <Text style={styles.targetEquation}>
                                {equation} = ?
                            </Text>
                        </View>

                        {/* Grille de réponses */}
                        <View style={styles.answersGrid}>
                            {options.map((opt, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.glassAnswerBtn}
                                    activeOpacity={0.7}
                                    onPress={() => handleAnswer(opt)}
                                >
                                    <Text style={styles.answerBtnText}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* --- ÉCRAN DE RÉSULTAT --- */}
                {gameState === 'result' && (
                    <View style={styles.centerContent}>
                        <View style={[styles.readyIconWrapper, { borderColor: '#FF9800' }]}>
                            <Brain color="#FF9800" size={48} />
                        </View>

                        <Title center style={{ marginTop: 16 }}>Temps écoulé !</Title>

                        <Text style={[styles.scoreText, { color: '#FF9800' }]}>{score}</Text>

                        {isNewRecord ? (
                            <Text style={styles.newRecordTag}>NOUVEAU RECORD !</Text>
                        ) : (
                            <Text style={styles.subRecordText}>Record actuel : {bestScore} pts</Text>
                        )}

                        <LumosButton
                            title="Rejouer"
                            onPress={startGame}
                            color="#FF9800"
                            style={{ width: '100%', marginBottom: 12 }}
                        />
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
    container: {
        minHeight: 450,
        justifyContent: 'center'
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 20
    },

    // Thème Orange (#FF9800) pour cette modale (différent du rouge de Stroop)
    readyIconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 152, 0, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 152, 0, 0.3)'
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        marginTop: 10
    },
    glassProgressBadge: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    progressText: {
        color: Colors.text,
        fontFamily: 'PoppinsBold',
        letterSpacing: 1,
        fontSize: 13,
        textTransform: 'uppercase'
    },

    gameContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    equationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 150
    },
    targetEquation: {
        fontSize: 54,
        fontFamily: 'PoppinsBold',
        letterSpacing: 2,
        color: Colors.text,
        textShadowColor: 'rgba(255, 152, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 15
    },

    answersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
        marginTop: 20
    },
    glassAnswerBtn: {
        width: '48%',
        backgroundColor: 'rgba(255, 152, 0, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 152, 0, 0.2)',
        borderRadius: 16,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    answerBtnText: {
        color: Colors.text,
        fontFamily: 'PoppinsBold',
        fontSize: 24
    },

    scoreText: {
        fontSize: 72,
        fontFamily: 'PoppinsBold',
        marginVertical: 10,
    },
    closeText: {
        color: Colors.textMuted,
        fontSize: 14,
        textDecorationLine: 'underline',
        fontFamily: 'PoppinsMedium'
    },
    recordBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
        marginBottom: 20
    },
    recordText: {
        color: Colors.primary,
        fontSize: 12,
        fontFamily: 'PoppinsBold'
    },
    newRecordTag: {
        color: '#FF9800',
        fontFamily: 'PoppinsBold',
        fontSize: 14,
        letterSpacing: 1,
        marginBottom: 15,
        textTransform: 'uppercase'
    },
    subRecordText: {
        color: Colors.textMuted,
        fontFamily: 'PoppinsMedium',
        fontSize: 13,
        marginBottom: 15
    },
});