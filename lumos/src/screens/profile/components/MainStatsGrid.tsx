// src/screens/profile/components/MainStatsGrid.tsx
import { Colors } from '@/src/constants/Colors';
import { BookOpen, CheckCircle2, Target } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MainStatsGridProps {
    tasksCount: number;
    habitsCount: number;
    journalCount: number;
    moodData: { label: string, icon: any, color: string };
}

export const MainStatsGrid = ({ tasksCount, habitsCount, journalCount, moodData }: MainStatsGridProps) => {

    const StatTile = ({ icon: Icon, value, label, color = Colors.primary }: any) => (
        <View style={styles.statTile}>
            <View style={[styles.tileIconBg, { backgroundColor: `${color}15` }]}>
                <Icon color={color} size={18} />
            </View>
            <View>
                <Text style={styles.tileValue}>{value}</Text>
                <Text style={styles.tileLabel}>{label}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.statsGrid}>
            <StatTile icon={Target} value={tasksCount} label="Tâches faites" color="#2196F3" />
            <StatTile icon={CheckCircle2} value={habitsCount} label="Habitudes ancrées" color="#4CAF50" />
            <StatTile icon={BookOpen} value={journalCount} label="Bilans rédigés" color="#9C27B0" />
            <StatTile icon={moodData.icon} value={moodData.label} label="Météo dominante" color={moodData.color} />
        </View>
    );
};

const styles = StyleSheet.create({
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    statTile: { width: '48%', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.03)', flexDirection: 'row', alignItems: 'center', gap: 12 },
    tileIconBg: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    tileValue: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsBold', lineHeight: 20 },
    tileLabel: { color: Colors.textMuted, fontSize: 10, fontFamily: 'PoppinsMedium' },
});