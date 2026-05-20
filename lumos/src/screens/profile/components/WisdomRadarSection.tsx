// src/screens/profile/Components/WisdomRadarSection.tsx
import { Lock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { RadarChart } from './RadarChart';

interface WisdomRadarSectionProps {
    isPremium: boolean;
    radarData: any[];
    onUnlockPress: () => void;
}

export const WisdomRadarSection = ({ isPremium, radarData, onUnlockPress }: WisdomRadarSectionProps) => {
    return (
        <View style={[styles.glassCard, { alignItems: 'center' }]}>
            {isPremium ? (
                <>
                    <Text style={[styles.sectionTitle, { alignSelf: 'flex-start', marginTop: 0, marginLeft: 0, marginBottom: 20 }]}>Radar de Sagesse</Text>
                    <RadarChart data={radarData} size={260} />
                </>
            ) : (
                <View style={styles.paywallContainer}>
                    <View style={styles.iconBg}>
                        <Lock color={Colors.primary} size={28} />
                    </View>
                    <Text style={styles.paywallTitle}>Radar de Sagesse</Text>
                    <Text style={styles.paywallDesc}>Réservé à Lumos Premium</Text>
                    <TouchableOpacity onPress={onUnlockPress} style={styles.unlockBtn}>
                        <Text style={styles.unlockBtnText}>Débloquer</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    glassCard: {
        backgroundColor: 'rgba(30, 30, 30, 0.5)', borderRadius: 24, padding: 20,
        borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', marginBottom: 20,
    },
    sectionTitle: { fontSize: 13, fontFamily: 'PoppinsBold', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5 },
    paywallContainer: { alignItems: 'center', padding: 30, opacity: 0.8 },
    iconBg: { backgroundColor: 'rgba(212, 175, 55, 0.1)', width: 60, height: 60, borderRadius: 30, marginBottom: 15, alignItems: 'center', justifyContent: 'center' },
    paywallTitle: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 16, textAlign: 'center' },
    paywallDesc: { color: Colors.textMuted, textAlign: 'center', marginTop: 5, fontSize: 13 },
    unlockBtn: { marginTop: 15, backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' },
    unlockBtnText: { color: Colors.primary, fontFamily: 'PoppinsSemiBold', fontSize: 13 }
});