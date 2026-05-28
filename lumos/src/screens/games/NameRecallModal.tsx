// src/components/organisms/NameRecallModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { feedbackService } from '@/src/services/feedbackService';
import { grantXP } from '@/src/utils/rewardManager';
import { Heart, Target, Trophy, User, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { XP_REWARDS } from '../../constants/Rewards';
import { useUserStore } from '../../store/useUserStore';

interface NameRecallModalProps {
    isVisible: boolean;
    onClose: () => void;
}

// --- DONNÉES GÉNÉRATIVES ---
const FIRST_NAMES = ["Julien", "Sophie", "Marc", "Léa", "Antoine", "Chloé", "Thomas", "Marie", "Nicolas", "Camille", "Lucas", "Emma", "Hugo", "Alice", "Arthur", "Paul", "Julie", "Victor", "Sarah", "Louis"];
const PASSIONS = ["le tennis", "la lecture", "la cuisine", "le voyage", "la guitare", "le cinéma", "la photo", "le yoga", "le jardinage", "les échecs", "la rando", "la peinture", "le piano", "la natation"];
const AVATAR_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

interface Person {
    id: string;
    name: string;
    passion: string;
    color: string;
}

interface Question {
    person: Person;
    type: 'name' | 'passion';
    text: string;
    correct: string;
    options: string[];
}

export const NameRecallModal = ({ isVisible, onClose }: NameRecallModalProps) => {
    const updateHighScore = useUserStore(state => state.updateHighScore);
    const addLumens = useUserStore(state => state.addLumens);
    const bestScore = useUserStore(state => state.highScores['nameRecall'] || 0);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [gameState, setGameState] = useState<'intro' | 'memorizing' | 'testing' | 'result'>('intro');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isNewRecord, setIsNewRecord] = useState(false);

    // État du tour
    const [people, setPeople] = useState<Person[]>([]);
    const [currentPersonIndex, setCurrentPersonIndex] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        if (isVisible) setGameState('intro');
    }, [isVisible]);

    const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);

    const startNewRound = (currentLevel: number) => {
        // 1. Générer de nouvelles personnes (Niveau 1 = 2 pers, Niv 2 = 3 pers, etc.)
        const numPeople = 1 + currentLevel;
        const newPeople: Person[] = [];

        const shuffledNames = shuffle([...FIRST_NAMES]);
        const shuffledPassions = shuffle([...PASSIONS]);
        const shuffledColors = shuffle([...AVATAR_COLORS]);

        for (let i = 0; i < numPeople; i++) {
            newPeople.push({
                id: `p_${i}`,
                name: shuffledNames[i],
                passion: shuffledPassions[i],
                color: shuffledColors[i % AVATAR_COLORS.length]
            });
        }

        setPeople(newPeople);
        setCurrentPersonIndex(0);
        setGameState('memorizing');
    };

    const nextPerson = () => {
        feedbackService.light();
        if (currentPersonIndex < people.length - 1) {
            setCurrentPersonIndex(prev => prev + 1);
        } else {
            generateQuestions(people);
            setGameState('testing');
        }
    };

    const generateQuestions = (currentPeople: Person[]) => {
        const newQuestions: Question[] = [];

        currentPeople.forEach(person => {
            // 1. Question sur le prénom
            const wrongNames = shuffle([...FIRST_NAMES].filter(n => n !== person.name)).slice(0, 3);
            newQuestions.push({
                person,
                type: 'name',
                text: "Comment s'appelle cette personne ?",
                correct: person.name,
                options: shuffle([person.name, ...wrongNames])
            });

            // 2. Question sur la passion
            const wrongPassions = shuffle([...PASSIONS].filter(p => p !== person.passion)).slice(0, 3);
            newQuestions.push({
                person,
                type: 'passion',
                text: `Qu'aime faire ${person.name} ?`,
                correct: person.passion,
                options: shuffle([person.passion, ...wrongPassions])
            });
        });

        // Mélanger toutes les questions du niveau
        setQuestions(shuffle(newQuestions));
        setCurrentQuestionIndex(0);
    };

    const handleAnswer = (answer: string) => {
        const currentQ = questions[currentQuestionIndex];

        if (answer === currentQ.correct) {
            feedbackService.light();
            setScore(prev => prev + 10);

            // Passer à la question suivante ou au niveau suivant
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                feedbackService.heavy();
                setTimeout(() => {
                    setLevel(prev => prev + 1);
                    startNewRound(level + 1);
                }, 500);
            }
        } else {
            feedbackService.error();
            const nextLives = lives - 1;
            setLives(nextLives);

            if (nextLives <= 0) {
                endGame(score);
            } else {
                // S'il se trompe, on passe quand même à la question suivante pour ne pas bloquer
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    setLevel(prev => prev + 1);
                    startNewRound(level + 1);
                }
            }
        }
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
        trackToolUsage('nameRecall');
        if (finalScore > bestScore) {
            setIsNewRecord(true);
            updateHighScore('nameRecall', finalScore);
            grantXP(XP_REWARDS.GAME_NEW_RECORD);
        }
    };

    if (!isVisible) return null;

    const currentPerson = people[currentPersonIndex];
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <BaseBottomSheetModal isVisible={isVisible} onClose={onClose} title="Trombinoscope">
            <View style={styles.container}>
                {/* --- INTRO --- */}
                {gameState === 'intro' && (
                    <View style={styles.centerContent}>
                        <View style={styles.readyIconWrapper}>
                            <Users color="#8B5CF6" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Mémoire Sociale</Title>

                        <View style={styles.recordBadge}>
                            <Trophy color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                            <Text style={styles.recordText}>Record : {bestScore} pts</Text>
                        </View>

                        <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 10 }}>
                            Mémorise les visages, les prénoms et les passions des personnes présentées. {'\n\n'}
                            Tu devras ensuite répondre à des questions sur eux. Tu as 3 vies !
                        </BodyText>

                        <LumosButton title="Démarrer" onPress={startGame} color="#8B5CF6" style={{ width: '100%' }} />
                    </View>
                )}

                {/* --- PHASE MÉMORISATION --- */}
                {gameState === 'memorizing' && currentPerson && (
                    <View style={styles.gameContent}>
                        <View style={styles.statsRow}>
                            <View style={styles.glassBadge}>
                                <Text style={styles.progressText}>Mémorisation (Niv {level})</Text>
                            </View>
                            <View style={styles.glassBadge}>
                                <Text style={styles.progressText}>{currentPersonIndex + 1} / {people.length}</Text>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <View style={[styles.avatarBox, { backgroundColor: currentPerson.color }]}>
                                <User color="#FFF" size={80} />
                            </View>
                            <Text style={styles.personName}>{currentPerson.name}</Text>
                            <View style={styles.passionTag}>
                                <Text style={styles.personPassion}>Aime {currentPerson.passion}</Text>
                            </View>
                        </View>

                        <LumosButton
                            title={currentPersonIndex < people.length - 1 ? "Suivant" : "Prêt pour le test !"}
                            onPress={nextPerson}
                            color="#8B5CF6"
                            style={{ width: '100%' }}
                        />
                    </View>
                )}

                {/* --- PHASE TEST --- */}
                {gameState === 'testing' && currentQuestion && (
                    <View style={styles.gameContent}>
                        <View style={styles.statsRow}>
                            <View style={styles.glassBadge}>
                                <Target color="#8B5CF6" size={14} style={{ marginRight: 6 }} />
                                <Text style={styles.progressText}>SCORE: {score}</Text>
                            </View>
                            <View style={styles.livesRow}>
                                {[1, 2, 3].map((heart) => (
                                    <Heart key={heart} size={18} color={heart <= lives ? Colors.error : 'rgba(255,255,255,0.1)'} fill={heart <= lives ? Colors.error : 'transparent'} style={{ marginLeft: 4 }} />
                                ))}
                            </View>
                        </View>

                        <Text style={styles.questionText}>{currentQuestion.text}</Text>

                        {/* On affiche toujours l'avatar de la personne ciblée */}
                        <View style={[styles.miniAvatarBox, { backgroundColor: currentQuestion.person.color }]}>
                            <User color="#FFF" size={40} />
                        </View>

                        <View style={styles.answersGrid}>
                            {currentQuestion.options.map((opt, index) => (
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
                        <View style={[styles.readyIconWrapper, { borderColor: '#8B5CF6' }]}>
                            <Users color="#8B5CF6" size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Test Terminé</Title>
                        <Text style={[styles.scoreText, { color: '#8B5CF6' }]}>{score}</Text>

                        {isNewRecord ? (
                            <Text style={styles.newRecordTag}>NOUVEAU RECORD !</Text>
                        ) : (
                            <Text style={styles.subRecordText}>Record actuel : {bestScore} pts</Text>
                        )}

                        <LumosButton title="Rejouer" onPress={startGame} color="#8B5CF6" style={{ width: '100%', marginBottom: 12 }} />
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

    // Thème Violet/Social (#8B5CF6)
    readyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(139, 92, 246, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: 'rgba(139, 92, 246, 0.3)' },
    recordBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8, marginBottom: 20 },
    recordText: { color: Colors.primary, fontSize: 12, fontFamily: 'PoppinsBold' },

    gameContent: { paddingTop: 10, paddingBottom: 20, flex: 1 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    glassBadge: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center' },
    progressText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 13 },
    livesRow: { flexDirection: 'row', alignItems: 'center' },

    // Carte de mémorisation
    card: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', padding: 20, marginBottom: 20 },
    avatarBox: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
    personName: { color: Colors.text, fontSize: 32, fontFamily: 'PoppinsBold', marginBottom: 10 },
    passionTag: { backgroundColor: 'rgba(139, 92, 246, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.3)' },
    personPassion: { color: '#8B5CF6', fontSize: 16, fontFamily: 'PoppinsSemiBold' },

    // Phase de test
    questionText: { color: Colors.text, fontSize: 20, fontFamily: 'PoppinsSemiBold', textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 },
    miniAvatarBox: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 30 },

    answersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
    glassAnswerBtn: { width: '48%', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
    answerBtnText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 14, textAlign: 'center', paddingHorizontal: 5 },

    scoreText: { fontSize: 72, fontFamily: 'PoppinsBold', marginVertical: 10 },
    newRecordTag: { color: '#8B5CF6', fontFamily: 'PoppinsBold', fontSize: 14, letterSpacing: 1, marginBottom: 15, textTransform: 'uppercase' },
    subRecordText: { color: Colors.textMuted, fontFamily: 'PoppinsMedium', fontSize: 13, marginBottom: 15 },
    closeText: { color: Colors.textMuted, fontSize: 14, textDecorationLine: 'underline', fontFamily: 'PoppinsMedium' },
});