// src/components/organisms/PaywallModal.tsx
import { feedbackService } from '@/src/services/feedbackService';
import { Crown, Lock, ShieldCheck, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useToastStore } from '../../store/useToastStore';
import { useUserStore } from '../../store/useUserStore';
import { LumosButton } from '../atoms/LumosButton';
import { BodyText, Title } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface PaywallModalProps {
    isVisible: boolean;
    onClose: () => void;
}

type PlanType = 'monthly' | 'yearly' | 'lifetime';

const PLAN_DETAILS = {
    monthly: {
        title: 'Mensuel',
        price: '1,90 €',
        subtitle: 'Sans engagement.\n Annulable à tout moment.'
    },
    yearly: {
        title: 'Annuel',
        price: '19,00 €',
        subtitle: 'Soit 1,58 € / mois.\n Facturé annuellement.'
    },
    lifetime: {
        title: 'À vie',
        price: '29,00 €',
        subtitle: 'Paiement unique.\n Accès définitif à toutes les fonctionnalités.'
    }
};

export const PaywallModal = ({ isVisible, onClose }: PaywallModalProps) => {
    const setPremium = useUserStore((state) => state.setPremium);
    const showToast = useToastStore((state) => state.showToast);

    const [selectedPlan, setSelectedPlan] = useState<PlanType>('lifetime');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSimulatePurchase = () => {
        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);
            setPremium(true);
            showToast("Bienvenue dans Lumos Premium.");
            onClose();
        }, 1500);
    };

    if (!isVisible) return null;

    const currentPlan = PLAN_DETAILS[selectedPlan];

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Abonnement"
        >

            <View style={styles.content}>

                {/* Section Titre & Accroche */}
                <View style={styles.headerSection}>
                    <View style={styles.iconCircle}>
                        <Crown color={Colors.primary} size={36} />
                    </View>

                    <Title center style={{ color: Colors.primary, marginBottom: 8 }}>Lumos Premium</Title>
                    <BodyText center style={{ paddingHorizontal: 10 }}>
                        Investissez dans votre clarté mentale. Débloquez le mode Libre, l'historique complet et les habitudes illimitées.
                    </BodyText>
                </View>

                {/* Section Fonctionnalités (Plus compacte) */}
                <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                        <Sparkles color={Colors.primary} size={18} />
                        <Text style={styles.featureText}>Habitudes illimitées</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <ShieldCheck color={Colors.primary} size={18} />
                        <Text style={styles.featureText}>Accès à tous les exercices avancés</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Lock color={Colors.primary} size={18} />
                        <Text style={styles.featureText}>Radar de Sagesse et Export de données</Text>
                    </View>
                </View>

                {/* NOUVEAU : Sélecteur de Plan (Segmented Control) */}
                <View style={styles.pricingSection}>
                    <View style={styles.tabContainer}>
                        {(['monthly', 'yearly', 'lifetime'] as PlanType[]).map((plan) => {
                            const isSelected = selectedPlan === plan;
                            return (
                                <TouchableOpacity
                                    key={plan}
                                    style={[styles.tabButton, isSelected && styles.tabButtonActive]}
                                    onPress={() => { setSelectedPlan(plan); feedbackService.light(); }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                                        {PLAN_DETAILS[plan].title}
                                    </Text>
                                    {plan === 'lifetime' && (
                                        <View style={styles.badgeBest}>
                                            <Text style={styles.badgeBestText}>Idéal</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Affichage dynamique du prix */}
                    <View style={styles.priceDisplay}>
                        <Text style={styles.priceText}>{currentPlan.price}</Text>
                        <Text style={styles.subtitleText}>{currentPlan.subtitle}</Text>
                    </View>
                </View>

                {/* Section Achat & Réassurance */}
                <View style={styles.footerSection}>
                    <LumosButton
                        title={`Choisir plan ${currentPlan.title}`}
                        onPress={handleSimulatePurchase}
                        style={{ width: '100%', marginBottom: 15 }}
                        disabled={isProcessing}
                    />
                    <Text style={styles.guaranteeText}>Sécurisé • 100% Local • Sans publicité</Text>
                </View>
            </View>

        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.surface,
        paddingTop: Platform.OS === 'ios' ? 50 : 25,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 25
    },
    topBar: {
        alignItems: 'flex-end',
        marginBottom: 5,
    },
    closeBtn: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 8,
        borderRadius: 20
    },
    content: {
        flex: 1,
        gap: 16,
        paddingBottom: 20
    },

    // Header
    headerSection: { alignItems: 'center' },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        marginBottom: 15
    },

    // Features
    featuresList: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        gap: 12
    },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    featureText: { color: Colors.text, fontSize: 13, fontFamily: 'PoppinsSemiBold', flex: 1 },

    // Pricing Section (Nouveau)
    pricingSection: {
        alignItems: 'center',
        marginVertical: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 14,
        padding: 4,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        position: 'relative'
    },
    tabButtonActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)'
    },
    tabText: {
        color: Colors.textMuted,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 13
    },
    tabTextActive: {
        color: Colors.primary,
        fontFamily: 'PoppinsBold'
    },
    badgeBest: {
        position: 'absolute',
        top: -8,
        right: 4,
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8
    },
    badgeBestText: {
        color: Colors.surface,
        fontSize: 9,
        fontFamily: 'PoppinsBold',
        textTransform: 'uppercase'
    },

    // Dynamic Price Display
    priceDisplay: { alignItems: 'center' },
    priceText: { color: Colors.text, fontSize: 32, fontFamily: 'PoppinsBold', marginBottom: 4 },
    subtitleText: { color: Colors.textMuted, fontSize: 13, fontFamily: 'InterRegular', textAlign: 'center', paddingHorizontal: 20 },

    // Footer
    footerSection: { alignItems: 'center' },
    buyButton: {
        width: '100%',
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56
    },
    buyButtonDisabled: { opacity: 0.7 },
    buyButtonText: { color: Colors.surface, fontSize: 15, fontFamily: 'PoppinsBold' },
    guaranteeText: { color: Colors.textMuted, fontSize: 12, marginTop: 15, fontFamily: 'InterRegular' }
});