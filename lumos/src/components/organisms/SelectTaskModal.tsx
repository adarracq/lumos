// src/components/organisms/SelectTaskModal.tsx
import { Plus, Target } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useDailyStore } from '../../store/useDailyStore';
import { useTaskStore } from '../../store/useTaskStore';
import { BodyText } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface SelectTaskModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export const SelectTaskModal = ({ isVisible, onClose }: SelectTaskModalProps) => {
    const { tasks, addTask } = useTaskStore();
    const { setMainTaskId } = useDailyStore();
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const activeTasks = tasks.filter(t => !t.isCompleted);

    const handleSelectTask = (taskId: string) => {
        setMainTaskId(taskId);
        onClose();
    };

    const handleCreateAndSelect = () => {
        if (newTaskTitle.trim().length > 0) {
            addTask(newTaskTitle.trim(), true, true);
            setTimeout(() => {
                const latestTask = useTaskStore.getState().tasks[0];
                setMainTaskId(latestTask.id);
                setNewTaskTitle('');
                onClose();
            }, 100);
        }
    };

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Objectif du jour"
        >

            {/* CRÉATION RAPIDE (GLASS) */}
            <View style={styles.createBox}>
                <TextInput
                    style={styles.glassInput}
                    placeholder="Créer une nouvelle priorité..."
                    placeholderTextColor={Colors.textMuted}
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                    selectionColor={Colors.primary}
                />
                <TouchableOpacity style={styles.addBtn} onPress={handleCreateAndSelect} activeOpacity={0.8}>
                    <Plus color={Colors.background} size={24} strokeWidth={3} />
                </TouchableOpacity>
            </View>

            <BodyText style={styles.sectionTitle}>Ou choisir une tâche en attente :</BodyText>

            {/* LISTE DES TÂCHES (GLASS) */}
            <FlatList
                data={activeTasks}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View style={styles.emptyGlassBox}>
                        <BodyText color={Colors.textMuted} center style={{ fontStyle: 'italic', fontSize: 13 }}>
                            Aucune tâche en attente.
                        </BodyText>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.glassTaskItem} onPress={() => handleSelectTask(item.id)} activeOpacity={0.8}>
                        <View style={styles.iconBg}>
                            <Target color={Colors.text} size={18} />
                        </View>
                        <Text style={styles.taskTitle} numberOfLines={1}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                style={{ maxHeight: 300 }}
                showsVerticalScrollIndicator={false}
            />
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

    // Zone de création
    createBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
    glassInput: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', color: Colors.text, fontSize: 15, fontFamily: 'InterRegular', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    addBtn: { backgroundColor: Colors.primary, width: 54, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },

    sectionTitle: { fontSize: 12, fontFamily: 'PoppinsBold', color: Colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },

    // Tâches
    glassTaskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 12, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    iconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.08)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    taskTitle: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsSemiBold', flex: 1 },

    emptyGlassBox: { backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: 20, borderRadius: 16, marginTop: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }
});