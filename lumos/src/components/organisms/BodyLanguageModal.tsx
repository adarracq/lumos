import { Copy, Eye, Hand, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

export const BodyLanguageModal = ({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) => {
    if (!isVisible) return null;
    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Présence & Posture"
        >

            <View style={styles.glassTipCard}>
                <View style={styles.iconBg}><Hand color="#4CAF50" size={24} /></View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.tipTitle}>Posture Ouverte</Text>
                    <Text style={styles.tipDesc}>Mains hors des poches, bras décroisés. Utilise tes mains quand tu parles, fige-les quand tu écoutes.</Text>
                </View>
            </View>

            <View style={styles.glassTipCard}>
                <View style={styles.iconBg}><Eye color="#4CAF50" size={24} /></View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.tipTitle}>Regard 80/20</Text>
                    <Text style={styles.tipDesc}>Contact visuel 80% du temps. S'il y a gêne, lâche le regard doucement sur le côté, pas vers le bas.</Text>
                </View>
            </View>

            <View style={styles.glassTipCard}>
                <View style={styles.iconBg}><Copy color="#4CAF50" size={24} /></View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.tipTitle}>L'Effet Miroir (Négociation)</Text>
                    <Text style={styles.tipDesc}>Répète simplement les 2 ou 3 derniers mots importants que ton interlocuteur vient de dire, puis fais un silence. Il va naturellement développer et se confier.</Text>
                </View>
            </View>

            <View style={styles.glassTipCard}>
                <View style={styles.iconBg}><Users color="#4CAF50" size={24} /></View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.tipTitle}>Écoute et Synchronisation</Text>
                    <Text style={styles.tipDesc}>Ajuste subtilement ta posture à la sienne. Écoute sans chercher à préparer ta réponse.</Text>
                </View>
            </View>
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.surface, height: '80%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

    // Glass Tip Card
    glassTipCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 16, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    iconBg: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(76, 175, 80, 0.1)', marginRight: 15 },
    tipTitle: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 16, marginBottom: 4 },
    tipDesc: { color: Colors.textMuted, fontSize: 13, lineHeight: 18, fontFamily: 'InterRegular' }
});