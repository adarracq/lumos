// src/components/molecules/TaskItem.tsx
import { Colors } from '@/src/constants/Colors';
import { Task } from '@/src/models/Task';
import { feedbackService } from '@/src/services/feedbackService';
import { Check, Flame, Star } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
    onDelete: () => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
    const isCompleted = task.isCompleted;

    const handleToggle = () => {
        if (!isCompleted) feedbackService.success();
        else feedbackService.light();
        onToggle();
    };

    const handleDelete = () => {
        feedbackService.medium();
        onDelete();
    };

    // 💡 ADN VISUEL EXACTEMENT COMME HABITITEM
    const containerBorderColor = isCompleted ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.08)';
    const bgColor = isCompleted ? 'rgba(20, 20, 20, 0.4)' : 'rgba(30, 30, 30, 0.5)';

    return (
        <TouchableOpacity
            style={[styles.glassCardContainer, { borderColor: containerBorderColor, backgroundColor: bgColor }]}
            onPress={handleToggle}
            onLongPress={handleDelete}
            activeOpacity={0.8}
        >
            {/* 1. Checkbox à gauche */}
            <View style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}>
                {isCompleted && <Check size={14} color={Colors.background} strokeWidth={4} />}
            </View>

            {/* 2. Titre de la tâche (1 ligne max) */}
            <View style={styles.content}>
                <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={1}>
                    {task.title}
                </Text>
            </View>

            {/* 3. Indicateurs discrets à droite (Si non complétée) */}
            {(!isCompleted && (task.isUrgent || task.isImportant)) && (
                <View style={styles.indicatorsRight}>
                    {task.isUrgent && <Flame color={Colors.error} size={18} />}
                    {task.isImportant && <Star color={Colors.primary} size={18} />}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    glassCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 8, // "Squircle" élégant
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        marginRight: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxCompleted: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary
    },
    content: {
        flex: 1,
        marginRight: 10
    },
    title: {
        fontSize: 15,
        fontFamily: 'PoppinsSemiBold',
        color: Colors.text,
        letterSpacing: 0.3
    },
    titleCompleted: {
        color: Colors.textMuted,
        textDecorationLine: 'line-through',
        opacity: 0.5,
        fontFamily: 'InterRegular'
    },
    // Icônes alignées à droite sans fond lourd
    indicatorsRight: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center'
    }
});