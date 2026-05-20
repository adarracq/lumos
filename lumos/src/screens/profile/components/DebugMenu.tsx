import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LumosButton } from '../../../components/atoms/LumosButton';
import { Colors } from '../../../constants/Colors';
import { useDailyStore } from '../../../store/useDailyStore';
import { useUserStore } from '../../../store/useUserStore';

export const DebugMenu = () => {
    const { onboardingDay, lumens, streak, streakFreezes } = useUserStore();
    const { dateKey, debugSimulateTimePassage } = useDailyStore();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🛠 MODE DÉVELOPPEUR</Text>

            <View style={styles.statBox}>
                <Text style={styles.text}>Jour Onboarding : {onboardingDay}</Text>
                <Text style={styles.text}>Streak actuel : 🔥 {streak}</Text>
                <Text style={styles.text}>Freezes dispos : ❄️ {streakFreezes}</Text>
                <Text style={styles.text}>Clé Date : {dateKey}</Text>
            </View>

            <View style={styles.row}>
                <LumosButton
                    title="Simuler Demain (+1j)"
                    style={styles.smallBtn}
                    onPress={() => debugSimulateTimePassage(1)}
                />
                <LumosButton
                    title="Manquer 1 jour (+2j)"
                    style={styles.smallBtn}
                    variant="outline"
                    onPress={() => debugSimulateTimePassage(2)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: Colors.surface, borderRadius: 16, marginTop: 20 },
    title: { color: Colors.primary, fontWeight: 'bold', marginBottom: 15 },
    statBox: { marginBottom: 15 },
    text: { color: '#FFF', fontSize: 14, marginBottom: 5 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    smallBtn: { width: '48%' }
});