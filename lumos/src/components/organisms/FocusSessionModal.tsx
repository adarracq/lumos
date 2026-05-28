// src/components/organisms/FocusSessionModal.tsx
import { XP_REWARDS } from '@/src/constants/Rewards';
import { useUserStore } from '@/src/store/useUserStore';
import { useNetInfo } from '@react-native-community/netinfo';
import { Audio } from 'expo-av';
import { CloudRain, Coffee, Moon, Play, RefreshCw, Settings, Square, VolumeX, Waves, WifiOff, Wind, Zap } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { feedbackService } from '../../services/feedbackService';
import { grantXP } from '../../utils/rewardManager';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface FocusSessionModalProps {
    isVisible: boolean;
    onClose: () => void;
}

type SessionMode = 'WORK' | 'BREAK';

// --- CATALOGUE DES PAYSAGES SONORES ---
// ⚠️ N'oublie pas d'ajouter les fichiers mp3 dans ton dossier assets/sounds/
const SOUNDSCAPES = [
    { id: 'none', label: 'Silence', icon: VolumeX, file: null },
    { id: 'rain', label: 'Pluie', icon: CloudRain, file: require('../../../assets/sounds/rain.mp3') },
    { id: 'cafe', label: 'Café', icon: Coffee, file: require('../../../assets/sounds/cafe.mp3') },
    { id: 'birds', label: 'Oiseaux', icon: Moon, file: require('../../../assets/sounds/birds.mp3') },
    { id: 'brown', label: 'Bruit Brun', icon: Waves, file: require('../../../assets/sounds/brown-noise.mp3') },
    { id: 'wind', label: 'Vent', icon: Wind, file: require('../../../assets/sounds/wind.mp3') },
];

