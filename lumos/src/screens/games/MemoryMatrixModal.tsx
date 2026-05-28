// src/components/organisms/MemoryMatrixModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { XP_REWARDS } from '@/src/constants/Rewards';
import { feedbackService } from '@/src/services/feedbackService';
import { grantXP } from '@/src/utils/rewardManager';
import { Award, Grid, Heart } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useUserStore } from '../../store/useUserStore';

interface MemoryMatrixModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const MemoryMatrixModal = ({ isVisible, onClose }: MemoryMatrixModalProps) => {
    const updateHighScore = useUserStore(state => state.updateHighScore);
    const bestScore = useUserStore(state => state.highScores['memoryMatrix'] || 0);
    const [isNewRecord, setIsNewRecord] = useState(false);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [gameState, setGameState] = useState<'intro' | 'memorizing' | 'playing' | 'result'>('intro');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);

    const [targetTiles, setTargetTiles] = useState<number[]>([]);
    const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
    const [wrongTile, setWrongTile] = useState<number | null>(null);

    useEffect(() => {
        if (isVisible) {
            setGameState('intro');
        }
    }, [isVisible]);

    const startNewRound = (currentLevel: number) => {
        setSelectedTiles([]);
        setWrongTile(null);
        setGameState('memorizing');

        // Évolution de la taille de la grille (3x3 -> 4x4 -> 5x5 -> 6x6 max)
        // Niveau 1-2 : 3x3 | Niveau 3-4 : 4x4 | Niveau 5-6 : 5x5 | Niveau 7+ : 6x6
        const currentGridSize = Math.min(3 + Math.floor((currentLevel - 1) / 2), 6);
        const totalTiles = currentGridSize * currentGridSize;

        // Calculer le nombre de cases à retenir
        const tilesToCount = 2 + currentLevel;

        // Générer des indices aléatoires uniques
        const indices = new Set<number>();
        // On s'assure de ne jamais demander plus de cases qu'il n'y en a dans la grille
        const maxTilesForThisRound = Math.min(tilesToCount, totalTiles - 2);

        while (indices.size < maxTilesForThisRound) {
            indices.add(Math.floor(Math.random() * totalTiles));
        }

        const pattern = Array.from(indices);
        setTargetTiles(pattern);

        // Laisser les cases allumées pendant 1.5 seconde avant de lancer la phase de jeu
        setTimeout(() => {
            setGameState('playing');
        }, 1600);
    };

    const startGame = () => {
        setLevel(1);
        setScore(0);
        setIsNewRecord(false);
        setLives(3);
        startNewRound(1);
    };

    const handleTilePress = (index: number) => {
        if (gameState !== 'playing' || selectedTiles.includes(index) || wrongTile !== null) return;

        if (targetTiles.includes(index)) {
            // Bonne case
            const newSelected = [...selectedTiles, index];
            setSelectedTiles(newSelected);
            feedbackService.light();

            // Vérifier si la matrice entière est complétée
            if (newSelected.length === targetTiles.length) {
                // 👇 On augmente juste le score tout de suite
                setScore(score + 1);
                feedbackService.heavy(); // Vibration de succès

                // 👇 On retarde l'augmentation du niveau à la fin du timer !
                setTimeout(() => {
                    setLevel(level + 1);
                    startNewRound(level + 1);
                }, 600);
            }
        } else {
            // Mauvaise case
            setWrongTile(index);
            feedbackService.error();
            const nextLives = lives - 1;
            setLives(nextLives);

            // Attendre un peu en montrant l'erreur, puis relancer ou finir
            setTimeout(() => {
                if (nextLives <= 0) {
                    setGameState('result');
                    trackToolUsage('memoryMatrix');

                    if (score > bestScore) {
                        setIsNewRecord(true);
                        grantXP(XP_REWARDS.GAME_NEW_RECORD);
                        updateHighScore('memoryMatrix', score);
                    }
                } else {
                    // Recommence le même niveau
                    startNewRound(level);
                }
            }, 1200);
        }
    };

    if (!isVisible) return null;

    // Calculs dynamiques pour le rendu de la grille actuelle
    const currentGridSize = Math.min(3 + Math.floor((level - 1) / 2), 6);
    const totalTiles = currentGridSize * currentGridSize;
    // On calcule la largeur/hauteur en % pour qu'elles rentrent parfaitement selon la taille de la grille (en laissant environ 2% d'espacement)
    const dynamicTileSize = `${(100 / currentGridSize) - 2}%`;

    return (
        <BaseBottomSheetModal isVisible={isVisible} onClose={onClose} title="Matrice Mémorielle">
            <View style={styles.container}>
                {/* --- INTRO --- */}
                {gameState === 'intro' && (
                    <View style={styles.centerContent}>
                        <View style={styles.readyIconWrapper}>
                            <Grid color="#9C27B0" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Mémoire Spatiale</Title>
                        <View style={styles.recordBadge}>
                            <Award color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                            <Text style={styles.recordText}>Record : {bestScore} matrices</Text>
                        </View>
                        <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 10 }}>
                            Mémorise l'emplacement des cases dorées qui s'allument. {'\n\n'}
                            La grille s'agrandira au fil des niveaux. Retrouve-les toutes sans faire d'erreur. Tu as 3 vies !
                        </BodyText>
                        <LumosButton title="Démarrer" onPress={startGame} color="#9C27B0" />
                    </View>
                )}

                {/* --- JEU (Mémorisation & Action) --- */}
                {(gameState === 'memorizing' || gameState === 'playing') && (
                    <View style={styles.gameContent}>
                        {/* Barre d'état du haut */}
                        <View style={styles.statsRow}>
                            <View style={styles.glassBadge}>
                                <Text style={styles.progressText}>Niveau {level}</Text>
                            </View>
                            <View style={styles.livesRow}>
                                {[1, 2, 3].map((heart) => (
                                    <Heart
                                        key={heart}
                                        size={18}
                                        color={heart <= lives ? Colors.error : 'rgba(255,255,255,0.1)'}
                                        fill={heart <= lives ? Colors.error : 'transparent'}
                                        style={{ marginLeft: 4 }}
                                    />
                                ))}
                            </View>
                        </View>

                        <Text style={styles.instructionText}>
                            {gameState === 'memorizing' ? 'MÉMORISE LA MATRICE...' : 'À TOI : RETROUVE LES CASES !'}
                        </Text>

                        {/* Grille dynamique */}
                        <View style={styles.gridContainer}>
                            {Array.from({ length: totalTiles }).map((_, index) => {
                                const isTarget = targetTiles.includes(index);
                                const isSelected = selectedTiles.includes(index);
                                const isWrong = wrongTile === index;

                                // On applique la taille dynamique et la couleur d'état
                                let tileStyle: any[] = [
                                    styles.tileBase,
                                    { width: dynamicTileSize, height: dynamicTileSize }
                                ];

                                if (gameState === 'memorizing' && isTarget) {
                                    tileStyle.push(styles.tileTarget);
                                } else if (gameState === 'playing') {
                                    if (isSelected) tileStyle.push(styles.tileCorrect);
                                    if (isWrong) tileStyle.push(styles.tileWrong);
                                    // Révéler le pattern manquant si le joueur fait une erreur
                                    if (wrongTile !== null && isTarget && !isSelected) tileStyle.push(styles.tileReveal);
                                }

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={tileStyle}
                                        activeOpacity={0.8}
                                        onPress={() => handleTilePress(index)}
                                    />
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* --- RÉSULTATS --- */}
                {gameState === 'result' && (
                    <View style={styles.centerContent}>
                        <View style={[styles.readyIconWrapper, { borderColor: '#9C27B0' }]}>
                            <Grid color="#9C27B0" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Fin de la partie</Title>
                        <Text style={[styles.scoreText, { color: '#9C27B0' }]}>{score}</Text>

                        {isNewRecord ? (
                            <Text style={styles.newRecordTag}>NOUVEAU RECORD !</Text>
                        ) : (
                            <Text style={styles.subRecordText}>Record actuel : {bestScore} matrices</Text>
                        )}

                        <LumosButton title="Rejouer" onPress={startGame} color="#9C27B0" style={{ marginBottom: 12 }} />
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
    readyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(156, 39, 176, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: 'rgba(156, 39, 176, 0.3)' },

    recordBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8, marginBottom: 20 },
    recordText: { color: Colors.primary, fontSize: 12, fontFamily: 'PoppinsBold' },

    // Jeu
    gameContent: { flex: 1, paddingTop: 10 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    glassBadge: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
    progressText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 13 },
    livesRow: { flexDirection: 'row', alignItems: 'center' },
    instructionText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 12, letterSpacing: 1, textAlign: 'center', marginBottom: 20, textTransform: 'uppercase' },

    // Grille sacrée
    gridContainer: {
        width: '100%',
        aspectRatio: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Gère l'espace horizontal
        alignContent: 'space-between',   // Gère l'espace vertical
        paddingHorizontal: 10,
        marginBottom: 20
    },
    tileBase: {
        // Largeur et hauteur retirées d'ici, calculées dynamiquement dans le composant
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 8, // Réduit un peu le radius pour que ça rende bien même quand les cases sont petites (6x6)
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)'
    },
    tileTarget: { backgroundColor: Colors.primary, borderColor: Colors.primary, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
    tileCorrect: { backgroundColor: 'rgba(212,175,55,0.3)', borderColor: Colors.primary },
    tileWrong: { backgroundColor: 'rgba(207, 102, 121, 0.4)', borderColor: Colors.error },
    tileReveal: { backgroundColor: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.4)', borderWidth: 1.5 },

    // Fin
    scoreText: { fontSize: 72, fontFamily: 'PoppinsBold', marginVertical: 10 },
    newRecordTag: { color: '#9C27B0', fontFamily: 'PoppinsBold', fontSize: 14, letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    subRecordText: { color: Colors.textMuted, fontFamily: 'PoppinsMedium', fontSize: 13, marginBottom: 15 },
    closeText: { color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline', fontFamily: 'PoppinsMedium' },
});