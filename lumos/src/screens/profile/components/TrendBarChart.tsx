// src/screens/profile/components/TrendBarChart.tsx
import { Colors } from '@/src/constants/Colors';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export interface ChartDataPoint {
    id: string;
    label: string;
    heightPercent: number;
    color: string;
    isToday: boolean;
    isEmpty: boolean;
}

export interface ChartStat {
    label: string;
    value: string | number;
    icon: any;
    color?: string;
}

interface TrendBarChartProps {
    title: string;
    subtitle: string;
    headerIcon: any;
    data: ChartDataPoint[];
    stats: ChartStat[];
}

export const TrendBarChart = ({ title, subtitle, headerIcon: HeaderIcon, data, stats }: TrendBarChartProps) => {
    // 💡 1. Référence pour forcer le scroll
    const scrollViewRef = useRef<ScrollView>(null);

    // 💡 2. Détecter si on a la place d'étaler les barres (ex: 7 jours)
    const isCompact = data.length <= 7;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconWrapper}>
                        <HeaderIcon color={Colors.primary} size={20} />
                    </View>
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.chartWrapper}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    // 💡 Dès que le contenu change de taille (ex: on passe de 7 à 30), on va à la fin !
                    onContentSizeChange={() => {
                        if (!isCompact) {
                            scrollViewRef.current?.scrollToEnd({ animated: false });
                        }
                    }}
                    contentContainerStyle={[
                        styles.chartScroll,
                        isCompact && styles.chartScrollCompact // 💡 On étale si compact
                    ]}
                >
                    {data.map((day) => {
                        const barHeight = day.heightPercent === 0 ? 0 : Math.max(10, day.heightPercent);
                        return (
                            <View key={day.id} style={styles.barColumn}>
                                <View style={styles.barBackground}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            { height: `${barHeight}%`, backgroundColor: day.color },
                                            day.isEmpty && { backgroundColor: 'transparent' }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.dayText, day.isToday && styles.dayTextToday]}>
                                    {day.label}
                                </Text>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.statsRow}>
                {stats.map((stat, index) => (
                    <View key={index} style={styles.statPill}>
                        <stat.icon color={stat.color || Colors.textMuted} size={18} />
                        <View style={styles.statValueContainer}>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                            <Text style={styles.statValue}>{stat.value}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
        marginBottom: 16,
    },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconWrapper: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(212, 175, 55, 0.08)', justifyContent: 'center', alignItems: 'center' },
    title: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsSemiBold', marginBottom: 2 },
    subtitle: { color: Colors.textMuted, fontSize: 12, fontFamily: 'InterRegular' },

    chartWrapper: { height: 110, marginBottom: 24 },

    // 💡 Base (30J) : collé à droite (flex-end) avec des espacements fixes (gap)
    chartScroll: { alignItems: 'flex-end', gap: 12, paddingHorizontal: 4 },
    // 💡 Compact (7J) : prend toute la place (flexGrow: 1) et répartit l'espace (space-between)
    chartScrollCompact: { flexGrow: 1, justifyContent: 'space-between', gap: 0, paddingHorizontal: 6 },

    barColumn: { alignItems: 'center', gap: 10, width: 28 },
    barBackground: { width: 14, height: 80, backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
    barFill: { width: '100%', borderRadius: 8 },
    dayText: { color: Colors.textMuted, fontSize: 11, fontFamily: 'InterMedium' },
    dayTextToday: { color: Colors.primary, fontFamily: 'PoppinsBold' },

    statsRow: { flexDirection: 'row', gap: 12 },
    statPill: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', gap: 12 },
    statValueContainer: { flex: 1 },
    statLabel: { color: Colors.textMuted, fontSize: 11, fontFamily: 'InterRegular', marginBottom: 2 },
    statValue: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsBold' },
});