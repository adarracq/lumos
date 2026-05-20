// src/screens/profile/Components/MoodChart.tsx
import { format, parseISO, subDays } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { getLogicalTodayKey } from '../../../utils/dateUtils';

const MOOD_LEVELS: Record<string, { height: any, color: string }> = {
    RADIANT: { height: '100%', color: Colors.primary },
    PEACEFUL: { height: '70%', color: '#4CAF50' },
    NEUTRAL: { height: '40%', color: Colors.textMuted },
    EXHAUSTED: { height: '15%', color: '#CF6679' }
};

interface MoodChartProps {
    entries: any[];
}

export const MoodChart = ({ entries }: MoodChartProps) => {
    const todayKey = getLogicalTodayKey();
    const baseDate = parseISO(todayKey);

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(baseDate, 6 - i);
        return format(d, 'yyyy-MM-dd');
    });

    const getFrenchDayLabel = (dateStr: string) => {
        const d = parseISO(dateStr);
        const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        return days[d.getDay()];
    };

    const getDayMood = (dateStr: string) => {
        const entry = entries.find(e => e.date === dateStr && e.mood);
        return entry ? entry.mood : null;
    };

    return (
        <View style={styles.chartContainer}>
            {last7Days.map((dateStr) => {
                const mood = getDayMood(dateStr);
                const dayLabel = getFrenchDayLabel(dateStr);
                const levelData = mood ? MOOD_LEVELS[mood] : null;
                const isToday = dateStr === todayKey;

                return (
                    <View key={dateStr} style={styles.chartColumn}>
                        <View style={[styles.barBackground, isToday && { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                            {levelData && (
                                <View style={[styles.barFill, { height: levelData.height, backgroundColor: levelData.color }]} />
                            )}
                        </View>
                        <Text style={[
                            styles.chartDayLabel,
                            isToday && { color: Colors.primary, fontFamily: 'PoppinsBold' }
                        ]}>
                            {dayLabel}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    chartContainer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
        height: 120, paddingTop: 10, paddingBottom: 5, paddingHorizontal: 10
    },
    chartColumn: { alignItems: 'center', width: 32 },
    barBackground: {
        width: 14, height: 85, backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 8, justifyContent: 'flex-end', marginBottom: 10,
        overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    barFill: { width: '100%', borderRadius: 8 },
    chartDayLabel: { color: Colors.textMuted, fontSize: 11, fontFamily: 'PoppinsMedium' },
});