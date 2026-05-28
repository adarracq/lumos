// src/components/organisms/LogicPathModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { XP_REWARDS } from '@/src/constants/Rewards';
import { feedbackService } from '@/src/services/feedbackService';
import { grantXP } from '@/src/utils/rewardManager';
import { Award, Puzzle, Target } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useUserStore } from '../../store/useUserStore';

interface LogicPathModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const LogicPathModal = ({ isVisible, onClose }: LogicPathModalProps) => {
    const updateHighScore = useUserStore(state => state.updateHighScore);
    const bestScore = useUserStore(state => state.highScores['logicPath'] || 0);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(45); // 45 secondes car ça demande de la réflexion

    const [sequence, setSequence] = useState<number[]>([]);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [options, setOptions] = useState<number[]>([]);

    useEffect(() => {
        if (isVisible) setGameState('intro');
    }, [isVisible]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('result');
            feedbackService.heavy();
            trackToolUsage('logicPath');

            if (score > bestScore) {
                setIsNewRecord(true);
                grantXP(XP_REWARDS.GAME_NEW_RECORD);
                updateHighScore('logicPath', score);
            }
        }
        return () => clearTimeout(timer);
    }, [timeLeft, gameState, score, bestScore]);

    const generateSequence = () => {
        const types = ['add', 'sub', 'mult', 'fibo', 'doubleAdd'];
        const type = types[Math.floor(Math.random() * types.length)];
        let seq: number[] = [];
        let ans = 0;

        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 2;

        if (type === 'add') {
            seq = [start, start + step, start + step * 2, start + step * 3];
            ans = start + step * 4;
        } else if (type === 'sub') {
            const highStart = start + 30;
            seq = [highStart, highStart - step, highStart - step * 2, highStart - step * 3];
            ans = highStart - step * 4;
        } else if (type === 'mult') {
            const mStep = Math.floor(Math.random() * 2) + 2;
            seq = [start, start * mStep, start * mStep ** 2, start * mStep ** 3];
            ans = start * mStep ** 4;
        } else if (type === 'fibo') {
            seq = [start, start + step, start * 2 + step, start * 3 + step * 2];
            ans = start * 5 + step * 3;
        } else if (type === 'doubleAdd') {
            seq = [start, start + 1, start + 3, start + 6];
            ans = start + 10;
        }

        setSequence(seq);
        setCorrectAnswer(ans);

        let fakeOptions = new Set<number>();
        while (fakeOptions.size < 3) {
            const offset = Math.floor(Math.random() * 10) - 5;
            const fakeAns = ans + (offset === 0 ? 2 : offset);
            if (fakeAns !== ans) fakeOptions.add(fakeAns);
        }

        const allOptions = [ans, ...Array.from(fakeOptions)].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
    };

    const startGame = () => {
        setScore(0);
        setIsNewRecord(false);
        setTimeLeft(45);
        setGameState('playing');
        generateSequence();
    };

    const handleAnswer = (selected: number) => {
        if (selected === correctAnswer) {
            setScore(score + 1);
            feedbackService.light();
        } else {
            setScore(Math.max(0, score - 1));
            feedbackService.error();
        }
        generateSequence();
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal isVisible={isVisible} onClose={onClose} title="Suite Logique">
            <View style={styles.container}>
                {/* --- INTRO --- */}
                {gameState === 'intro' && (
                    <View style={styles.centerContent}>
                        <View style={styles.readyIconWrapper}>
                            <Puzzle color="#4CAF50" size={48} />
                        </View>

                        <Title center style={{ marginTop: 16 }}>Raisonnement Analytique</Title>

                        <View style={styles.recordBadge}>
                            <Award color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                            <Text style={styles.recordText}>Record : {bestScore} pts</Text>
                        </View>

                        <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 10 }}>
                            Observe attentivement la suite de nombres et trouve la règle cachée pour déduire le dernier nombre manquant. {'\n\n'}
                            Tu as 45 secondes.
                        </BodyText>

                        <LumosButton title="Démarrer (45s)" onPress={startGame} color="#4CAF50" style={{ width: '100%' }} />
                    </View>
                )}

                {/* --- JEU --- */}
                {gameState === 'playing' && (
                    <View style={styles.gameContent}>
                        <View style={styles.statsRow}>
                            <View style={styles.glassBadge}>
                                <Target color="#4CAF50" size={14} style={{ marginRight: 6 }} />
                                <Text style={styles.progressText}>SCORE: {score}</Text>
                            </View>
                            <View style={[styles.glassBadge, timeLeft <= 10 && { borderColor: Colors.error, backgroundColor: 'rgba(207, 102, 121, 0.1)' }]}>
                                <Text style={[styles.progressText, timeLeft <= 10 && { color: Colors.error }]}>
                                    00:{timeLeft.toString().padStart(2, '0')}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.sequenceContainer}>
                            <View style={styles.sequenceRow}>
                                {sequence.map((num, idx) => (
                                    <View key={idx} style={styles.sequenceNumberBox}>
                                        <Text style={styles.sequenceNumber}>{num}</Text>
                                    </View>
                                ))}
                                <View style={[styles.sequenceNumberBox, styles.targetBox]}>
                                    <Text style={[styles.sequenceNumber, { color: '#4CAF50' }]}>?</Text>
                                </View>
                            </View>
                        </View>

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

                {/* --- RÉSULTATS --- */}
                {gameState === 'result' && (
                    <View style={styles.centerContent}>
                        <View style={[styles.readyIconWrapper, { borderColor: '#4CAF50' }]}>
                            <Puzzle color="#4CAF50" size={48} />
                        </View>

                        <Title center style={{ marginTop: 16 }}>Temps écoulé !</Title>

                        <Text style={[styles.scoreText, { color: '#4CAF50' }]}>{score}</Text>

                        {isNewRecord ? (
                            <Text style={styles.newRecordTag}>NOUVEAU RECORD !</Text>
                        ) : (
                            <Text style={styles.subRecordText}>Record actuel : {bestScore} pts</Text>
                        )}

                        <LumosButton title="Rejouer" onPress={startGame} color="#4CAF50" style={{ width: '100%', marginBottom: 12 }} />
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

    readyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(76, 175, 80, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: 'rgba(76, 175, 80, 0.3)' },

    recordBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8, marginBottom: 20 },
    recordText: { color: Colors.primary, fontSize: 12, fontFamily: 'PoppinsBold' },

    // Correction de mise en page (retrait des flex: 1 qui écrasaient ou masquaient la zone)
    gameContent: { paddingTop: 10, paddingBottom: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    glassBadge: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
    // Retrait du textTransform: 'uppercase' pour éviter les bugs d'affichage de nombres sur React Native
    progressText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 13 },

    sequenceContainer: { marginVertical: 20, justifyContent: 'center', alignItems: 'center', minHeight: 100 },
    sequenceRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
    sequenceNumberBox: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, width: 56, height: 56, justifyContent: 'center', alignItems: 'center' },
    targetBox: { backgroundColor: 'rgba(76, 175, 80, 0.05)', borderColor: 'rgba(76, 175, 80, 0.3)' },
    sequenceNumber: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 20 },

    answersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginTop: 20 },
    glassAnswerBtn: { width: '48%', backgroundColor: 'rgba(76, 175, 80, 0.05)', borderWidth: 1, borderColor: 'rgba(76, 175, 80, 0.2)', borderRadius: 16, paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
    answerBtnText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 20 },

    scoreText: { fontSize: 72, fontFamily: 'PoppinsBold', marginVertical: 10 },
    newRecordTag: { color: '#4CAF50', fontFamily: 'PoppinsBold', fontSize: 14, letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    subRecordText: { color: Colors.textMuted, fontFamily: 'PoppinsMedium', fontSize: 13, marginBottom: 15 },
    closeText: { color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline', fontFamily: 'PoppinsMedium' },
});