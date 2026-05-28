// src/components/organisms/FutureSelfModal.tsx
import { feedbackService } from '@/src/services/feedbackService';
import { grantXP } from '@/src/utils/rewardManager';
import { addMonths, format } from 'date-fns';
import { Calendar, Lock, Mail } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { XP_REWARDS } from '../../constants/Rewards';
import { useFutureSelfStore } from '../../store/useFutureSelfStore';
import { useUserStore } from '../../store/useUserStore';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface FutureSelfModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const THEME_COLOR = '#3F51B5'; // Indigo philosophique

export const FutureSelfModal = ({ isVisible, onClose }: FutureSelfModalProps) => {
    const addLetter = useFutureSelfStore(state => state.addLetter);
    const trackToolUsage = useUserStore(state => state.trackToolUsage);

    const [gameState, setGameState] = useState<'intro' | 'writing' | 'duration' | 'sealing' | 'result'>('intro');
    const [text, setText] = useState('');
    const [selectedMonths, setSelectedMonths] = useState<number>(12); // 1 an par défaut

    // Animation de scellage
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            setGameState('intro');
            setText('');
            setSelectedMonths(12);
            scaleAnim.setValue(1);
            rotateAnim.setValue(0);
        }
    }, [isVisible]);

    const handleSealLetter = () => {
        setGameState('sealing');
        feedbackService.heavy();

        // Animation : la lettre tourne et rétrécit (comme si elle s'enfermait)
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Sauvegarde dans le store
            addLetter(text, selectedMonths);
            grantXP(XP_REWARDS.FUTURE_LETTER); // Belle récompense pour l'introspection
            setGameState('result');
            trackToolUsage('futureSelf');
        });
    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Calcul de la date estimée d'ouverture pour rassurer l'utilisateur
    const targetDateDisplay = format(addMonths(new Date(), selectedMonths), 'dd/MM/yyyy');

    if (!isVisible) return null;

    return (
        <BaseBottomSheetModal isVisible={isVisible} onClose={onClose} title="Moi du Futur">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                {/* --- Etape 1 : INTRO --- */}
                {gameState === 'intro' && (
                    <View style={styles.centerContent}>
                        <View style={styles.readyIconWrapper}>
                            <Mail color={THEME_COLOR} size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Lettre au futur</Title>

                        <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 15, marginTop: 15 }}>
                            Écris une lettre à la personne que tu seras demain. {'\n\n'}
                            Dépose tes objectifs actuels, tes doutes, ou décris simplement ta vie aujourd'hui. Elle sera scellée dans ton coffre-fort et restera strictement invisible jusqu'au jour de l'échéance.
                        </BodyText>

                        <LumosButton title="Rédiger ma lettre" onPress={() => setGameState('writing')} color={THEME_COLOR} style={{ width: '100%' }} />
                    </View>
                )}

                {/* --- Etape 2 : ECRITURE --- */}
                {gameState === 'writing' && (
                    <View style={styles.contentBox}>
                        <Text style={styles.sectionTitle}>Cher Moi du futur,...</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Comment te sens-tu aujourd'hui ? Quels défis as-tu surmontés ? Quels sont tes espoirs ?"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            multiline
                            autoFocus
                            textAlignVertical="top"
                            value={text}
                            onChangeText={setText}
                        />
                        <LumosButton
                            title="Choisir la date de scellage"
                            onPress={() => { Keyboard.dismiss(); setGameState('duration'); }}
                            color={THEME_COLOR}
                            disabled={text.trim().length < 10}
                            style={{ marginTop: 15, opacity: text.trim().length < 10 ? 0.5 : 1 }}
                        />
                    </View>
                )}

                {/* --- Etape 3 : CHOIX DE LA DUREE --- */}
                {gameState === 'duration' && (
                    <View style={styles.centerContent}>
                        <Calendar color={THEME_COLOR} size={40} style={{ marginBottom: 15 }} />
                        <Text style={styles.sectionTitle}>Pendant combien de temps la sceller ?</Text>

                        <View style={styles.durationGrid}>
                            {[
                                { label: '1 Mois', value: 1 },
                                { label: '3 Mois', value: 3 },
                                { label: '6 Mois', value: 6 },
                                { label: '1 An', value: 12 },
                                { label: '3 Ans', value: 36 },
                                { label: '5 Ans', value: 60 }
                            ].map((item) => (
                                <TouchableOpacity
                                    key={item.value}
                                    style={[styles.durationCard, selectedMonths === item.value && styles.durationCardActive]}
                                    onPress={() => { setSelectedMonths(item.value); feedbackService.light(); }}
                                >
                                    <Text style={[styles.durationLabel, selectedMonths === item.value && styles.durationLabelActive]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.infoBadge}>
                            <Lock color={Colors.primary} size={14} style={{ marginRight: 6 }} />
                            <Text style={styles.infoBadgeText}>Ouverture prévue le : {targetDateDisplay}</Text>
                        </View>

                        <LumosButton title="Sceller ma lettre" onPress={handleSealLetter} color={Colors.primary} style={{ width: '100%', marginTop: 20 }} />
                    </View>
                )}

                {/* --- Etape 4 : SCELLAGE (ANIMATION) --- */}
                {gameState === 'sealing' && (
                    <View style={styles.centerContent}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }, { rotate: spin }] }}>
                            <Mail color={Colors.primary} size={80} />
                        </Animated.View>
                        <Text style={styles.sealingText}>Envoi en cours...</Text>
                    </View>
                )}

                {/* --- Etape 5 : RESULTAT --- */}
                {gameState === 'result' && (
                    <View style={styles.centerContent}>
                        <View style={[styles.readyIconWrapper, { borderColor: Colors.primary }]}>
                            <Lock color={Colors.primary} size={48} />
                        </View>
                        <Title center style={{ marginTop: 16 }}>Lettre verrouillée</Title>

                        <BodyText center color={Colors.textMuted} style={{ marginBottom: 30, paddingHorizontal: 10, marginTop: 15 }}>
                            Ta lettre a été envoyée avec succès à travers le temps. {'\n\n'}
                            Elle est maintenant en sécurité dans ton Coffre-fort (`archives`). L'application t'alertera le **{targetDateDisplay}** pour que tu puisses la lire.
                        </BodyText>

                        <LumosButton title="Terminer" onPress={onClose} color={THEME_COLOR} style={{ width: '100%' }} />
                    </View>
                )}
            </KeyboardAvoidingView>
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: { minHeight: 450, justifyContent: 'center' },
    centerContent: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingTop: 10 },

    readyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(63, 81, 181, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 2, borderColor: 'rgba(63, 81, 181, 0.3)' },

    contentBox: { flex: 1, paddingTop: 10 },
    sectionTitle: { color: Colors.text, fontSize: 18, fontFamily: 'PoppinsSemiBold', marginBottom: 15, textAlign: 'center' },

    textArea: {
        flex: 1,
        minHeight: 220,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        padding: 16,
        color: Colors.text,
        fontSize: 16,
        fontFamily: 'InterRegular',
        lineHeight: 24,
    },

    // Grille de durée
    durationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginVertical: 15 },
    durationCard: { width: '45%', backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
    durationCardActive: { backgroundColor: 'rgba(63, 81, 181, 0.15)', borderColor: THEME_COLOR },
    durationLabel: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 15 },
    durationLabelActive: { color: '#8C9EFF' },

    infoBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212, 175, 55, 0.08)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)' },
    infoBadgeText: { color: Colors.primary, fontSize: 13, fontFamily: 'PoppinsMedium' },

    sealingText: { color: Colors.textMuted, fontFamily: 'PoppinsMedium', fontSize: 14, marginTop: 20, letterSpacing: 0.5 }
});