import { feedbackService } from '@/src/services/feedbackService';
import { Flame, RefreshCw, Shield, Swords, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface SocialDojoModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const CHALLENGES = {
    warmup: [
        { title: "L'Échauffement", text: "Dis un grand 'Bonjour' et souris au prochain commerçant ou passant que tu croises." },
        { title: "Interaction basique", text: "Demande l'heure ou ton chemin à un inconnu dans la rue." },
        { title: "Commentaire à froid", text: "Fais un commentaire positif sur l'environnement à quelqu'un à côté de toi (ex: la météo, la queue au supermarché)." }
    ],
    progression: [
        { title: "L'art du 'Non'", text: "Aborde quelqu'un en demandant un conseil, mais commence par : 'Excusez-moi, est-ce que je vous dérange ?'" },
        { title: "Le Compliment", text: "Fais un compliment sincère et unique à un inconnu sur son style ou son énergie, puis pars." },
        { title: "Rupture de pattern", text: "Dans une conversation, compte 1-2-3 dans ta tête et dis exactement la première chose qui te passe par l'esprit, sans filtrer." }
    ],
    hardcore: [
        { title: "L'assise mentale", text: "Assieds-toi ou allonge-toi par terre dans une rue passante pendant 1 minute. Observe la peur du regard des autres disparaître." },
        { title: "L'espace public", text: "Assieds-toi sur un banc en plein centre-ville, ferme les yeux et médite pendant 3 minutes." },
        { title: "L'Inconnu total", text: "Serre la main d'un inconnu dans la rue et présente-toi spontanément sans aucune raison." },
        { title: "L'Expert improvisé", text: "Dans un magasin, donne spontanément un conseil à un client sur un produit qu'il regarde." }
    ]
};

type Difficulty = 'warmup' | 'progression' | 'hardcore' | null;

export const SocialDojoModal = ({ isVisible, onClose }: SocialDojoModalProps) => {
    const [difficulty, setDifficulty] = useState<Difficulty>(null);
    const [currentChallenge, setCurrentChallenge] = useState<any>(null);

    const generateChallenge = (level: Difficulty) => {
        if (!level) return;
        const pool = CHALLENGES[level];
        const random = pool[Math.floor(Math.random() * pool.length)];
        setCurrentChallenge(random);
        setDifficulty(level);
    };

    const handleResetAndClose = () => {
        setDifficulty(null);
        setCurrentChallenge(null);
        onClose();
    };

    if (!isVisible) return null;

    const getDifficultyColor = () => {
        if (difficulty === 'warmup') return '#4CAF50';
        if (difficulty === 'progression') return '#FF9800';
        if (difficulty === 'hardcore') return '#E91E63';
        return Colors.primary;
    };

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Dojo Social"
        >

            {!currentChallenge ? (
                <View style={{ flex: 1, marginTop: 10 }}>
                    <BodyText style={{ marginBottom: 30, textAlign: 'center' }}>
                        L'aisance sociale s'entraîne comme un muscle. Choisis ta zone d'inconfort pour aujourd'hui.
                    </BodyText>

                    <TouchableOpacity style={[styles.glassLevelCard, { borderColor: 'rgba(76, 175, 80, 0.3)' }]} onPress={() => { generateChallenge('warmup'); feedbackService.light(); }}>
                        <View style={[styles.iconBg, { backgroundColor: '#4CAF5015' }]}><Shield color="#4CAF50" size={32} /></View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.levelTitle, { color: '#4CAF50' }]}>Zone de Sécurité</Text>
                            <Text style={styles.levelDesc}>Échauffement social. Idéal pour briser la glace en douceur.</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.glassLevelCard, { borderColor: 'rgba(255, 152, 0, 0.3)' }]} onPress={() => { generateChallenge('progression'); feedbackService.medium(); }}>
                        <View style={[styles.iconBg, { backgroundColor: '#FF980015' }]}><TrendingUp color="#FF9800" size={32} /></View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.levelTitle, { color: '#FF9800' }]}>Zone de Progression</Text>
                            <Text style={styles.levelDesc}>Développement actif. Ose un peu plus d'interactions.</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.glassLevelCard, { borderColor: 'rgba(233, 30, 99, 0.3)' }]} onPress={() => { generateChallenge('hardcore'); feedbackService.heavy(); }}>
                        <View style={[styles.iconBg, { backgroundColor: '#E91E6315' }]}><Flame color="#E91E63" size={32} /></View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.levelTitle, { color: '#E91E63' }]}>Zone d'Inconfort</Text>
                            <Text style={styles.levelDesc}>Rupture de pattern radicale. Affranchissez-vous du regard des autres.</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
                    <View style={[styles.bigIconCircle, { borderColor: getDifficultyColor(), backgroundColor: `${getDifficultyColor()}15` }]}>
                        <Swords color={getDifficultyColor()} size={48} />
                    </View>

                    <Text style={[styles.challengePreTitle, { color: getDifficultyColor() }]}>Ton défi du jour</Text>
                    <Title center style={{ marginBottom: 20 }}>{currentChallenge.title}</Title>

                    <View style={styles.glassChallengeBox}>
                        <Text style={styles.challengeText}>{currentChallenge.text}</Text>
                    </View>

                    <BodyText center style={{ marginTop: 20, marginBottom: 'auto', paddingHorizontal: 20 }}>
                        La règle du 1-2-3 : Évitez la sur-analyse. Accepte le rejet comme une victoire personnelle.
                    </BodyText>

                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.glassRerollBtn} onPress={() => { generateChallenge(difficulty); feedbackService.light(); }}>
                            <RefreshCw color={Colors.textMuted} size={24} />
                        </TouchableOpacity>
                        <LumosButton
                            title="J'accepte le défi"
                            onPress={handleResetAndClose}
                            style={{ flex: 1 }}
                            color={getDifficultyColor()}
                        />
                    </View>

                    <TouchableOpacity onPress={() => { setCurrentChallenge(null); feedbackService.light(); }} style={{ marginTop: 20 }}>
                        <Text style={{ color: Colors.textMuted, textDecorationLine: 'underline' }}>Changer de difficulté</Text>
                    </TouchableOpacity>
                </View>
            )}

        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.surface, height: '90%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

    // Glass Level Card
    glassLevelCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 20, borderRadius: 20, marginBottom: 15, borderWidth: 1 },
    iconBg: { padding: 15, borderRadius: 16, marginRight: 15 },
    levelTitle: { fontSize: 18, fontFamily: 'PoppinsBold', marginBottom: 4 },
    levelDesc: { color: Colors.textMuted, fontSize: 13, lineHeight: 18, fontFamily: 'InterRegular' },

    bigIconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 2, marginBottom: 20 },
    challengePreTitle: { fontFamily: 'PoppinsBold', textTransform: 'uppercase', letterSpacing: 2, fontSize: 12, marginBottom: 5 },

    // Glass Challenge Box
    glassChallengeBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 25, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', width: '100%' },
    challengeText: { color: Colors.text, fontSize: 18, lineHeight: 28, fontFamily: 'PoppinsSemiBold', textAlign: 'center' },

    actionsRow: { flexDirection: 'row', gap: 15, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20 },

    // Glass Reroll Button
    glassRerollBtn: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center' }
});