export const FocusSessionModal = ({ isVisible, onClose }: FocusSessionModalProps) => {
    const WORK_TIME = 55 * 60;
    const BREAK_TIME = 5 * 60;

    const [mode, setMode] = useState<SessionMode>('WORK');
    const [timeLeft, setTimeLeft] = useState(WORK_TIME);
    const [isActive, setIsActive] = useState(false);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    // État pour les sons
    const [selectedSound, setSelectedSound] = useState<string>('none');
    const bgSoundRef = useRef<Audio.Sound | null>(null);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const netInfo = useNetInfo();
    const isOffline = netInfo.isConnected === false;

    // Feedback à l'ouverture si hors-ligne
    useEffect(() => {
        if (isOffline && isVisible) {
            feedbackService.success();
        }
    }, [isOffline, isVisible]);

    // Chrono
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

    // ----------------------------------------------------
    // GESTION DU MOTEUR AUDIO (Bruits Blancs)
    // ----------------------------------------------------
    useEffect(() => {
        let isMounted = true; // Pour éviter les fuites si on ferme la modale pendant le chargement

        const loadAndPlaySound = async () => {
            // 1. Déchargement propre et sécurisé de l'ancien son
            if (bgSoundRef.current) {
                const soundToUnload = bgSoundRef.current;
                bgSoundRef.current = null; // On le vide tout de suite pour éviter les conflits
                try {
                    const status = await soundToUnload.getStatusAsync();
                    if (status.isLoaded) {
                        await soundToUnload.stopAsync();
                        await soundToUnload.unloadAsync();
                    }
                } catch (e) {
                    console.log("Erreur lors de l'arrêt de l'ancien son", e);
                }
            }

            if (selectedSound === 'none' || !isMounted) return;

            // 2. Chargement du nouveau son
            const soundscape = SOUNDSCAPES.find(s => s.id === selectedSound);
            if (soundscape && soundscape.file) {
                try {
                    const { sound } = await Audio.Sound.createAsync(soundscape.file, { isLooping: true });

                    if (isMounted) {
                        bgSoundRef.current = sound;
                        if (isActive) {
                            await sound.playAsync();
                        }
                    } else {
                        // Si l'utilisateur a fermé la modale pendant le temps de chargement
                        await sound.unloadAsync();
                    }
                } catch (e) {
                    console.log("Erreur chargement paysage sonore :", e);
                }
            }
        };

        loadAndPlaySound();

        // 3. Nettoyage quand on démonte le composant ou change de son
        return () => {
            isMounted = false;
            if (bgSoundRef.current) {
                const soundToUnload = bgSoundRef.current;
                bgSoundRef.current = null;

                // On laisse la promesse se résoudre en arrière-plan sans bloquer l'UI
                soundToUnload.getStatusAsync().then(status => {
                    if (status.isLoaded) {
                        soundToUnload.stopAsync()
                            .then(() => soundToUnload.unloadAsync())
                            .catch(() => { });
                    }
                }).catch(() => { });
            }
        };
    }, [selectedSound]); // Ne dépend plus de isActive ici

    // 4. Gère EXCLUSIVEMENT la Pause/Lecture quand on clique sur le bouton "Play/Stop"
    useEffect(() => {
        const handlePlayPause = async () => {
            if (bgSoundRef.current) {
                try {
                    const status = await bgSoundRef.current.getStatusAsync();
                    if (status.isLoaded) {
                        if (isActive) {
                            await bgSoundRef.current.playAsync();
                        } else {
                            await bgSoundRef.current.pauseAsync();
                        }
                    }
                } catch (e) {
                    console.log("Erreur play/pause :", e);
                }
            }
        };
        handlePlayPause();
    }, [isActive]);
    // ----------------------------------------------------

    const handleSessionEnd = () => {
        setIsActive(false);
        feedbackService.success(true);

        if (mode === 'WORK') {
            grantXP(XP_REWARDS.FOCUS_SESSION);
            trackToolUsage('focusSession');
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

    const handleSelectSound = (id: string) => {
        feedbackService.light();
        setSelectedSound(id);
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
            onClose={handleQuit}
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
                            <Text style={[styles.modeText, { color: '#4CAF50' }]}>PAUSE MÉRITÉE</Text>
                        </>
                    )}
                </View>

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
            </View>

            {/* --- NOUVEAU : SÉLECTEUR D'AMBIANCE SONORE --- */}
            <View style={styles.soundscapeContainer}>
                <Text style={styles.soundscapeTitle}>PAYSAGE SONORE</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.soundscapeList}>
                    {SOUNDSCAPES.map(sound => {
                        const isSelected = selectedSound === sound.id;
                        return (
                            <TouchableOpacity
                                key={sound.id}
                                style={[styles.soundBtn, isSelected && styles.soundBtnActive]}
                                onPress={() => handleSelectSound(sound.id)}
                                activeOpacity={0.7}
                            >
                                <sound.icon color={isSelected ? Colors.primary : Colors.textMuted} size={18} />
                                <Text style={[styles.soundText, isSelected && styles.soundTextActive]}>{sound.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* CONTROLES */}
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
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0C', paddingHorizontal: 24, paddingTop: 60, justifyContent: 'space-between', paddingBottom: 60 },

    centerSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    glassModeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', marginBottom: 20 },
    glassModeBadgeBreak: { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: 'rgba(76, 175, 80, 0.3)' },
    modeText: { color: Colors.primary, fontSize: 11, fontFamily: 'PoppinsBold', letterSpacing: 1 },

    timerDigits: { fontSize: 84, fontFamily: 'PoppinsBold', color: Colors.text, letterSpacing: -2, marginVertical: 10 },

    glassNetworkCard: { width: '100%', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 30, alignItems: 'center' },
    glassNetworkCardOnline: { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.05)' },
    glassNetworkCardOffline: { backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'rgba(212, 175, 55, 0.2)' },
    networkTitle: { fontSize: 14, fontFamily: 'PoppinsBold', color: Colors.text },
    networkDesc: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginTop: 8, fontFamily: 'InterRegular' },

    settingsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 16 },
    settingsBtnText: { color: Colors.text, fontSize: 12, fontFamily: 'PoppinsSemiBold' },

    // Nouveaux styles pour les paysages sonores
    soundscapeContainer: { width: '100%', marginTop: 20 },
    soundscapeTitle: { color: Colors.textMuted, fontSize: 10, fontFamily: 'PoppinsBold', letterSpacing: 1.5, marginBottom: 12, marginLeft: 5 },
    soundscapeList: { gap: 10, paddingRight: 20 },
    soundBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255, 255, 255, 0.03)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    soundBtnActive: { backgroundColor: 'rgba(212, 175, 55, 0.1)', borderColor: 'rgba(212, 175, 55, 0.3)' },
    soundText: { color: Colors.textMuted, fontSize: 12, fontFamily: 'PoppinsMedium' },
    soundTextActive: { color: Colors.primary, fontFamily: 'PoppinsBold' },

    controlsSection: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', marginTop: 30, marginBottom: 10 },
    controlMainBtn: { width: 76, height: 76, borderRadius: 38, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    controlMainBtnActive: { backgroundColor: Colors.text },

    glassControlSecondaryBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }
});