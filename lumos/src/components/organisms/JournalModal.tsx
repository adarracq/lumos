// src/components/organisms/JournalModal.tsx
import { useJournalStore } from '@/src/store/useJournalStore';
import { BookOpen } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { LumosButton } from '../atoms/LumosButton';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface JournalModalProps {
    isVisible: boolean;
    title: string;
    instruction: string;
    onClose: () => void;
    onComplete: () => void;
}

export const JournalModal = ({ isVisible, title, instruction, onClose, onComplete }: JournalModalProps) => {
    const { addEntry } = useJournalStore();
    const [text, setText] = useState("");

    const handleSave = () => {
        if (text.trim().length > 10) {
            addEntry({
                date: new Date().toISOString(),
                title: title,
                content: text.trim(),
            });
            onComplete();
            setText('');
            onClose();
        }
    };

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Journal du Soir"
        >

            <View style={styles.instructionBox}>
                <View style={styles.iconBg}>
                    <BookOpen color={Colors.primary} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.instruction}>{instruction}</Text>
                </View>
            </View>

            <TextInput
                style={styles.glassInput}
                placeholder="Écris ici..."
                placeholderTextColor={Colors.textMuted}
                value={text}
                onChangeText={setText}
                multiline
                autoFocus
                textAlignVertical="top"
                selectionColor={Colors.primary}
            />

            <LumosButton
                title="Terminer & Sauvegarder"
                onPress={handleSave}
                disabled={text.trim().length <= 10}
            />
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        paddingBottom: 40,
        height: '80%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

    // NOUVEAU: Glass Box pour les instructions
    instructionBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    iconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(212, 175, 55, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    title: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 14, marginBottom: 2 },
    instruction: { color: Colors.text, fontFamily: 'InterRegular', fontSize: 13, lineHeight: 20, opacity: 0.9 },

    // NOUVEAU: Text Input Glassmorphism
    glassInput: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        color: Colors.text,
        fontSize: 16,
        fontFamily: 'InterRegular',
        lineHeight: 24,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 24
    }
});