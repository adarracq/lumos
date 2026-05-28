// src/components/organisms/AddTaskModal.tsx
import { feedbackService } from '@/src/services/feedbackService';
import { Flame, Info, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useTaskStore } from '../../store/useTaskStore';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

export const AddTaskModal = () => {
    const { isAddModalVisible, setAddModalVisible, addTask } = useTaskStore();
    const [title, setTitle] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [isImportant, setIsImportant] = useState(false);

    const handleClose = () => {
        setAddModalVisible(false);
        setTitle('');
        setIsUrgent(false);
        setIsImportant(false);
    };

    const handleAdd = () => {
        if (title.trim().length > 0) {
            addTask(title.trim(), isUrgent, isImportant);
            handleClose();
        }
    };

    return (
        <BaseBottomSheetModal
            isVisible={isAddModalVisible}
            onClose={handleClose}
            title="Ajouter une tâche"
        >
            <BodyText style={{ marginBottom: 20, color: Colors.textMuted }}>
                Si ça prend moins de 2 minutes, fais-le tout de suite. Sinon, note-le ici.
            </BodyText>

            <TextInput
                style={styles.glassInput}
                placeholder="Que dois-tu accomplir ?"
                placeholderTextColor={Colors.textMuted}
                value={title}
                onChangeText={setTitle}
                autoFocus
                selectionColor={Colors.primary}
            />

            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={[styles.optionBtn, isUrgent && styles.optionUrgentActive]}
                    onPress={() => { setIsUrgent(!isUrgent); feedbackService.light(); }}
                    activeOpacity={0.8}
                >
                    <Flame color={isUrgent ? Colors.error : Colors.textMuted} size={18} />
                    <Text style={[styles.optionText, isUrgent && { color: Colors.error }]}>Urgent</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.optionBtn, isImportant && styles.optionImportantActive]}
                    onPress={() => { setIsImportant(!isImportant); feedbackService.light(); }}
                    activeOpacity={0.8}
                >
                    <Star color={isImportant ? Colors.primary : Colors.textMuted} size={18} />
                    <Text style={[styles.optionText, isImportant && { color: Colors.primary }]}>Important</Text>
                </TouchableOpacity>
            </View>

            {/* 💡 NOUVEAU : ENCART D'INFO PSYCHOLOGIQUE */}
            <View style={styles.infoBlock}>
                <View style={styles.infoHeader}>
                    <Info color={Colors.primary} size={16} />
                    <Text style={styles.infoTitle}>Implémentation d'intention</Text>
                </View>
                <Text style={styles.infoDesc}>
                    Précise mentalement le <Text style={styles.highlight}>Où, Quand et Comment</Text> tu vas accomplir cette tâche.{"\n"}Pré-décider supprime la friction décisionnelle et triple tes chances d'agir.
                </Text>
            </View>

            <LumosButton title="Ajouter à ma liste" onPress={handleAdd} disabled={title.trim().length === 0} />
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    // Input Glassmorphism
    glassInput: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        color: Colors.text,
        fontSize: 16,
        fontFamily: 'InterRegular',
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 20,
    },

    // Nouveaux styles pour l'encart d'information
    infoBlock: {
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.15)',
        marginBottom: 24,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    infoTitle: {
        color: Colors.primary,
        fontSize: 12,
        fontFamily: 'PoppinsBold',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    infoDesc: {
        color: Colors.textMuted,
        fontSize: 13,
        fontFamily: 'InterRegular',
        lineHeight: 20,
    },
    highlight: {
        color: Colors.text,
        fontFamily: 'PoppinsSemiBold',
    },

    optionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 12 },
    optionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    optionText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', marginLeft: 8, fontSize: 13 },
    optionUrgentActive: { borderColor: Colors.error, backgroundColor: 'rgba(207, 102, 121, 0.1)' },
    optionImportantActive: { borderColor: Colors.primary, backgroundColor: 'rgba(212, 175, 55, 0.1)' }
});