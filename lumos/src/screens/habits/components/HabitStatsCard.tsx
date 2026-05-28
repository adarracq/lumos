// src/screens/habits/components/HabitStatsCard.tsx
import { Colors } from '@/src/constants/Colors';
import { Award, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface HabitStatsCardProps {
    completionRate: number;
    completedCount: number;
    totalCount: number;
}

export const HabitStatsCard = ({ completionRate, completedCount, totalCount }: HabitStatsCardProps) => {
    if (totalCount === 0) return null;

    return (
        <View style={styles.glassStatsCard}>
            <View style={styles.statItem}>
                <View style={[styles.iconBlurBg, { backgroundColor: 'rgba(212, 175, 55, 0.12)' }]}>
                    <TrendingUp color={Colors.primary} size={16} />
                </View>
                <View>
                    <Text style={styles.statValue}>{completionRate}%</Text>
                    <Text style={styles.statLabel}>Complétion</Text>
                </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
                <View style={[styles.iconBlurBg, { backgroundColor: 'rgba(76, 175, 80, 0.12)' }]}>
                    <Award color="#4CAF50" size={16} />
                </View>
                <View>
                    <Text style={styles.statValue}>{completedCount} / {totalCount}</Text>
                    <Text style={styles.statLabel}>Ancrées</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    glassStatsCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center' },
    iconBlurBg: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    statValue: { fontSize: 18, fontFamily: 'PoppinsBold', color: Colors.text, lineHeight: 22 },
    statLabel: { fontSize: 10, color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
    statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255, 255, 255, 0.08)' },
});