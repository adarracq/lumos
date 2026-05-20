// src/screens/profile/Components/ProfileStats.tsx
import { Award, CheckCircle2, Flame, Target } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/Colors';

interface ProfileStatsProps {
    streak: number;
    onboardingDay: number;
    completedTasksCount: number;
    completedHabitsCount: number;
}

export const ProfileStats = ({ streak, onboardingDay, completedTasksCount, completedHabitsCount }: ProfileStatsProps) => {
    return (
        <View style={styles.statsGrid}>
            <View style={styles.glassStatSquare}>
                <Flame color={Colors.error} size={22} opacity={0.9} style={{ marginBottom: 6 }} />
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statDesc}>Série jours</Text>
            </View>
            <View style={styles.glassStatSquare}>
                <Target color={Colors.primary} size={22} opacity={0.9} style={{ marginBottom: 6 }} />
                <Text style={styles.statValue}>{onboardingDay}</Text>
                <Text style={styles.statDesc}>Jours Lumos</Text>
            </View>
            <View style={styles.glassStatSquare}>
                <CheckCircle2 color="#4CAF50" size={22} opacity={0.9} style={{ marginBottom: 6 }} />
                <Text style={styles.statValue}>{completedTasksCount}</Text>
                <Text style={styles.statDesc}>Tâches</Text>
            </View>
            <View style={styles.glassStatSquare}>
                <Award color="#2196F3" size={22} opacity={0.9} style={{ marginBottom: 6 }} />
                <Text style={styles.statValue}>{completedHabitsCount}</Text>
                <Text style={styles.statDesc}>Habitudes</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 24 },
    glassStatSquare: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)', paddingVertical: 16, paddingHorizontal: 10,
        borderRadius: 20, width: '48%', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    statValue: { color: Colors.text, fontSize: 22, fontFamily: 'PoppinsBold' },
    statDesc: { color: Colors.textMuted, fontSize: 11, fontFamily: 'PoppinsSemiBold', marginTop: 1, textAlign: 'center' },
});