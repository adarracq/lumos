import { feedbackService } from '@/src/services/feedbackService';
import { Brain, Eye, Filter, RefreshCcw, Search, ShieldAlert, Sparkles, UserCheck, Users, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface ReframerModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const BIASES = [
    { id: 'projecteur', icon: Eye, title: "Effet de Projecteur", desc: "Je surestime l'attention que les autres me portent.", color: "#2196F3" },
    { id: 'anticipation', icon: ShieldAlert, title: "Anticipation Négative", desc: "J'imagine le pire scénario sans aucune preuve objective.", color: "#E91E63" },
    { id: 'negativite', icon: Search, title: "Biais de Négativité", desc: "J'accorde plus de poids aux critiques et échecs qu'aux réussites.", color: "#FF9800" },
    { id: 'attribution', icon: Zap, title: "Erreur d'Attribution", desc: "Je juge les autres durement sans prendre en compte leur contexte.", color: "#9C27B0" },
    { id: 'confirmation', icon: Filter, title: "Biais de Confirmation", desc: "Je cherche des preuves qui confirment mes croyances au lieu de les remettre en question.", color: "#00BCD4" },
    { id: 'desirabilite', icon: UserCheck, title: "Désirabilité Sociale", desc: "J'agis pour plaire aux autres plutôt que d'être authentique.", color: "#4CAF50" },
    { id: 'spectateur', icon: Users, title: "Effet du Spectateur", desc: "J'attends que quelqu'un d'autre prenne l'initiative à ma place.", color: "#795548" },
];

export const ReframerModal = ({ isVisible, onClose }: ReframerModalProps) => {
    const [selectedBias, setSelectedBias] = useState<any>(null);

    const handleResetAndClose = () => {
        setSelectedBias(null);
        onClose();
    };

    if (!isVisible) return null;

    return (

        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Recadrage Mental"
        >

            {!selectedBias ? (
                <View style={{ flex: 1, marginTop: 10 }}>
                    <BodyText style={{ marginBottom: 20 }}>
                        Notre cerveau crée des "bugs" d'interprétation. Lequel te bloque en ce moment ?
                    </BodyText>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {BIASES.map((bias) => (
                            <TouchableOpacity
                                key={bias.id}
                                style={[styles.glassBiasCard, { borderColor: `${bias.color}40` }]}
                                onPress={() => { setSelectedBias(bias); feedbackService.light() }}
                            >
                                <View style={[styles.iconBg, { backgroundColor: `${bias.color}15` }]}>
                                    <bias.icon color={bias.color} size={24} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.biasTitle}>{bias.title}</Text>
                                    <Text style={styles.biasDesc}>{bias.desc}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            ) : (
                <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
                    <View style={[styles.iconCircle, { borderColor: selectedBias.color, backgroundColor: `${selectedBias.color}15` }]}>
                        <Brain color={selectedBias.color} size={40} />
                    </View>

                    <Title center style={{ color: selectedBias.color, marginBottom: 5 }}>Neutralisation</Title>
                    <Text style={styles.targetBiasText}>Cible : {selectedBias.title}</Text>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', marginTop: 20 }} contentContainerStyle={{ paddingBottom: 20 }}>

                        <View style={styles.glassReframingBlock}>
                            <View style={styles.reframingHeader}>
                                <RefreshCcw color={Colors.primary} size={18} />
                                <Text style={styles.reframingTitle}>1. Recadrage de Sens</Text>
                            </View>
                            <Text style={styles.reframingText}>Plutôt que "Je vais être ridicule", dis-toi : "Si j'essaye, j'apprends et je progresse." Change l'étiquette de la situation et vois-la sous un autre angle.</Text>
                        </View>

                        <View style={styles.glassReframingBlock}>
                            <View style={styles.reframingHeader}>
                                <Sparkles color={Colors.primary} size={18} />
                                <Text style={styles.reframingTitle}>2. Recadrage de Point de vue</Text>
                            </View>
                            <Text style={styles.reframingText}>Si ton meilleur ami vivait exactement la même chose, que lui dirais-tu ? Change de perspective et applique cette même bienveillance à toi-même.</Text>
                        </View>

                        <View style={styles.glassReframingBlock}>
                            <View style={styles.reframingHeader}>
                                <Eye color={Colors.primary} size={18} />
                                <Text style={styles.reframingTitle}>3. Recadrage de Temporalité</Text>
                            </View>
                            <Text style={styles.reframingText}>Est-ce que ce problème aura encore de l'importance dans 1 semaine ? Dans 1 an ? Relativise en pensant au long terme.</Text>
                        </View>

                    </ScrollView>

                    <TouchableOpacity onPress={() => { setSelectedBias(null); feedbackService.light() }} style={{ marginTop: 15, marginBottom: 10 }}>
                        <Text style={styles.backText}>Retour aux biais</Text>
                    </TouchableOpacity>
                </View>
            )}

        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.surface, height: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

    // Glass Bias Card
    glassBiasCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
    iconBg: { padding: 12, borderRadius: 12, marginRight: 15 },
    biasTitle: { color: Colors.text, fontSize: 16, fontFamily: 'PoppinsSemiBold', marginBottom: 4 },
    biasDesc: { color: Colors.textMuted, fontSize: 13, lineHeight: 18 },

    // Écran 2
    iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 2, marginBottom: 15 },
    targetBiasText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 },

    // Glass Reframing Block
    glassReframingBlock: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 16, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: Colors.primary, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    reframingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    reframingTitle: { color: Colors.primary, fontFamily: 'PoppinsSemiBold', fontSize: 14 },
    reframingText: { color: Colors.text, fontSize: 14, lineHeight: 20, fontFamily: 'InterRegular' },

    backText: { color: Colors.textMuted, textDecorationLine: 'underline', fontSize: 14 }
});