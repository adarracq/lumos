// src/screens/tasks/TasksView.tsx (remplace le début de ton composant jusqu'au return)
import { feedbackService } from '@/src/services/feedbackService';
import { useAlertStore } from '@/src/store/useAlertStore';
import { CheckCircle2, ListTodo, Plus } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../src/constants/Colors';
import { useTaskStore } from '../../../src/store/useTaskStore';
import { BodyText, Subtitle, Title } from '../../components/atoms/Typography';
import { TaskItem } from './components/TaskItem';

export const TasksView = () => {
    const { tasks, toggleTask, deleteTask, setAddModalVisible } = useTaskStore();
    const { showAlert } = useAlertStore();

    // 💡 ALGORITHME DE TRI EISENHOWER
    const getTaskScore = (t: any) => {
        if (t.isUrgent && t.isImportant) return 4;
        if (t.isImportant) return 3; // L'important prévaut sur l'urgent
        if (t.isUrgent) return 2;
        return 1;
    };

    const activeTasks = tasks
        .filter(t => !t.isCompleted)
        .sort((a, b) => {
            const scoreDiff = getTaskScore(b) - getTaskScore(a);
            if (scoreDiff !== 0) return scoreDiff;
            // À score égal, on met la plus récente en premier
            return (b.createdAt || 0) - (a.createdAt || 0);
        });

    const completedTasks = tasks
        .filter(t => t.isCompleted)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    const handleLongPress = (id: string, title: string) => {
        showAlert(
            "Supprimer la tâche",
            `Es-tu sûr de vouloir effacer "${title}" ?`,
            [
                { text: "Annuler", style: "cancel" },
                { text: "Supprimer", style: "destructive", onPress: () => deleteTask(id) }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* HEADER PREMIUM */}
            <View style={styles.header}>
                <Title style={styles.mainTitle}>Tâches</Title>
                <BodyText style={styles.subtitle}>Décharge ton esprit. Reste focus.</BodyText>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 🔴 SECTION 1 : EN COURS */}
                <View style={styles.sectionHeader}>
                    <View style={[styles.iconBlurBg, { backgroundColor: 'rgba(212, 175, 55, 0.15)' }]}>
                        <ListTodo color={Colors.primary} size={18} />
                    </View>
                    <Subtitle style={styles.sectionTitle}>À faire ({activeTasks.length})</Subtitle>
                </View>

                {activeTasks.length === 0 ? (
                    <View style={styles.emptyGlassBox}>
                        <BodyText center color={Colors.textMuted} style={{ fontStyle: 'italic', fontSize: 13 }}>
                            Ton esprit est libre. Aucune tâche en cours.
                        </BodyText>
                    </View>
                ) : (
                    activeTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={() => toggleTask(task.id)}
                            onDelete={() => handleLongPress(task.id, task.title || 'Cette tâche')}
                        />
                    ))
                )}

                {/* 🟢 BOUTON D'AJOUT GLASSMORPHISM */}
                <TouchableOpacity style={styles.glassAddBtn} onPress={() => { setAddModalVisible(true); feedbackService.medium(); }} activeOpacity={0.8}>
                    <View style={styles.addIconBg}>
                        <Plus color={Colors.primary} size={20} />
                    </View>
                    <Text style={styles.addBtnText}>Nouvelle tâche</Text>
                </TouchableOpacity>

                {/* 🔵 SECTION 2 : TERMINÉES */}
                {completedTasks.length > 0 && (
                    <View style={styles.completedSection}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.iconBlurBg, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                                <CheckCircle2 color={Colors.textMuted} size={18} />
                            </View>
                            <Text style={styles.completedTitle}>Terminées ({completedTasks.length})</Text>
                        </View>

                        {completedTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={() => toggleTask(task.id)}
                                onDelete={() => handleLongPress(task.id, task.title || 'Cette tâche')}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

// ... GARDE TES STYLES ACTUELS DE TasksView ...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 20, paddingTop: 60 },
    header: { marginBottom: 24 },
    mainTitle: { fontSize: 32, letterSpacing: -0.5, marginBottom: 2 },
    subtitle: { color: Colors.textMuted, fontSize: 14, letterSpacing: 0.5 },
    scrollContent: { paddingBottom: 120 },

    // En-têtes de sections
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    iconBlurBg: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    sectionTitle: { fontSize: 18, fontFamily: 'PoppinsBold', marginBottom: 0 },

    // Empty state Glass
    emptyGlassBox: { backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 20, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },

    // Nouveau Bouton Ajouter
    glassAddBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    addIconBg: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(212, 175, 55, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    addBtnText: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 15 },

    // Section Terminées
    completedSection: { marginTop: 30, opacity: 0.7 },
    completedTitle: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 15 },
});