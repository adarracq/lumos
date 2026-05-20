import { Colors } from '@/src/constants/Colors';
import { Habit } from '@/src/models/Habit';
import { feedbackService } from '@/src/services/feedbackService';
import { getIcon } from '@/src/utils/getIcon';
import { format, parseISO, subDays } from 'date-fns';
import { Check, Play, Plus } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HabitItemProps {
    habit: Habit;
    currentValue: boolean | number;
    onToggle: () => void;
    onProgress: (amount: number) => void;
    onEdit: () => void; // 💡 On remplace onDelete par onEdit
    onStartTimer?: () => void;
    logs: Record<string, Record<string, boolean | number>>;
    logicalTodayKey: string;
}

export const HabitItem = ({ habit, currentValue, onToggle, onProgress, onEdit, onStartTimer, logs, logicalTodayKey }: HabitItemProps) => {
    let isCompleted = false;
    let displayValue = "";

    if (habit.type === 'UNIQUE') {
        isCompleted = !!currentValue;
    } else if (habit.targetValue) {
        const numValue = (currentValue as number) || 0;
        isCompleted = numValue >= habit.targetValue;
        displayValue = `${Math.floor(numValue)}/${habit.targetValue}${habit.type === 'TIME' ? 'm' : ''}`;
    }

    const habitThemeColor = habit.color || Colors.primary;
    const mainContentColor = isCompleted ? Colors.textMuted : Colors.text;
    const habitIconColor = isCompleted ? Colors.textMuted : habitThemeColor;

    const containerBorderColor = isCompleted ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.08)';
    const bgColor = isCompleted ? 'rgba(20, 20, 20, 0.4)' : 'rgba(30, 30, 30, 0.5)';

    // 💡 Nouveau LongPress
    const handleLongPress = () => {
        feedbackService.medium();
        onEdit();
    };

    const handlePress = () => {
        if (habit.type === 'UNIQUE') {
            if (!isCompleted) feedbackService.success();
            else feedbackService.light();
            onToggle();
        } else if (habit.type === 'QUANTITY') {
            if (!isCompleted) {
                const currentNum = (currentValue as number) || 0;
                if (habit.targetValue && currentNum + 1 >= habit.targetValue) feedbackService.success();
                else feedbackService.light();
            }
            onProgress(1);
        } else if (habit.type === 'TIME') {
            feedbackService.medium();
            if (onStartTimer && !isCompleted) onStartTimer();
        }
    };

    const renderMiniHistory = () => {
        const baseDate = parseISO(logicalTodayKey);
        const blocks = [];

        for (let i = 6; i >= 0; i--) {
            const targetDate = subDays(baseDate, i);
            const dateStr = format(targetDate, 'yyyy-MM-dd');
            const logValue = logs[dateStr]?.[habit.id];
            let opacity = 0.1;

            if (logValue) {
                if (habit.type === 'UNIQUE') {
                    opacity = logValue ? 1 : 0.1;
                } else if (habit.targetValue) {
                    const ratio = (logValue as number) / habit.targetValue;
                    if (ratio >= 1) opacity = 1;
                    else if (ratio >= 0.6) opacity = 0.65;
                    else if (ratio >= 0.3) opacity = 0.4;
                    else opacity = 0.25;
                }
            }

            const isDayToday = i === 0;

            blocks.push(
                <View
                    key={dateStr}
                    style={[
                        styles.historySquare,
                        {
                            backgroundColor: habitThemeColor,
                            opacity: opacity,
                            borderWidth: isDayToday ? 1 : 0,
                            borderColor: isDayToday ? 'rgba(255,255,255,0.8)' : 'transparent'
                        }
                    ]}
                />
            );
        }

        return <View style={styles.historyContainer}>{blocks}</View>;
    };

    return (
        <View style={[styles.glassCardContainer, { borderColor: containerBorderColor, backgroundColor: bgColor }]}>
            <TouchableOpacity style={styles.mainRow} onPress={handlePress} onLongPress={handleLongPress} activeOpacity={0.8}>

                <View style={styles.leftPart}>
                    <View style={[styles.iconWrapper, { backgroundColor: isCompleted ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)' }]}>
                        {getIcon(habit.icon, habitIconColor, 18)}
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={[styles.habitName, { color: mainContentColor }, isCompleted && styles.habitNameCompleted]} numberOfLines={1}>
                            {habit.name}
                        </Text>
                        {(habit.type === 'QUANTITY' || habit.type === 'TIME') && (
                            <Text style={styles.valueSubText}>{displayValue}</Text>
                        )}
                    </View>
                </View>

                <View style={styles.rightPart}>
                    {renderMiniHistory()}

                    <View style={[
                        styles.actionCircle,
                        isCompleted ? { backgroundColor: habitThemeColor, borderColor: habitThemeColor } : { borderColor: 'rgba(255,255,255,0.2)' }
                    ]}>
                        {isCompleted ? (
                            <Check color={Colors.background} size={14} strokeWidth={4} />
                        ) : habit.type === 'QUANTITY' ? (
                            <Plus color={habitThemeColor} size={18} />
                        ) : habit.type === 'TIME' ? (
                            <Play color={habitThemeColor} size={11} style={{ marginLeft: 2 }} fill={habitThemeColor} />
                        ) : null}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    glassCardContainer: {
        borderRadius: 20, // Plus arrondi
        marginBottom: 14,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 4,
        paddingVertical: 14,
        paddingHorizontal: 16
    },
    mainRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    leftPart: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },

    // L'icône a maintenant son propre petit fond en verre
    iconWrapper: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },

    habitName: { fontSize: 15, fontFamily: 'PoppinsSemiBold', letterSpacing: 0.3 },
    habitNameCompleted: { textDecorationLine: 'line-through', fontFamily: 'InterRegular', opacity: 0.6 },
    valueSubText: { color: Colors.textMuted, fontSize: 12, fontFamily: 'PoppinsSemiBold', marginTop: 0 },

    rightPart: { flexDirection: 'row', alignItems: 'center', gap: 16 },

    actionCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.02)'
    },

    historyContainer: { flexDirection: 'row', gap: 5, alignItems: 'center' },
    historySquare: { width: 14, height: 14, borderRadius: 4 }
});