// src/components/organisms/WordCascadeModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { feedbackService } from '@/src/services/feedbackService';
import { grantXP } from '@/src/utils/rewardManager';
import { Check, Delete, Target, Trophy, Type } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { XP_REWARDS } from '../../constants/Rewards';
import { useUserStore } from '../../store/useUserStore';

import FrenchWords from '../../constants/FrenchWords.json';

// 👇 2. CHARGEMENT EN MÉMOIRE (O(1) lookup). 
// Fait en dehors du composant pour des performances maximales !
const DICTIONARY = new Set(FrenchWords as string[]);

const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V'];

interface WordCascadeModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const WordCascadeModal = ({ isVisible, onClose }: WordCascadeModalProps) => {
    const updateHighScore = useUserStore(state => state.updateHighScore);
    const bestScore = useUserStore(state => state.highScores['wordCascade'] || 0);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [isNewRecord, setIsNewRecord] = useState(false);

    const [letters, setLetters] = useState<string[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);

    useEffect(() => {
        if (isVisible) setGameState('intro');
    }, [isVisible]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            endGame();
        }
        return () => clearTimeout(timer);
    }, [timeLeft, gameState]);

    const generateLetters = () => {
        // On force au moins 3 voyelles et 4 consonnes pour garantir des mots possibles
        const gameLetters = [];
        for (let i = 0; i < 3; i++) gameLetters.push(VOWELS[Math.floor(Math.random() * VOWELS.length)]);
        for (let i = 0; i < 4; i++) gameLetters.push(CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)]);

        // On mélange le tout
        setLetters(gameLetters.sort(() => Math.random() - 0.5));
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(60);
        setIsNewRecord(false);
        setFoundWords([]);
        setSelectedIndices([]);
        generateLetters();
        setGameState('playing');
    };

    const endGame = () => {
        setGameState('result');
        feedbackService.heavy();
        trackToolUsage('wordCascade');
        if (score > bestScore) {
            setIsNewRecord(true);
            updateHighScore('wordCascade', score);
            grantXP(XP_REWARDS.GAME_NEW_RECORD);
        }
    };

    const handleLetterPress = (index: number) => {
        if (selectedIndices.includes(index)) return; // Déjà sélectionnée
        feedbackService.light();
        setSelectedIndices([...selectedIndices, index]);
    };

    const handleBackspace = () => {
        if (selectedIndices.length === 0) return;
        feedbackService.light();
        setSelectedIndices(selectedIndices.slice(0, -1));
    };

    const handleSubmit = () => {
        const word = selectedIndices.map(i => letters[i]).join('');

        if (word.length < 3) {
            feedbackService.error(); // Trop court
            return;
        }

        if (foundWords.includes(word)) {
            feedbackService.error(); // Déjà trouvé
            setSelectedIndices([]);
            return;
        }

        // 👇 3. VÉRIFICATION INSTANTANÉE ICI
        if (DICTIONARY.has(word)) {
            feedbackService.heavy();
            setFoundWords([word, ...foundWords]);

            // Calcul des points
            let points = 1;
            if (word.length === 4) points = 2;
            if (word.length === 5) points = 3;
            if (word.length === 6) points = 5;
            if (word.length === 7) points = 10;

            setScore(score + points);
            setSelectedIndices([]);
        } else {
            // Mot inexistant
            feedbackService.error();
            setSelectedIndices([]);
        }
    };

    const currentWord = selectedIndices.map(i => letters[i]).join('');

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal isVisible={isVisible} onClose={onClose} title="Cascade Lexicale">
            <View style={styles.container}>
                {/* --- INTRO --- */}
                {gameState === 'intro' && (
                    <View style={styles.centerContent}>
                        <View style={styles.readyIconWrapper}>
                            <Type color="#009688" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Fluidité Verbale</Title>

                        <View style={styles.recordBadge}>
                            <Trophy color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                            <Text style={styles.recordText}>Record : {bestScore} pts</Text>
                        </View>

                        <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 10 }}>
                            Génère un maximum de mots valides avec les 7 lettres proposées. Plus le mot est long, plus il rapporte de points. {'\n\n'}
                            Tu as 60 secondes pour vider ton vocabulaire !
                        </BodyText>

                        <LumosButton title="Démarrer (60s)" onPress={startGame} color="#009688" style={{ width: '100%' }} />
                    </View>
                )}

                {/* --- JEU --- */}
                {gameState === 'playing' && (
                    <View style={styles.gameContent}>
                        {/* HEADER STATS */}
                        <View style={styles.statsRow}>
                            <View style={styles.glassBadge}>
                                <Target color="#009688" size={14} style={{ marginRight: 6 }} />
                                <Text style={styles.progressText}>SCORE : {score}</Text>
                            </View>
                            <View style={[styles.glassBadge, timeLeft <= 10 && { borderColor: Colors.error, backgroundColor: 'rgba(207, 102, 121, 0.1)' }]}>
                                <Text style={[styles.progressText, timeLeft <= 10 && { color: Colors.error }]}>
                                    00:{timeLeft.toString().padStart(2, '0')}
                                </Text>
                            </View>
                        </View>

                        {/* MOT COURANT */}
                        <View style={styles.currentWordBox}>
                            <Text style={styles.currentWordText}>
                                {currentWord || "..."}
                            </Text>
                        </View>

                        {/* LISTE DES LETTRES */}
                        <View style={styles.lettersGrid}>
                            {letters.map((letter, index) => {
                                const isSelected = selectedIndices.includes(index);
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.letterBtn, isSelected && styles.letterBtnSelected]}
                                        onPress={() => handleLetterPress(index)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.letterText, isSelected && styles.letterTextSelected]}>
                                            {letter}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* BOUTONS D'ACTION */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.deleteBtn} onPress={handleBackspace} activeOpacity={0.7}>
                                <Delete color={Colors.textMuted} size={24} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitBtn, currentWord.length < 3 && { opacity: 0.5 }]}
                                onPress={handleSubmit}
                                activeOpacity={0.7}
                                disabled={currentWord.length < 3}
                            >
                                <Check color="white" size={24} />
                            </TouchableOpacity>
                        </View>

                        {/* MOTS TROUVÉS */}
                        <View style={styles.foundWordsContainer}>
                            <Text style={styles.foundWordsTitle}>Mots trouvés ({foundWords.length})</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                                {foundWords.map((word, idx) => (
                                    <View key={idx} style={styles.foundWordPill}>
                                        <Text style={styles.foundWordText}>{word}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* --- RÉSULTATS --- */}
                {gameState === 'result' && (
                    <View style={styles.centerContent}>
                        <View style={[styles.readyIconWrapper, { borderColor: '#009688' }]}>
                            <Type color="#009688" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Temps écoulé !</Title>
                        <Text style={[styles.scoreText, { color: '#009688' }]}>{score}</Text>

                        {isNewRecord ? (
                            <Text style={styles.newRecordTag}>NOUVEAU RECORD !</Text>
                        ) : (
                            <Text style={styles.subRecordText}>Record actuel : {bestScore} pts</Text>
                        )}

                        <LumosButton title="Rejouer" onPress={startGame} color="#009688" style={{ width: '100%', marginBottom: 12 }} />
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

    // Thème Teal (#009688)
    readyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0, 150, 136, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: 'rgba(0, 150, 136, 0.3)' },
    recordBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8, marginBottom: 20 },
    recordText: { color: Colors.primary, fontSize: 12, fontFamily: 'PoppinsBold' },

    gameContent: { paddingTop: 10, paddingBottom: 20 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    glassBadge: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
    progressText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 13 },

    // Zone du mot
    currentWordBox: { height: 70, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    currentWordText: { fontSize: 32, fontFamily: 'PoppinsBold', color: Colors.text, letterSpacing: 3 },

    // Grille de lettres
    lettersGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20 },
    letterBtn: { width: 60, height: 60, backgroundColor: 'rgba(0, 150, 136, 0.1)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0, 150, 136, 0.3)', justifyContent: 'center', alignItems: 'center' },
    letterBtnSelected: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' },
    letterText: { fontSize: 24, fontFamily: 'PoppinsBold', color: Colors.text },
    letterTextSelected: { color: 'rgba(255,255,255,0.2)' }, // Estompé quand utilisé

    // Boutons
    actionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    deleteBtn: { flex: 1, height: 56, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    submitBtn: { flex: 2, height: 56, backgroundColor: '#009688', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },

    // Mots trouvés
    foundWordsContainer: { marginTop: 10 },
    foundWordsTitle: { color: Colors.textMuted, fontSize: 12, fontFamily: 'PoppinsSemiBold', marginBottom: 10, textTransform: 'uppercase' },
    foundWordPill: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    foundWordText: { color: Colors.text, fontFamily: 'PoppinsMedium', fontSize: 13 },

    scoreText: { fontSize: 72, fontFamily: 'PoppinsBold', marginVertical: 10 },
    newRecordTag: { color: '#009688', fontFamily: 'PoppinsBold', fontSize: 14, letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    subRecordText: { color: Colors.textMuted, fontFamily: 'PoppinsMedium', fontSize: 13, marginBottom: 15 },
    closeText: { color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline', fontFamily: 'PoppinsMedium' },
});