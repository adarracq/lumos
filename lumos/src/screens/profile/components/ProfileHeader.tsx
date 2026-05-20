// src/screens/profile/Components/ProfileHeader.tsx
import { ChevronRight, Crown, Zap } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { getRank } from '../profile.constants';

interface ProfileHeaderProps {
    lumens: number;
    isPremium: boolean;
    onSubscriptionClick: () => void;
}

export const ProfileHeader = ({ lumens, isPremium, onSubscriptionClick }: ProfileHeaderProps) => {
    const rank = getRank(lumens);

    return (
        <View style={styles.glassHeader}>
            <View style={styles.headerTopRow}>
                <TouchableOpacity
                    style={[styles.subBadge, isPremium ? styles.subBadgePremium : styles.subBadgeFree]}
                    onPress={onSubscriptionClick}
                    activeOpacity={0.8}
                >
                    <Crown color={isPremium ? Colors.primary : Colors.textMuted} size={12} />
                    <Text style={[styles.subBadgeText, isPremium && { color: Colors.primary }]}>
                        {isPremium ? 'Lumos Premium' : 'Débloquer Premium'}
                    </Text>
                    <ChevronRight color={isPremium ? Colors.primary : Colors.textMuted} size={12} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.headerMainRow}>
                <View>
                    <Text style={styles.headerSubtitle}>ÉVOLUTION</Text>
                    <Text style={[styles.headerRankTitle, { color: rank.color }]}>{rank.title}</Text>
                </View>
                <View style={styles.lumensPill}>
                    <Zap color={Colors.primary} size={16} fill={Colors.primary} />
                    <Text style={styles.scoreText}>{lumens} <Text style={styles.xpLabel}>XP</Text></Text>
                </View>
            </View>

            {rank.nextMin && (
                <View style={styles.jaugeContainer}>
                    <View style={styles.jaugeBg}>
                        <View style={[styles.jaugeFill, { backgroundColor: rank.color, width: `${Math.min(100, Math.max(0, ((lumens - rank.currentMin) / (rank.nextMin - rank.currentMin)) * 100))}%` }]} />
                    </View>
                    <View style={styles.jaugeLabels}>
                        <Text style={styles.jaugeSubText}>{rank.currentMin} XP</Text>
                        <Text style={styles.jaugeSubText}>Objectif : {rank.nextMin} XP</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    glassHeader: {
        paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16,
        backgroundColor: 'rgba(20, 20, 20, 0.75)',
        borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)',
        zIndex: 10
    },
    headerTopRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
    subBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
    subBadgeFree: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.1)' },
    subBadgePremium: { backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.3)' },
    subBadgeText: { fontSize: 11, fontFamily: 'PoppinsBold', color: Colors.textMuted, letterSpacing: 0.5, marginTop: 1 },
    headerMainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
    headerSubtitle: { fontSize: 10, fontFamily: 'PoppinsBold', color: Colors.textMuted, letterSpacing: 2, marginBottom: 2 },
    headerRankTitle: { fontSize: 24, fontFamily: 'PoppinsBold', letterSpacing: 0.5 },
    lumensPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 6 },
    scoreText: { fontSize: 15, fontFamily: 'PoppinsBold', color: Colors.text },
    xpLabel: { fontSize: 11, color: Colors.textMuted, fontFamily: 'PoppinsSemiBold' },
    jaugeContainer: { width: '100%' },
    jaugeBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
    jaugeFill: { height: '100%', borderRadius: 2 },
    jaugeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    jaugeSubText: { color: Colors.textMuted, fontSize: 10, fontFamily: 'PoppinsSemiBold' },
});