// src/screens/home/components/StreakModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BodyText, Subtitle, Title } from '@/src/components/atoms/Typography';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { Colors } from '@/src/constants/Colors';
import { useDailyStore } from '@/src/store/useDailyStore';
import { useUserStore } from '@/src/store/useUserStore';
import { grantXP } from '@/src/utils/rewardManager';
import { Flame, RefreshCw, ShieldCheck, Snowflake, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const StreakModal = () => {
    const { isStreakModalVisible, dailyGreetingStatus, closeStreakModal } = useDailyStore();
    const streak = useUserStore((state) => state.streak);

    // Sécurité pour ne pas accorder l'XP plusieurs fois en cas de double clic
    const [hasGrantedXP, setHasGrantedXP] = useState(false);

    if (!isStreakModalVisible || !dailyGreetingStatus) return null;

    // 💡 CALCUL DU BONUS DE CONSTANCE (ex: 2 XP par jour, max 30 XP)
    const streakBonus = Math.min(streak * 2, 30);

    let content = { tag: '', title: '', subtitle: '', Icon: Flame, iconColor: Colors.primary, isSuccess: false };

    switch (dailyGreetingStatus) {
        case 'INCREASED':
            content = {
                tag: 'CONSTANCE',
                title: `Jour ${streak}`,
                subtitle: "Votre discipline forge votre réalité. Prêt pour aujourd'hui ?",
                Icon: Flame,
                iconColor: Colors.primary, // Or Lumos
                isSuccess: true // Donne droit au bonus
            };
            break;
        case 'FREEZE_EARNED':
            content = {
                tag: 'ACCOMPLISSEMENT',
                title: "Cycle Parfait",
                subtitle: "6 jours d'affilée. Vous avez acquis un jour de repos (Freeze) en récompense.",
                Icon: Snowflake,
                iconColor: '#A0D2EB', // Bleu glacier doux
                isSuccess: true
            };
            break;
        case 'FROZEN':
            content = {
                tag: 'PROTECTION',
                title: "Série Maintenue",
                subtitle: "Votre jour de repos s'est activé en votre absence. Votre progression reste intacte.",
                Icon: ShieldCheck,
                iconColor: '#A0D2EB',
                isSuccess: false
            };
            break;
        case 'LOST':
            content = {
                tag: 'RENOUVEAU',
                title: "Nouveau Cycle",
                subtitle: "La fin d'une série n'est que le début d'une autre. Reprenons le contrôle. Jour 1.",
                Icon: RefreshCw,
                iconColor: Colors.textMuted, // Gris neutre
                isSuccess: false
            };
            break;
    }

    const { Icon, iconColor, isSuccess } = content;

    const handleContinue = () => {
        // On accorde l'XP uniquement si on est sur un jour de réussite et qu'on ne l'a pas déjà donné
        if (isSuccess && !hasGrantedXP) {
            grantXP(streakBonus);
            setHasGrantedXP(true);
        }
        closeStreakModal();
    };

    return (
        <BaseBottomSheetModal
            isVisible={true}
            onClose={handleContinue}
            title=""
        >
            <View style={styles.iconContainer}>
                <Icon size={56} color={iconColor} strokeWidth={1.5} />
            </View>

            <Subtitle color={Colors.primary} center style={styles.tag}>
                {content.tag}
            </Subtitle>

            <Title color={Colors.text} center style={styles.title}>
                {content.title}
            </Title>
            {isSuccess && (
                <View style={styles.bonusBadge}>
                    <Zap size={16} color={Colors.primary} fill={Colors.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.bonusText}>+{streakBonus} XP de constance</Text>
                </View>
            )}

            <BodyText color={Colors.textMuted} center style={styles.subtitle}>
                {content.subtitle}
            </BodyText>

            <LumosButton
                title="Continuer"
                onPress={handleContinue}
                style={styles.button}
            />
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    tag: {
        marginBottom: 12,
        fontSize: 14,
    },
    title: {
        marginBottom: 16,
    },
    subtitle: {
        marginBottom: 32,
    },

    // 💡 STYLES DU BONUS
    bonusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.15)', // Fond doré translucide
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 32,
    },
    bonusText: {
        color: Colors.primary,
        fontFamily: 'PoppinsBold',
        fontSize: 14,
        height: 18,
    },

    button: {
        width: '100%',
    }
});