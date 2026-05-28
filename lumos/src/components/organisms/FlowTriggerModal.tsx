import { useUserStore } from '@/src/store/useUserStore';
import { CheckSquare, Square } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface FlowTriggerModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const FLOW_CONDITIONS = [
    { id: 1, title: "L'objectif est clair", desc: "Je sais exactement ce que je dois produire." },
    { id: 2, title: "Zéro distraction", desc: "Mon téléphone est hors de vue et les notifications sont coupées." },
    { id: 3, title: "La règle des +10%", desc: "La tâche est juste assez difficile (+10%) pour m'éviter l'ennui sans créer d'anxiété." },
    { id: 4, title: "Le pacte de friction", desc: "J'accepte que les 15 premières minutes seront inconfortables avant que le Flow n'arrive." }
];

export const FlowTriggerModal = ({ isVisible, onClose }: FlowTriggerModalProps) => {
    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const toggleCheck = (id: number) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleResetAndClose = () => {
        setCheckedItems({});
        trackToolUsage('flow');
        onClose();
    };

    const isAllChecked = FLOW_CONDITIONS.every(c => checkedItems[c.id]);

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Rituel de Concentration"
        >

            <BodyText style={{ marginBottom: 25 }}>
                L'état de Flow ne s'atteint pas par hasard. Valide tes conditions avant le démarrage.
            </BodyText>

            <View style={styles.checklist}>
                {FLOW_CONDITIONS.map((condition) => {
                    const isChecked = !!checkedItems[condition.id];
                    return (
                        <TouchableOpacity
                            key={condition.id}
                            style={[styles.checkItem, isChecked && styles.checkItemDone]}
                            onPress={() => toggleCheck(condition.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.checkIcon}>
                                {isChecked ? <CheckSquare color="#FF9800" size={24} /> : <Square color={Colors.textMuted} size={24} />}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.itemTitle, isChecked && { color: "#FF9800" }]}>{condition.title}</Text>
                                <Text style={[styles.itemDesc, isChecked && { textDecorationLine: 'line-through', opacity: 0.7 }]}>{condition.desc}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={styles.footer}>
                {isAllChecked ? (
                    <LumosButton
                        title="Départ"
                        onPress={handleResetAndClose}
                        color={"#FF9800"}
                    />
                ) : (
                    <Text style={styles.waitingText}>
                        Valide toutes les conditions pour débloquer ton focus.
                    </Text>
                )}
            </View>

        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: Colors.surface,
        height: '80%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

    checklist: { flex: 1 },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    checkItemDone: { borderColor: 'rgba(255, 152, 0, 0.4)', backgroundColor: 'rgba(255, 152, 0, 0.08)' },
    checkIcon: { marginRight: 15, marginTop: 2 },
    itemTitle: { color: Colors.text, fontSize: 16, fontFamily: 'PoppinsSemiBold', marginBottom: 4 },
    itemDesc: { color: Colors.textMuted, fontSize: 12, lineHeight: 18, fontFamily: 'InterRegular' },

    footer: { height: 80, justifyContent: 'center', alignItems: 'center' },
    waitingText: { color: Colors.textMuted, fontStyle: 'italic', fontSize: 14, textAlign: 'center', fontFamily: 'InterRegular' }
});