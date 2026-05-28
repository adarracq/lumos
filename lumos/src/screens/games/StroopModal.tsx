// src/components/organisms/StroopModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { XP_REWARDS } from '@/src/constants/Rewards';
import { feedbackService } from '@/src/services/feedbackService';
import { useUserStore } from '@/src/store/useUserStore';
import { grantXP } from '@/src/utils/rewardManager';
import { Award, Target, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface StroopModalProps {
    isVisible: boolean;
    onClose: () => void;
}

// Les 4 couleurs du jeu
const COLORS = [
    { name: 'ROUGE', hex: '#EF4444' },
    { name: 'BLEU', hex: '#3B82F6' },
    { name: 'VERT', hex: '#10B981' },
    { name: 'JAUNE', hex: '#F59E0B' },
];

export const StroopModal = ({ isVisible, onClose }: StroopModalProps) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [currentWord, setCurrentWord] = useState(COLORS[0]);
    const [currentColor, setCurrentColor] = useState(COLORS[1]);

    const updateHighScore = useUserStore(state => state.updateHighScore);
    const bestScore = useUserStore(state => state.highScores['stroop'] || 0);

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
            trackToolUsage('stroop');

            if (score > bestScore) {
                setIsNewRecord(true);
                grantXP(XP_REWARDS.GAME_NEW_RECORD);
                updateHighScore('stroop', score);
            }
        }
        return () => clearTimeout(timer);
    }, [timeLeft, gameState, bestScore]);

    const generateNewRound = () => {
        const randomWord = COLORS[Math.floor(Math.random() * COLORS.length)];
        let randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

        // 60% de chance que la couleur et le mot soient différents pour forcer le conflit cognitif
        if (Math.random() > 0.4) {
            while (randomColor.hex === randomWord.hex) {
                randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
        }

        setCurrentWord(randomWord);
        setCurrentColor(randomColor);
    };

    const startGame = () => {
        setScore(0);
        setIsNewRecord(false);
        setTimeLeft(30);
        setGameState('playing');
        generateNewRound();
    };

    const handleAnswer = (selectedHex: string) => {
        if (selectedHex === currentColor.hex) {
            setScore(score + 1);
            feedbackService.light(); // Bonne réponse
        } else {
            setScore(Math.max(0, score - 1));
            feedbackService.error(); // Mauvaise réponse
        }
        generateNewRound();
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Réflexe Stroop"
        >
            <View style={styles.container}>
                {/* --- ÉCRAN D'INTRODUCTION --- */}
                {gameState === 'intro' && (
                    <View style={styles.centerContent}>
                        <View style={styles.readyIconWrapper}>
                            <Zap color={Colors.error} size={48} />
                        </View>

                        <Title center style={{ marginTop: 16 }}>Inhibition Cognitive</Title>

                        <View style={styles.recordBadge}>
                            <Award color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                            <Text style={styles.recordText}>Record : {bestScore} pts</Text>
                        </View>

                        <BodyText center color={Colors.textMuted} style={{ marginTop: 8, marginBottom: 30, paddingHorizontal: 10 }}>
                            Ton cerveau lit les mots plus vite qu'il n'identifie les couleurs. {'\n\n'}
                            Le but : Appuie sur le bouton correspondant à la <Text style={{ color: Colors.text, fontFamily: 'PoppinsBold' }}>couleur de l'encre</Text>, et ignore le mot écrit !
                        </BodyText>

                        <LumosButton
                            title="Démarrer (30s)"
                            onPress={startGame}
                            style={{ width: '100%' }}
                        />
                    </View>
                )}

                {/* --- ÉCRAN DE JEU --- */}
                {gameState === 'playing' && (
                    <View style={styles.gameContent}>
                        {/* Header du jeu : Temps et Score (Style Glassmorphism) */}
                        <View style={styles.statsRow}>
                            <View style={styles.glassProgressBadge}>
                                <Target color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                                <Text style={styles.progressText}>Score: {score}</Text>
                            </View>
                            <View style={[styles.glassProgressBadge, timeLeft <= 5 && { borderColor: Colors.error, backgroundColor: 'rgba(207, 102, 121, 0.1)' }]}>
                                <Text style={[styles.progressText, timeLeft <= 5 && { color: Colors.error }]}>
                                    00:{timeLeft.toString().padStart(2, '0')}
                                </Text>
                            </View>
                        </View>

                        {/* Le Mot Piège */}
                        <View style={styles.wordContainer}>
                            <Text style={[styles.targetWord, { color: currentColor.hex }]}>
                                {currentWord.name}
                            </Text>
                        </View>

                        {/* Grille de réponses */}
                        <View style={styles.answersGrid}>
                            {COLORS.map((colorOption) => (
                                <TouchableOpacity
                                    key={colorOption.name}
                                    style={styles.glassAnswerBtn}
                                    activeOpacity={0.7}
                                    onPress={() => handleAnswer(colorOption.hex)}
                                >
                                    {/* Petit point de couleur pour aider visuellement si besoin, ou juste le texte */}
                                    <View style={[styles.colorDot, { backgroundColor: colorOption.hex }]} />
                                    <Text style={styles.answerBtnText}>{colorOption.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* --- ÉCRAN DE RÉSULTAT --- */}
                {gameState === 'result' && (
                    <View style={styles.centerContent}>
                        <View style={[styles.readyIconWrapper, { borderColor: Colors.primary }]}>
                            <Target color={Colors.primary} size={48} />
                        </View>
                        <Text style={styles.scoreText}>{score}</Text>

                        {isNewRecord ? (
                            <Text style={styles.newRecordTag}>NOUVEAU RECORD !</Text>
                        ) : (
                            <Text style={styles.subRecordText}>Record actuel : {bestScore} pts</Text>
                        )}

                        <LumosButton
                            title="Rejouer"
                            onPress={startGame}
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
        minHeight: 450, // Assure une bonne hauteur dans le BottomSheet
        justifyContent: 'center'
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 20
    },

    // Repris du BreathingModal pour la cohérence
    readyIconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'rgba(207, 102, 121, 0.3)' // Rouge pour Stroop (erreur/alerte)
    },

    // Badges en glassmorphism
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

    // Zone de jeu
    gameContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    wordContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 150
    },
    targetWord: {
        fontSize: 54,
        fontFamily: 'PoppinsBold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10
    },

    // Grille de boutons Glassmorphism
    answersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
        marginTop: 20
    },
    glassAnswerBtn: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 16,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8
    },
    answerBtnText: {
        color: Colors.text,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 14
    },

    // Résultat
    scoreText: {
        color: Colors.primary,
        fontSize: 72,
        fontFamily: 'PoppinsBold',
        marginVertical: 10
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
        color: '#FF5722',
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