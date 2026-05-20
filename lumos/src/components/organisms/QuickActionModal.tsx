// src/components/organisms/QuickActionModal.tsx
import { TOOLS_CATALOG } from '@/src/constants/Tools';
import { CheckSquare, ChevronDown, ChevronRight, ChevronUp, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { dataBackupService } from '../../services/dataBackupService';
import { useTaskStore } from '../../store/useTaskStore';
import { ToolModalId, useUIStore } from '../../store/useUIStore';
import { useUserStore } from '../../store/useUserStore';
import { BodyText } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';
import { PaywallModal } from './PaywallModal';

export const QuickActionModal = () => {
    const { isQuickActionVisible, setQuickActionVisible, openModal } = useUIStore();
    const setAddModalVisible = useTaskStore((state) => state.setAddModalVisible);

    // Ajout de isPremium pour vérifier les droits de l'utilisateur
    const { toolUsage, trackToolUsage, isPremium } = useUserStore();

    const [showAll, setShowAll] = useState(false);

    // Nouvel état pour gérer l'affichage du Paywall
    const [isPaywallVisible, setPaywallVisible] = useState(false);

    // On retire le "if (!isQuickActionVisible) return null;" prématuré
    // pour que le composant puisse toujours rendre le PaywallModal si besoin.

    const topTools = [...TOOLS_CATALOG]
        .sort((a, b) => (toolUsage[b.id] || 0) - (toolUsage[a.id] || 0))
        .slice(0, 3);

    const handleOpenTask = () => {
        setQuickActionVisible(false);
        setTimeout(() => setAddModalVisible(true), 300);
    };

    const handleOpenTool = (id: string) => {
        trackToolUsage(id);
        setQuickActionVisible(false);
        setTimeout(() => openModal(id as ToolModalId), 300);
    };

    const ActionButton = ({ item }: any) => {
        // 1. Logique de verrouillage Premium
        const isLocked = item.isPremiumFeature && !isPremium;
        const IconToUse = isLocked ? Lock : item.icon;
        const colorToUse = isLocked ? Colors.textMuted : item.color;
        const descToUse = isLocked ? "Fonctionnalité Premium" : item.desc;

        const handlePress = () => {
            // 2. Comportement au clic
            if (isLocked) {
                setQuickActionVisible(false);
                // Léger délai pour laisser la modale d'action rapide se fermer proprement
                setTimeout(() => setPaywallVisible(true), 300);
            } else if (item.id === 'exportData') {
                setQuickActionVisible(false);
                dataBackupService.exportDataJSON();
            } else if (item.id === 'importData') {
                setQuickActionVisible(false);
                dataBackupService.importDataJSON();
            } else {
                handleOpenTool(item.id);
            }
        };

        return (
            <TouchableOpacity style={styles.actionBtn} onPress={handlePress} activeOpacity={0.8}>
                <View style={[styles.iconContainer, { backgroundColor: `${colorToUse}15` }]}>
                    <IconToUse color={colorToUse} size={24} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.actionTitle}>{item.title}</Text>
                    <Text style={styles.actionDesc}>{descToUse}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <BaseBottomSheetModal
                isVisible={isQuickActionVisible}
                onClose={() => { setQuickActionVisible(false); setShowAll(false); }}
                title="Action Rapide"
            >

                {/* 1. TOUJOURS EN HAUT : LA TÂCHE (Design élégant) */}
                <TouchableOpacity style={styles.primaryTaskBtn} onPress={handleOpenTask} activeOpacity={0.8}>
                    <View style={styles.primaryTaskIcon}>
                        <CheckSquare color={Colors.surface} size={24} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.primaryTaskTitle}>Nouvelle Tâche</Text>
                        <Text style={styles.primaryTaskDesc}>Décharge ton esprit immédiatement</Text>
                    </View>
                    <ChevronRight color={Colors.primary} size={20} />
                </TouchableOpacity>

                {/* 2. LES FAVORIS INTELLIGENTS */}
                {!showAll && (
                    <>
                        <BodyText style={styles.sectionTitle}>Tes outils favoris</BodyText>
                        <View style={styles.grid}>
                            {topTools.map(tool => <ActionButton key={tool.id} item={tool} />)}
                        </View>

                        <TouchableOpacity style={styles.showAllBtn} onPress={() => setShowAll(true)}>
                            <Text style={styles.showAllText}>Voir tous les outils ({TOOLS_CATALOG.length})</Text>
                            <ChevronDown color={Colors.textMuted} size={18} />
                        </TouchableOpacity>
                    </>
                )}

                {/* 3. TOUS LES OUTILS (DÉPLIÉ 1 PAR LIGNE) */}
                {showAll && (
                    <>
                        <TouchableOpacity style={styles.showAllBtn} onPress={() => setShowAll(false)}>
                            <Text style={styles.showAllText}>Masquer le catalogue</Text>
                            <ChevronUp color={Colors.textMuted} size={18} />
                        </TouchableOpacity>

                        {['mental', 'focus', 'social', 'vision', 'archives'].map(category => {
                            const categoryTools = TOOLS_CATALOG.filter(t => t.category === category);
                            if (categoryTools.length === 0) return null;

                            return (
                                <View key={category} style={{ marginTop: 20 }}>
                                    <Text style={styles.categoryTitle}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </Text>
                                    <View style={styles.categoryGrid}>
                                        {categoryTools.map(tool => (
                                            <ActionButton key={tool.id} item={tool} />
                                        ))}
                                    </View>
                                </View>
                            );
                        })}
                    </>
                )}
            </BaseBottomSheetModal>

            {/* LE PAYWALL EST HÉBERGÉ ICI POUR S'AFFICHER SANS CONFLIT */}
            <PaywallModal isVisible={isPaywallVisible} onClose={() => setPaywallVisible(false)} />
        </>
    );
};

const styles = StyleSheet.create({
    // ... tes styles restent exactement les mêmes !
    primaryTaskBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        padding: 14,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        marginBottom: 25
    },
    primaryTaskIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    primaryTaskTitle: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 16 },
    primaryTaskDesc: { color: Colors.primary, fontFamily: 'InterRegular', fontSize: 12, opacity: 0.8 },

    sectionTitle: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 12, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 },
    grid: { gap: 12 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: Colors.surfaceLight },
    iconContainer: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    textContainer: { flex: 1 },
    actionTitle: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 15 },
    actionDesc: { color: Colors.textMuted, fontFamily: 'InterRegular', fontSize: 12 },

    showAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, marginTop: 15, borderTopWidth: 1, borderColor: Colors.surfaceLight, gap: 8 },
    showAllText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 13 },

    categoryTitle: { color: Colors.textMuted, fontFamily: 'PoppinsBold', fontSize: 12, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
    categoryGrid: { gap: 12 },
});