// src/components/organisms/TargetTrackerModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { feedbackService } from '@/src/services/feedbackService';
import { grantXP } from '@/src/utils/rewardManager';
import { Crosshair, Heart, Trophy } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { XP_REWARDS } from '../../constants/Rewards';
import { useUserStore } from '../../store/useUserStore';

interface TargetTrackerModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const CONTAINER_SIZE = 300;
const DOT_SIZE = 44;
const MAX_POS = CONTAINER_SIZE - DOT_SIZE;
// Marge de sécurité augmentée pour éviter les frôlements
const SAFE_DISTANCE = DOT_SIZE + 15;

export const TargetTrackerModal = ({ isVisible, onClose }: TargetTrackerModalProps) => {
    const updateHighScore = useUserStore(state => state.updateHighScore);
    const bestScore = useUserStore(state => state.highScores['targetTracker'] || 0);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [gameState, setGameState] = useState<'intro' | 'memorizing' | 'tracking' | 'selecting' | 'result'>('intro');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isNewRecord, setIsNewRecord] = useState(false);

    const [dots, setDots] = useState<{ id: number; isTarget: boolean }[]>([]);
    const [selectedDots, setSelectedDots] = useState<number[]>([]);
    const [wrongDot, setWrongDot] = useState<number | null>(null);

    const animations = useRef<{ [key: number]: Animated.ValueXY }>({});
    const gameStateRef = useRef(gameState);

    // NOUVEAU : Mémoire des destinations pour éviter les collisions en vol
    const targetPositions = useRef<{ [key: number]: { x: number; y: number } }>({});
    const timeIsUp = useRef(false);
    const activeAnimationsCount = useRef(0);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        if (isVisible) {
            setGameState('intro');
            gameStateRef.current = 'intro';
        } else {
            stopAllAnimations();
        }
    }, [isVisible]);

    const stopAllAnimations = () => {
        Object.values(animations.current).forEach(anim => anim.stopAnimation());
    };

    // Fonction utilitaire pour éviter que les cercles se superposent au départ
    const generateNonOverlappingPositions = (count: number) => {
        const positions: { x: number; y: number }[] = [];
        let attempts = 0;

        while (positions.length < count && attempts < 1000) {
            const x = Math.random() * MAX_POS;
            const y = Math.random() * MAX_POS;
            let hasOverlap = false;

            for (const pos of positions) {
                const dx = pos.x - x;
                const dy = pos.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < SAFE_DISTANCE) {
                    hasOverlap = true;
                    break;
                }
            }

            if (!hasOverlap) {
                positions.push({ x, y });
            }
            attempts++;
        }
        return positions;
    };

    // NOUVEAU : Cherche une destination libre qui ne correspond à aucune destination actuelle des autres ronds
    const getValidTargetPosition = (dotId: number, currentTargets: { [key: number]: { x: number, y: number } }) => {
        let attempts = 0;
        while (attempts < 50) {
            const x = Math.random() * MAX_POS;
            const y = Math.random() * MAX_POS;
            let hasOverlap = false;

            for (const key in currentTargets) {
                if (Number(key) === dotId) continue; // On ne se compare pas à soi-même
                const pos = currentTargets[key];
                if (!pos) continue;

                const dx = pos.x - x;
                const dy = pos.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < SAFE_DISTANCE) {
                    hasOverlap = true;
                    break;
                }
            }

            if (!hasOverlap) return { x, y };
            attempts++;
        }
        return { x: Math.random() * MAX_POS, y: Math.random() * MAX_POS };
    };

    const moveDotRandomly = (id: number, currentLevel: number) => {
        if (gameStateRef.current !== 'tracking') return;

        // Si le temps est écoulé, le rond a atteint sa destination finale et s'arrête
        if (timeIsUp.current) {
            activeAnimationsCount.current -= 1;
            // Quand tout le monde est à l'arrêt, on passe à la sélection
            if (activeAnimationsCount.current <= 0 && gameStateRef.current === 'tracking') {
                setGameState('selecting');
                gameStateRef.current = 'selecting';
            }
            return;
        }

        const anim = animations.current[id];
        if (!anim) return;

        // On cherche une cible valide pour ne pas foncer sur la cible d'un autre
        const nextPos = getValidTargetPosition(id, targetPositions.current);
        targetPositions.current[id] = nextPos; // On réserve la place !

        const speedMultiplier = Math.max(0.4, 1 - (currentLevel * 0.05));
        const duration = (700 + Math.random() * 800) * speedMultiplier;

        Animated.timing(anim, {
            toValue: nextPos,
            duration: duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                moveDotRandomly(id, currentLevel); // Relance en boucle
            } else {
                activeAnimationsCount.current -= 1; // Si l'anim est coupée de force
            }
        });
    };

    const startNewRound = (currentLevel: number) => {
        setSelectedDots([]);
        setWrongDot(null);
        timeIsUp.current = false;
        targetPositions.current = {}; // Reset de la mémoire des places

        setGameState('memorizing');
        gameStateRef.current = 'memorizing';

        stopAllAnimations();

        const numTargets = 2 + Math.floor(currentLevel / 2);
        const totalDots = 4 + currentLevel;

        const newDots = Array.from({ length: totalDots }).map((_, i) => ({
            id: i,
            isTarget: i < numTargets
        }));

        setDots(newDots);

        // 1. Placement initial sans chevauchement
        const initialPositions = generateNonOverlappingPositions(totalDots);

        animations.current = {};
        newDots.forEach((dot, i) => {
            const pos = initialPositions[i] || { x: Math.random() * MAX_POS, y: Math.random() * MAX_POS };
            animations.current[dot.id] = new Animated.ValueXY(pos);
            targetPositions.current[dot.id] = pos; // On enregistre leur point de départ
        });

        activeAnimationsCount.current = totalDots;

        // 2. Lancement
        setTimeout(() => {
            if (gameStateRef.current === 'intro' || !isVisible) return;

            setGameState('tracking');
            gameStateRef.current = 'tracking';

            newDots.forEach(dot => moveDotRandomly(dot.id, currentLevel));

            // Au bout de 4.5 secondes, on donne le signal de fin. 
            // Ils vont finir leur dernier trajet (environ 1s) et s'arrêter sans se toucher !
            setTimeout(() => {
                if (gameStateRef.current === 'tracking') {
                    timeIsUp.current = true;
                }
            }, 4500);

        }, 2000);
    };

    const startGame = () => {
        setLevel(1);
        setScore(0);
        setLives(3);
        setIsNewRecord(false);
        startNewRound(1);
    };

    const endGame = (finalScore: number) => {
        setGameState('result');
        gameStateRef.current = 'result';
        stopAllAnimations();
        trackToolUsage('targetTracker');

        if (finalScore > bestScore) {
            setIsNewRecord(true);
            updateHighScore('targetTracker', finalScore);
            grantXP(XP_REWARDS.GAME_NEW_RECORD);
        }
    };

    const handleDotPress = (dot: { id: number, isTarget: boolean }) => {
        if (gameState !== 'selecting' || selectedDots.includes(dot.id) || wrongDot !== null) return;

        if (dot.isTarget) {
            feedbackService.light();
            const newSelected = [...selectedDots, dot.id];
            setSelectedDots(newSelected);

            const totalTargets = dots.filter(d => d.isTarget).length;

            if (newSelected.length === totalTargets) {
                const newScore = score + totalTargets;
                setScore(newScore);
                feedbackService.heavy();

                setTimeout(() => {
                    setLevel(level + 1);
                    startNewRound(level + 1);
                }, 800);
            }
        } else {
            feedbackService.error();
            setWrongDot(dot.id);
            const nextLives = lives - 1;
            setLives(nextLives);

            setTimeout(() => {
                if (nextLives <= 0) {
                    endGame(score);
                } else {
                    startNewRound(level);
                }
            }, 1500);
        }
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal isVisible={isVisible} onClose={onClose} title="Traque Cible">
            <View style={styles.container}>
                {/* --- INTRO --- */}
                {gameState === 'intro' && (
                    <View style={styles.centerContent}>
                        <View style={styles.readyIconWrapper}>
                            <Crosshair color="#673AB7" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Attention Partagée</Title>

                        <View style={styles.recordBadge}>
                            <Trophy color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                            <Text style={styles.recordText}>Record : {bestScore} pts</Text>
                        </View>

                        <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 10 }}>
                            Mémorise les cibles dorées. Elles vont ensuite se fondre parmi les autres et bouger dans tous les sens. {'\n\n'}
                            Ne les perds pas des yeux et retrouve-les quand elles s'arrêtent ! Tu as 3 vies.
                        </BodyText>

                        <LumosButton title="Démarrer" onPress={startGame} color="#673AB7" style={{ width: '100%' }} />
                    </View>
                )}

                {/* --- JEU --- */}
                {(gameState === 'memorizing' || gameState === 'tracking' || gameState === 'selecting') && (
                    <View style={styles.gameContent}>
                        <View style={styles.statsRow}>
                            <View style={styles.glassBadge}>
                                <Text style={styles.progressText}>Niveau {level}</Text>
                            </View>
                            <View style={styles.livesRow}>
                                {[1, 2, 3].map((heart) => (
                                    <Heart key={heart} size={18} color={heart <= lives ? Colors.error : 'rgba(255,255,255,0.1)'} fill={heart <= lives ? Colors.error : 'transparent'} style={{ marginLeft: 4 }} />
                                ))}
                            </View>
                        </View>

                        <Text style={styles.instructionText}>
                            {gameState === 'memorizing' ? 'MÉMORISE LES CIBLES...' :
                                gameState === 'tracking' ? 'SUIS-LES DES YEUX !' : 'TOUCHE LES CIBLES !'}
                        </Text>

                        {/* ARENE DE JEU */}
                        <View style={styles.arenaContainer}>
                            <View style={styles.arena}>
                                {dots.map(dot => {
                                    const anim = animations.current[dot.id];
                                    if (!anim) return null;

                                    const isSelected = selectedDots.includes(dot.id);
                                    const isWrong = wrongDot === dot.id;

                                    let dotColor = 'rgba(255,255,255,0.15)';
                                    let dotBorder = 'rgba(255,255,255,0.3)';

                                    if (gameState === 'memorizing' && dot.isTarget) {
                                        dotColor = Colors.primary;
                                        dotBorder = Colors.primary;
                                    } else if (gameState === 'selecting') {
                                        if (isSelected) {
                                            dotColor = '#4CAF50';
                                            dotBorder = '#4CAF50';
                                        } else if (isWrong) {
                                            dotColor = Colors.error;
                                            dotBorder = Colors.error;
                                        } else if (wrongDot !== null && dot.isTarget) {
                                            dotColor = 'rgba(212, 175, 55, 0.4)';
                                            dotBorder = Colors.primary;
                                        }
                                    }

                                    return (
                                        <Animated.View
                                            key={dot.id}
                                            style={[
                                                styles.dot,
                                                {
                                                    backgroundColor: dotColor,
                                                    borderColor: dotBorder,
                                                    transform: [
                                                        { translateX: anim.x },
                                                        { translateY: anim.y }
                                                    ]
                                                }
                                            ]}
                                        >
                                            <TouchableOpacity
                                                style={StyleSheet.absoluteFill}
                                                activeOpacity={0.8}
                                                onPress={() => handleDotPress(dot)}
                                                disabled={gameState !== 'selecting'}
                                            />
                                        </Animated.View>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                )}

                {/* --- RÉSULTATS --- */}
                {gameState === 'result' && (
                    <View style={styles.centerContent}>
                        <View style={[styles.readyIconWrapper, { borderColor: '#673AB7' }]}>
                            <Crosshair color="#673AB7" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Fin de la partie</Title>
                        <Text style={[styles.scoreText, { color: '#673AB7' }]}>{score}</Text>

                        {isNewRecord ? (
                            <Text style={styles.newRecordTag}>NOUVEAU RECORD !</Text>
                        ) : (
                            <Text style={styles.subRecordText}>Record actuel : {bestScore} pts</Text>
                        )}

                        <LumosButton title="Rejouer" onPress={startGame} color="#673AB7" style={{ width: '100%', marginBottom: 12 }} />
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

    readyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(103, 58, 183, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: 'rgba(103, 58, 183, 0.3)' },
    recordBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8, marginBottom: 20 },
    recordText: { color: Colors.primary, fontSize: 12, fontFamily: 'PoppinsBold' },

    gameContent: { paddingTop: 10, paddingBottom: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    glassBadge: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
    progressText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 13 },
    livesRow: { flexDirection: 'row', alignItems: 'center' },
    instructionText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 12, letterSpacing: 1, textAlign: 'center', marginBottom: 20, textTransform: 'uppercase' },

    arenaContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    arena: {
        width: CONTAINER_SIZE,
        height: CONTAINER_SIZE,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        overflow: 'hidden',
    },
    dot: {
        position: 'absolute',
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },

    scoreText: { fontSize: 72, fontFamily: 'PoppinsBold', marginVertical: 10 },
    newRecordTag: { color: '#673AB7', fontFamily: 'PoppinsBold', fontSize: 14, letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    subRecordText: { color: Colors.textMuted, fontFamily: 'PoppinsMedium', fontSize: 13, marginBottom: 15 },
    closeText: { color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline', fontFamily: 'PoppinsMedium' },
});