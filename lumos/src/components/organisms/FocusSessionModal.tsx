import { XP_REWARDS } from '@/src/constants/Rewards';
import { useNetInfo } from '@react-native-community/netinfo';
import { Coffee, Moon, Play, RefreshCw, Settings, Square, WifiOff, Zap } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { feedbackService } from '../../services/feedbackService';
import { grantXP } from '../../utils/rewardManager';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface FocusSessionModalProps {
    isVisible: boolean;
    onClose: () => void;
}

type SessionMode = 'WORK' | 'BREAK';

export const FocusSessionModal = ({ isVisible, onClose }: FocusSessionModalProps) => {
    const WORK_TIME = 55 * 60;
    const BREAK_TIME = 5 * 60;

    const [mode, setMode] = useState<SessionMode>('WORK');
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isActive, setIsActive] = useState(false);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const netInfo = useNetInfo();
    const isOffline = netInfo.isConnected === false;

    useEffect(() => {
        if (isOffline && isVisible) {
            feedbackService.success();
        }
    }, [isOffline, isVisible]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleSessionEnd();
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const handleSessionEnd = () => {
        setIsActive(false);
        feedbackService.success();

        if (mode === 'WORK') {
            grantXP(XP_REWARDS.FOCUS_SESSION);
            setMode('BREAK');
            setTimeLeft(BREAK_TIME);
        } else {
            setMode('WORK');
            setTimeLeft(WORK_TIME);
        }
    };

    const toggleStartStop = () => {
        feedbackService.medium();
        setIsActive(!isActive);
    };

    const handleReset = () => {
        feedbackService.light();
        setIsActive(false);
        setMode('WORK');
        setTimeLeft(WORK_TIME);
    };

    const handleQuit = () => {
        feedbackService.medium();
        setIsActive(false);
        onClose();
    };

    const openSystemSettings = () => {
        feedbackService.light();
        if (Platform.OS === 'ios') {
            Linking.openURL('App-Prefs:root');
        } else {
            Linking.sendIntent('android.settings.AIRPLANE_MODE_SETTINGS');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Session de Travail"
        >

            <View style={styles.centerSection}>

                <View style={[styles.glassModeBadge, mode === 'BREAK' && styles.glassModeBadgeBreak]}>
                    {mode === 'WORK' ? (
                        <>
                            <Zap color={Colors.primary} size={14} fill={Colors.primary} />
                            <Text style={styles.modeText}>HYPER FOCUS</Text>
                        </>
                    ) : (
                        <>
                            <Coffee color="#4CAF50" size={14} />
                            < Text style={[styles.modeText, { color: '#4CAF50' }]} > PAUSE MÉRITÉE</Text >
                        </>
                    )}
                </View >

                <Text style={[styles.timerDigits, mode === 'BREAK' && { color: '#4CAF50' }]}>
                    {formatTime(timeLeft)}
                </Text>

                <View style={[styles.glassNetworkCard, isOffline ? styles.glassNetworkCardOffline : styles.glassNetworkCardOnline]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {isOffline ? (
                            <Moon color={Colors.primary} size={20} fill={Colors.primary} />
                        ) : (
                            <WifiOff color={Colors.textMuted} size={20} />
                        )}
                        <Text style={[styles.networkTitle, isOffline && { color: Colors.primary }]}>
                            {isOffline ? "Mode Hors-Ligne Confirmé" : "Connexion Active Détectée"}
                        </Text>
                    </View>

                    <Text style={styles.networkDesc}>
                        {isOffline
                            ? "Parfait. Rien ne peut t'atteindre. Lance ton chrono."
                            : "Pour une session d'hyper-concentration, ouvre ton centre de contrôle et active le Mode Avion."}
                    </Text>

                    {!isOffline && (
                        <TouchableOpacity style={styles.settingsBtn} onPress={openSystemSettings}>
                            <Settings color={Colors.text} size={14} />
                            <Text style={styles.settingsBtnText}>Ouvrir les Réglages</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View >

            <View style={styles.controlsSection}>
                <TouchableOpacity style={styles.glassControlSecondaryBtn} onPress={handleReset}>
                    <RefreshCw color={Colors.textMuted} size={22} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlMainBtn, isActive && styles.controlMainBtnActive, mode === 'BREAK' && { backgroundColor: '#4CAF50' }]}
                    onPress={toggleStartStop}
                    activeOpacity={0.8}
                >
                    {isActive ? (
                        <Square color={Colors.background} size={24} fill={Colors.background} />
                    ) : (
                        <Play color={Colors.background} size={24} fill={Colors.background} style={{ marginLeft: 4 }} />
                    )}
                </TouchableOpacity>

                <View style={[styles.glassControlSecondaryBtn, { opacity: 0 }]} />
            </View>
        </BaseBottomSheetModal >
    );
};

const styles = StyleSheet.create({
    // On assombrit un poil le background pour le focus absolu
    container: { flex: 1, backgroundColor: '#0A0A0C', paddingHorizontal: 24, paddingTop: 60, justifyContent: 'space-between', paddingBottom: 60 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backBtn: { padding: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, marginLeft: -8 },
    headerTitle: { fontSize: 18, marginLeft: 12, fontFamily: 'PoppinsBold' },

    centerSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Glass Mode Badge
    glassModeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', marginBottom: 20 },
    glassModeBadgeBreak: { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: 'rgba(76, 175, 80, 0.3)' },
    modeText: { color: Colors.primary, fontSize: 11, fontFamily: 'PoppinsBold', letterSpacing: 1 },

    timerDigits: { fontSize: 84, fontFamily: 'PoppinsBold', color: Colors.text, letterSpacing: -2, marginVertical: 10 },

    // Glass Network Card
    glassNetworkCard: { width: '100%', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 30, alignItems: 'center' },
    glassNetworkCardOnline: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.05)' },
    glassNetworkCardOffline: { backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'rgba(212, 175, 55, 0.2)' },
    networkTitle: { fontSize: 14, fontFamily: 'PoppinsBold', color: Colors.text },
    networkDesc: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginTop: 8, fontFamily: 'InterRegular' },

    settingsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 16 },
    settingsBtnText: { color: Colors.text, fontSize: 12, fontFamily: 'PoppinsSemiBold' },

    controlsSection: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', marginTop: 40 },
    controlMainBtn: { width: 76, height: 76, borderRadius: 38, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    controlMainBtnActive: { backgroundColor: Colors.text },

    // Glass Secondary Button
    glassControlSecondaryBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }
});