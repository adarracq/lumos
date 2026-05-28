// src/components/organisms/SocialModal.tsx
import * as Clipboard from 'expo-clipboard';
import { Copy, Hash, MessageCircleHeart, MessageSquare, ShieldCheck, UserPlus, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { feedbackService } from '../../services/feedbackService';
import { useToastStore } from '../../store/useToastStore';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface SocialModalProps {
    isVisible: boolean;
    onClose: () => void;
}

// --- DONNÉES ---
const APPROACH_TIPS = [
    { icon: Zap, title: "Règle du 1-2-3", desc: "Évite la sur-analyse. Compte 1, 2, 3 dans ta tête et lance-toi avec la première idée qui te vient." },
    { icon: UserPlus, title: "La Faveur Inversée", desc: "Demande un micro-service insignifiant (ex: \"Tu as l'heure ?\"). Psychologiquement, cela force l'autre à s'investir et à t'apprécier." },
    { icon: MessageSquare, title: "L'Ancre du Prénom", desc: "Répète son prénom de manière fluide : au début pour valider, au milieu pour capter l'attention, à la fin pour marquer l'esprit." },
    { icon: ShieldCheck, title: "Inviter le \"Non\"", desc: "Aborde en disant : \"Est-ce que je vous dérange ?\" L'autre se sent en contrôle, la pression chute immédiatement." },
    { icon: MessageSquare, title: "L'Accroche Simple", desc: "Demande un conseil sincère, ou sois direct : \"Salut, tu as l'air sympa donc j'ai décidé de venir te parler.\"" }
];

const DEEP_QUESTIONS = [
    { theme: "Général / Rencontre", text: "Si je devais te poser une seule question pour te découvrir vraiment, ce serait quoi ?" },
    { theme: "Général / Rencontre", text: "Si tu pouvais, à quoi aimerais-tu consacrer plus de temps ?" },
    { theme: "Général / Rencontre", text: "Qu'est-ce qui compte le plus pour toi aujourd'hui ?" },
    { theme: "Projets et Avenir", text: "Ce serait quoi ta journée idéale, maintenant et dans 5 ans ?" },
    { theme: "Projets et Avenir", text: "Tu dirais quoi à ton toi du passé ?" },
    { theme: "Expériences et Souvenirs", text: "C'est quand la dernière fois que tu es sorti de ta zone de confort ?" },
    { theme: "Expériences et Souvenirs", text: "Quels sont tes doutes concernant le futur ?" },
    { theme: "Valeurs et Perception", text: "Quel est le meilleur conseil qu'on t'ait donné ?" },
    { theme: "Valeurs et Perception", text: "Y a-t-il un sujet sur lequel tu penses différemment de la plupart des gens ?" },
    { theme: "Relationnel & Personnalité", text: "À quoi penses-tu le plus quand tu es seul ?" },
    { theme: "Relationnel & Personnalité", text: "Quel est le meilleur cadeau qu'on puisse te faire ?" }
];

export const SocialModal = ({ isVisible, onClose }: SocialModalProps) => {
    const [activeTab, setActiveTab] = useState<'techniques' | 'questions'>('techniques');
    const [currentQuestion, setCurrentQuestion] = useState(DEEP_QUESTIONS[0]);
    const { showToast } = useToastStore();

    const generateNewQuestion = () => {
        feedbackService.light();
        let newQuestion;
        do {
            const randomIndex = Math.floor(Math.random() * DEEP_QUESTIONS.length);
            newQuestion = DEEP_QUESTIONS[randomIndex];
        } while (newQuestion.text === currentQuestion.text && DEEP_QUESTIONS.length > 1);
        setCurrentQuestion(newQuestion);
    };

    useEffect(() => {
        if (isVisible) {
            generateNewQuestion();
            setActiveTab('techniques');
        }
    }, [isVisible]);

    const handleCopy = async () => {
        feedbackService.light();
        await Clipboard.setStringAsync(currentQuestion.text);
        showToast("Question copiée dans le presse-papier.");
    };

    if (!isVisible) return null;

    // Couleur d'accentuation (Bleu social)
    const ACCENT_COLOR = "#2196F3";

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Briseur de Glace"
        >
            {/* SÉLECTEUR D'ONGLETS (Segmented Control) */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'techniques' && { backgroundColor: `${ACCENT_COLOR}25` }]}
                    onPress={() => { setActiveTab('techniques'); feedbackService.light(); }}
                    activeOpacity={0.7}
                >
                    <Zap color={activeTab === 'techniques' ? ACCENT_COLOR : Colors.textMuted} size={18} />
                    <Text style={[styles.tabText, activeTab === 'techniques' && { color: ACCENT_COLOR }]}>L'Approche</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'questions' && { backgroundColor: `${ACCENT_COLOR}25` }]}
                    onPress={() => { setActiveTab('questions'); feedbackService.light(); }}
                    activeOpacity={0.7}
                >
                    <MessageCircleHeart color={activeTab === 'questions' ? ACCENT_COLOR : Colors.textMuted} size={18} />
                    <Text style={[styles.tabText, activeTab === 'questions' && { color: ACCENT_COLOR }]}>Questions</Text>
                </TouchableOpacity>
            </View>

            {/* CONTENU : GÉNÉRATEUR DE QUESTIONS */}
            {activeTab === 'questions' && (
                <View style={styles.contentWrapper}>
                    <BodyText style={{ marginBottom: 20, textAlign: 'center', opacity: 0.9 }}>
                        Utilise ces questions pour déclencher des conversations authentiques et profondes.
                    </BodyText>

                    <View style={styles.glassCard}>
                        <View style={[styles.themeBadge, { borderColor: `${ACCENT_COLOR}60` }]}>
                            <Hash color={ACCENT_COLOR} size={14} />
                            <Text style={[styles.themeText, { color: ACCENT_COLOR }]}>{currentQuestion.theme}</Text>
                        </View>

                        <View style={[styles.iconBg, { backgroundColor: `${ACCENT_COLOR}15` }]}>
                            <MessageCircleHeart color={ACCENT_COLOR} size={32} />
                        </View>

                        <Text style={styles.questionText}>
                            "{currentQuestion.text}"
                        </Text>
                    </View>

                    <View style={styles.actionsContainer}>
                        <LumosButton
                            title="Nouvelle question"
                            onPress={generateNewQuestion}
                            style={{ flex: 1 }}
                            color={ACCENT_COLOR}
                        />

                        <TouchableOpacity style={styles.glassCopyBtn} onPress={handleCopy}>
                            <Copy color={Colors.text} size={22} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* CONTENU : TECHNIQUES D'APPROCHE */}
            {activeTab === 'techniques' && (
                <View style={styles.contentWrapper}>
                    <BodyText style={{ marginBottom: 20, opacity: 0.9 }}>
                        Outils mentaux pour désamorcer l'anxiété d'approche et créer un premier contact naturel.
                    </BodyText>

                    {APPROACH_TIPS.map((tip, index) => (
                        <View key={index} style={styles.glassTipCard}>
                            <View style={[styles.tipIconBg, { backgroundColor: `${ACCENT_COLOR}15` }]}>
                                <tip.icon color={ACCENT_COLOR} size={22} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.tipTitle}>{tip.title}</Text>
                                <Text style={styles.tipDesc}>{tip.desc}</Text>
                            </View>
                        </View>
                    ))}
                    <View style={{ height: 20 }} />
                </View>
            )}

        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    contentWrapper: {
        marginTop: 10,
    },
    // Segmented Control
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 14,
        padding: 4,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 8,
    },
    tabText: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 13,
        color: Colors.textMuted,
    },

    // 1. STYLES DES QUESTIONS (Générateur)
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        padding: 30,
        paddingTop: 44,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(33, 150, 243, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 260,
        marginBottom: 24,
        position: 'relative',
    },
    themeBadge: {
        position: 'absolute',
        top: -15,
        backgroundColor: '#161616', // Fond opaque pour masquer la bordure de la carte derrière
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    themeText: { fontSize: 11, fontFamily: 'PoppinsBold', textTransform: 'uppercase', letterSpacing: 0.5 },
    iconBg: { padding: 16, borderRadius: 20, marginBottom: 20 },
    questionText: { color: Colors.text, fontSize: 20, fontFamily: 'PoppinsSemiBold', textAlign: 'center', lineHeight: 30 },
    actionsContainer: { flexDirection: 'row', gap: 15, alignItems: 'center' },
    glassCopyBtn: { width: 56, height: 56, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center' },

    // 2. STYLES DES TECHNIQUES (Approche)
    glassTipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    tipIconBg: { padding: 12, borderRadius: 14, marginRight: 15 },
    tipTitle: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 15, marginBottom: 4 },
    tipDesc: { color: Colors.textMuted, fontSize: 13, lineHeight: 18, fontFamily: 'InterRegular' }
});