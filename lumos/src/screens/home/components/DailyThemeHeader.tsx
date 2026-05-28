// src/screens/home/components/DailyThemeHeader.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { Colors } from '@/src/constants/Colors';
import { ThemeDef } from '@/src/constants/Themes';
import { feedbackService } from '@/src/services/feedbackService';
import { useDailyStore } from '@/src/store/useDailyStore';
import { ChevronRight, Compass, Quote } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface DailyThemeHeaderProps {
    theme: ThemeDef;
}

export const DailyThemeHeader = ({ theme }: DailyThemeHeaderProps) => {
    // 1. OPTIMISATION : On écoute uniquement les états précis pour éviter des re-rendus inutiles
    const mantraDiscovered = useDailyStore(state => state.mantraDiscovered);
    const discoverMantra = useDailyStore(state => state.discoverMantra);

    const [isModalVisible, setModalVisible] = useState(false);


    const openThemeDetails = () => {
        feedbackService.medium();

        if (!mantraDiscovered) {
            discoverMantra();
        }

        // 2. SÉCURITÉ : On décale l'ouverture de la modale de quelques millisecondes 
        // pour que la vue native ait fini de traiter le clic avant de dessiner la modale
        setTimeout(() => {
            setModalVisible(true);
        }, 10);
    };

    return (
        <>
            <Pressable
                style={({ pressed }) => [
                    styles.widgetContainer,
                    !mantraDiscovered && styles.widgetContainerUnread,
                    pressed && { opacity: 0.8 }
                ]}
                onPress={openThemeDetails}
            >
                {/* Icône de fond isolée */}
                <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                    <Quote color="rgba(212, 175, 55, 0.04)" size={80} style={styles.bgIcon} />
                </View>

                <View style={styles.widgetContent}>
                    <View style={styles.leftRow}>
                        <View style={[styles.iconBg, !mantraDiscovered && styles.iconBgUnread]}>
                            <Compass color={!mantraDiscovered ? Colors.primary : Colors.textMuted} size={18} />
                        </View>

                        <View style={styles.textContainer}>
                            {/* 3. TECHNIQUE ANTI-CRASH : On ne détruit PLUS la vue. 
                                On rend les deux vues, et on cache celle qu'on ne veut pas avec display: 'none'. 
                                Cela empêche le moteur natif de paniquer. */}
                            <View style={[styles.textWrapper, !mantraDiscovered && { display: 'none' }]}>
                                <Text style={styles.badgeLabel}>MANTRA DU JOUR</Text>
                                <Text style={styles.mantraTextSmall}>
                                    « {theme.mantra || 'Je choisis la conscience et la clarté.'} »
                                </Text>
                            </View>

                            <View style={[styles.discoverPlaceholder, mantraDiscovered && { display: 'none' }]}>
                                <Text style={styles.discoverText}>Révéler ton alignement du jour...</Text>
                                <View style={styles.pulseDot} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.actionIndicator}>
                        <ChevronRight color={!mantraDiscovered ? Colors.primary : Colors.textMuted} size={18} />
                    </View>
                </View>
            </Pressable>

            {/* MODALE D'IMMERSION */}
            <BaseBottomSheetModal
                isVisible={isModalVisible}
                onClose={() => {
                    setModalVisible(false);
                }}
                title={`Alignement du Jour`}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeaderIcon}>
                        <Compass color={Colors.primary} size={40} />
                    </View>
                    <Title center style={{ marginBottom: 24 }}>{theme.name}</Title>

                    <View style={styles.modalMantraBox}>
                        <Quote color={Colors.primary} size={24} style={{ marginBottom: 10, opacity: 0.5 }} />
                        <Text style={styles.modalMantraText}>
                            "{theme.mantra || 'Je choisis la conscience et la clarté.'}"
                        </Text>
                        <Text style={styles.modalMantraSub}>À réciter 5 fois pour s'en imprégner</Text>
                    </View>

                    <View style={styles.detailSection}>
                        <Text style={styles.sectionOverline}>LA PHILOSOPHIE</Text>
                        <BodyText style={styles.detailText}>
                            {theme.description || 'Imprégnez-vous de cette philosophie tout au long de votre journée. Prenez du recul sur vos actions et agissez en conscience.'}
                        </BodyText>
                    </View>

                    {theme.ruleLabel && (
                        <View style={[styles.detailSection, styles.ruleSection]}>
                            <Text style={[styles.sectionOverline, { color: Colors.primary }]}>RÈGLE D'OR</Text>
                            <Text style={styles.ruleText}>{theme.ruleLabel}</Text>
                        </View>
                    )}

                    <LumosButton
                        title="J'ai compris"
                        onPress={() => {
                            feedbackService.light();
                            setModalVisible(false);
                        }}
                        style={{ marginTop: 10 }}
                    />
                </View>
            </BaseBottomSheetModal>
        </>
    );
};

const styles = StyleSheet.create({
    widgetContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
        borderColor: 'rgba(255, 255, 255, 0.04)',
        position: 'relative',
        overflow: 'hidden',
    },
    widgetContainerUnread: {
        backgroundColor: 'rgba(212, 175, 55, 0.03)',
        borderLeftColor: Colors.primary,
        borderColor: 'rgba(212, 175, 55, 0.1)',
    },
    bgIcon: {
        position: 'absolute',
        bottom: -15,
        right: -10,
        transform: [{ rotate: '10deg' }],
        zIndex: 0,
    },
    widgetContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 14,
        zIndex: 1,
    },
    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12
    },
    iconBg: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBgUnread: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 45, // On garde une hauteur fixe de sécurité
    },
    textWrapper: {
        paddingVertical: 2,
    },
    badgeLabel: {
        fontSize: 10,
        fontFamily: 'PoppinsBold',
        color: Colors.primary,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    mantraTextSmall: {
        fontSize: 13,
        fontFamily: 'PoppinsMedium',
        color: Colors.text,
        lineHeight: 20,
    },
    discoverPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    discoverText: {
        fontSize: 14,
        fontFamily: 'PoppinsSemiBold',
        color: Colors.primary,
    },
    pulseDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
        marginLeft: 6,
        marginTop: 2,
    },
    actionIndicator: {
        paddingLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: { paddingTop: 10, paddingBottom: 20 },
    modalHeaderIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(212, 175, 55, 0.05)', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)' },
    modalMantraBox: { alignItems: 'center', marginBottom: 28, paddingHorizontal: 10 },
    modalMantraText: { color: Colors.text, fontSize: 20, fontFamily: 'PoppinsBold', fontStyle: 'italic', textAlign: 'center', lineHeight: 28, marginBottom: 8 },
    modalMantraSub: { color: Colors.textMuted, fontSize: 12, fontFamily: 'InterRegular' },
    detailSection: { marginBottom: 24 },
    sectionOverline: { color: Colors.textMuted, fontSize: 11, fontFamily: 'PoppinsBold', letterSpacing: 1.5, marginBottom: 8 },
    detailText: { color: Colors.text, fontSize: 14, lineHeight: 22 },
    ruleSection: { backgroundColor: 'rgba(212, 175, 55, 0.05)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.15)' },
    ruleText: { color: Colors.text, fontSize: 16, fontFamily: 'PoppinsMedium', lineHeight: 24 },
});