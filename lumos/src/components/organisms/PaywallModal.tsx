// src/components/organisms/PaywallModal.tsx
import { feedbackService } from '@/src/services/feedbackService';
import { Crown, Lock, ShieldCheck, Sparkles } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
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

// Fonction utilitaire pour mapper les identifiants standards de RevenueCat vers ta belle UI
const getPackageInfo = (pkg: PurchasesPackage) => {
    switch (pkg.identifier) {
        case '$rc_monthly':
            return { title: 'Mensuel', subtitle: 'Sans engagement.\nAnnulable à tout moment.' };
        case '$rc_annual':
            // Astuce : tu peux calculer le prix par mois ici si tu le souhaites (pkg.product.price / 12)
            return { title: 'Annuel', subtitle: 'Facturé annuellement.\nLe choix de la constance.' };
        case '$rc_lifetime':
            return { title: 'À vie', subtitle: 'Paiement unique.\nAccès définitif à toutes les fonctionnalités.' };
        default:
            return { title: pkg.product.title, subtitle: pkg.product.description };
    }
};

export const PaywallModal = ({ isVisible, onClose }: PaywallModalProps) => {
    const setPremium = useUserStore((state) => state.setPremium);
    const showToast = useToastStore((state) => state.showToast);

    // États liés à RevenueCat
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingOffers, setIsLoadingOffers] = useState(true);

    useEffect(() => {
        // Initialisation de RevenueCat
        const setupRevenueCat = async () => {

            await checkEntitlement();
            await fetchOfferings();
        };

        setupRevenueCat();
    }, []);

    const checkEntitlement = async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            // L'identifiant "Lumos Premium" doit correspondre exactement à l'Entitlement créé sur le dashboard RevenueCat
            if (typeof customerInfo.entitlements.active['lumos-premium'] !== "undefined") {
                setPremium(true);
            }
        } catch (e) {
            console.error("Erreur de vérification des droits :", e);
        }
    };

    const fetchOfferings = async () => {
        setIsLoadingOffers(true);
        try {
            const offerings = await Purchases.getOfferings();

            // On s'assure qu'une offre "Current" est bien configurée sur le dashboard
            if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                setPackages(offerings.current.availablePackages);

                // Par défaut, on sélectionne l'offre "Lifetime" si elle existe, sinon la première de la liste
                const defaultPkg = offerings.current.availablePackages.find(p => p.identifier === '$rc_lifetime')
                    || offerings.current.availablePackages[0];
                setSelectedPackage(defaultPkg);
            }
        } catch (e) {
            console.error("Erreur lors de la récupération des offres :", e);
        } finally {
            setIsLoadingOffers(false);
        }
    };

    // --- LE FLUX D'ACHAT RÉEL ---
    const handlePurchase = async () => {
        if (!selectedPackage) return;

        setIsProcessing(true);
        feedbackService.medium();

        try {
            const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

            if (typeof customerInfo.entitlements.active['lumos-premium'] !== "undefined") {
                setPremium(true);
                showToast("Bienvenue dans Lumos Premium");
                feedbackService.heavy();
                onClose();
            }
        } catch (e: any) {
            if (!e.userCancelled) {
                showToast("La transaction a échoué. Réessayez.");
                feedbackService.error();
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // --- LE FLUX DE RESTAURATION OBLIGATOIRE ---
    const handleRestore = async () => {
        setIsProcessing(true);
        feedbackService.light();

        try {
            const customerInfo = await Purchases.restorePurchases();

            if (typeof customerInfo.entitlements.active['lumos-premium'] !== "undefined") {
                setPremium(true);
                showToast("Achats restaurés avec succès.");
                feedbackService.success(true);
                onClose();
            } else {
                showToast("Aucun abonnement actif trouvé.");
                feedbackService.error();
            }
        } catch (e) {
            showToast("Erreur lors de la restauration.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isVisible) return null;

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

                {/* Section Fonctionnalités */}
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

                {/* Sélecteur de Plan Dynamique (RevenueCat) */}
                <View style={styles.pricingSection}>
                    {isLoadingOffers ? (
                        <View style={{ paddingVertical: 40 }}>
                            <ActivityIndicator size="small" color={Colors.primary} />
                            <Text style={{ color: Colors.textMuted, marginTop: 10, fontFamily: 'InterRegular' }}>Chargement des offres...</Text>
                        </View>
                    ) : packages.length > 0 ? (
                        <>
                            <View style={styles.tabContainer}>
                                {packages.map((pkg) => {
                                    const isSelected = selectedPackage?.identifier === pkg.identifier;
                                    const info = getPackageInfo(pkg);

                                    return (
                                        <TouchableOpacity
                                            key={pkg.identifier}
                                            style={[styles.tabButton, isSelected && styles.tabButtonActive]}
                                            onPress={() => { setSelectedPackage(pkg); feedbackService.light(); }}
                                            activeOpacity={0.8}
                                            disabled={isProcessing}
                                        >
                                            <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                                                {info.title}
                                            </Text>
                                            {pkg.identifier === '$rc_lifetime' && (
                                                <View style={styles.badgeBest}>
                                                    <Text style={styles.badgeBestText}>Idéal</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Affichage dynamique du vrai prix récupéré depuis le store */}
                            {selectedPackage && (
                                <View style={styles.priceDisplay}>
                                    <Text style={styles.priceText}>{selectedPackage.product.priceString}</Text>
                                    <Text style={styles.subtitleText}>{getPackageInfo(selectedPackage).subtitle}</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <Text style={{ color: Colors.error, fontFamily: 'InterRegular', marginVertical: 20 }}>
                            Les offres ne sont pas disponibles pour le moment.
                        </Text>
                    )}
                </View>

                {/* Section Achat & Restauration */}
                <View style={styles.footerSection}>
                    <LumosButton
                        title={isProcessing ? "Traitement..." : `Choisir ce plan`}
                        onPress={handlePurchase}
                        style={{ width: '100%', marginBottom: 15 }}
                        disabled={isProcessing || !selectedPackage || packages.length === 0}
                    />

                    <View style={styles.reassuranceRow}>
                        <Text style={styles.guaranteeText}>Sécurisé • Sans publicité • </Text>
                        <TouchableOpacity onPress={handleRestore} disabled={isProcessing}>
                            <Text style={styles.restoreText}>Restaurer un achat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        gap: 16,
        paddingBottom: 20
    },
    headerSection: { alignItems: 'center' },
    iconCircle: {
        width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(212, 175, 55, 0.1)',
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', marginBottom: 15
    },
    featuresList: {
        backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', gap: 12
    },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    featureText: { color: Colors.text, fontSize: 13, fontFamily: 'PoppinsSemiBold', flex: 1 },
    pricingSection: { alignItems: 'center', marginVertical: 10, minHeight: 120 },
    tabContainer: {
        flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: 14, padding: 4, width: '100%', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    tabButton: {
        flex: 1, paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10, position: 'relative'
    },
    tabButtonActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)'
    },
    tabText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 13 },
    tabTextActive: { color: Colors.primary, fontFamily: 'PoppinsBold' },
    badgeBest: {
        position: 'absolute', top: -8, right: 4, backgroundColor: Colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8
    },
    badgeBestText: { color: Colors.surface, fontSize: 9, fontFamily: 'PoppinsBold', textTransform: 'uppercase' },
    priceDisplay: { alignItems: 'center' },
    priceText: { color: Colors.text, fontSize: 32, fontFamily: 'PoppinsBold', marginBottom: 4 },
    subtitleText: { color: Colors.textMuted, fontSize: 13, fontFamily: 'InterRegular', textAlign: 'center', paddingHorizontal: 20 },
    footerSection: { alignItems: 'center' },
    reassuranceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    guaranteeText: { color: Colors.textMuted, fontSize: 12, fontFamily: 'InterRegular' },
    restoreText: { color: Colors.primary, fontSize: 12, fontFamily: 'PoppinsSemiBold', textDecorationLine: 'underline' }
});