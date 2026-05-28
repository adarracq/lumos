// src/screens/profile/components/Toolbox.tsx
import { ToolCategory, TOOLS_CATALOG } from '@/src/constants/Tools';
import { feedbackService } from '@/src/services/feedbackService';
import { ChevronRight, Lock, Repeat, Trophy } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { dataBackupService } from '../../../services/dataBackupService';
import { useUserStore } from '../../../store/useUserStore'; // N'oublie pas l'import du store !

interface ToolboxProps {
    isPremium: boolean;
    onToolPress: (id: any) => void;
    onRequirePremium: () => void;
}

// Ajout des props usageCount, highScore et isGame
const ToolRowItem = ({ title, desc, icon: Icon, color, onPress, usageCount, highScore, isGame, isLocked }: any) => (
    <TouchableOpacity style={[styles.toolRow, {
        opacity: isLocked ? 0.5 : 1
    }]} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.toolIconBg, { backgroundColor: `${color}15` }]}>
            <Icon color={color} size={20} />
        </View>
        <View style={styles.toolRowText}>
            <Text style={styles.toolTitle}>{title}</Text>
            <Text style={styles.toolDesc} numberOfLines={1}>{desc}</Text>
        </View>

        {/* --- NOUVEAU : ZONE DE STATISTIQUES --- */}
        <View style={styles.statsWrapper}>
            {/* Si c'est un jeu Neuro et qu'il y a un record */}
            {isGame && highScore > 0 && (
                <View style={[styles.badge, styles.scoreBadge]}>
                    <Trophy color={Colors.primary} size={12} style={styles.badgeIcon} />
                    <Text style={styles.scoreText}>{highScore}</Text>
                </View>
            )}
            {/* Si c'est un outil classique et qu'il a été utilisé au moins 1 fois */}
            {!isGame && usageCount > 0 && (
                <View style={[styles.badge, styles.usageBadge]}>
                    <Repeat color={Colors.textMuted} size={12} style={styles.badgeIcon} />
                    <Text style={styles.usageText}>{usageCount}</Text>
                </View>
            )}
        </View>

        <ChevronRight color={Colors.textMuted} size={18} style={{ opacity: 0.5 }} />
    </TouchableOpacity>
);

export const Toolbox = ({ isPremium, onToolPress, onRequirePremium }: ToolboxProps) => {
    const [activeToolTab, setActiveToolTab] = useState<ToolCategory>('sos');

    // 1. Récupération des données depuis le store
    const toolUsage = useUserStore(state => state.toolUsage);
    const highScores = useUserStore(state => state.highScores);

    const renderCategory = (categoryName: string) => {
        return TOOLS_CATALOG
            .filter(tool => tool.category === categoryName)
            .map(tool => {
                const isLocked = tool.isPremiumFeature && !isPremium;
                const IconToUse = isLocked ? Lock : tool.icon;
                const colorToUse = isLocked ? Colors.textMuted : tool.color;
                const descToUse = isLocked ? "Fonctionnalité Premium" : tool.desc;

                // 2. Extraction des stats pour cet outil spécifique
                const currentUsage = toolUsage[tool.id] || 0;
                const currentScore = highScores[tool.id] || 0;
                const isNeuroGame = tool.category === 'neuro';

                return (
                    <ToolRowItem
                        key={tool.id}
                        title={tool.title}
                        desc={descToUse}
                        icon={IconToUse}
                        color={colorToUse}
                        usageCount={currentUsage}
                        highScore={currentScore}
                        isGame={isNeuroGame}
                        isLocked={isLocked}
                        onPress={() => {
                            if (isLocked) {
                                onRequirePremium();
                            } else if (tool.id === 'exportData') {
                                dataBackupService.exportDataJSON();
                            } else if (tool.id === 'importData') {
                                dataBackupService.importDataJSON();
                            } else {
                                onToolPress(tool.id);
                            }
                        }}
                    />
                );
            });
    };

    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsContent}>
                {(['sos', 'focus', 'vision', 'neuro', 'theory'] as ToolCategory[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabPill, activeToolTab === tab && styles.tabPillActive]}
                        onPress={() => { setActiveToolTab(tab as any); feedbackService.light(); }}
                    >
                        <Text style={[styles.tabPillText, activeToolTab === tab && styles.tabPillTextActive]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View>
                {renderCategory(activeToolTab)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: { marginHorizontal: -20, marginBottom: 14 },
    tabsContent: { paddingHorizontal: 20, gap: 8, height: 40 },
    tabPill: { paddingHorizontal: 16, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)', justifyContent: 'center', alignItems: 'center' },
    tabPillActive: { backgroundColor: 'rgba(212, 175, 55, 0.15)', borderColor: Colors.primary },
    tabPillText: { fontSize: 13, fontFamily: 'PoppinsSemiBold', color: Colors.textMuted },
    tabPillTextActive: { color: Colors.primary, fontFamily: 'PoppinsBold' },
    toolRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    toolIconBg: { padding: 10, borderRadius: 12, marginRight: 14 },
    toolRowText: { flex: 1, marginRight: 10 },
    toolTitle: { color: Colors.text, fontFamily: 'PoppinsSemiBold', fontSize: 15, marginBottom: 2 },
    toolDesc: { color: Colors.textMuted, fontSize: 12, fontFamily: 'InterRegular' },

    // NOUVEAUX STYLES POUR LES BADGES
    statsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        opacity: 0.5
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    badgeIcon: {
        marginRight: 4
    },
    usageBadge: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.08)'
    },
    usageText: {
        color: Colors.textMuted,
        fontSize: 11,
        fontFamily: 'PoppinsSemiBold'
    },
    scoreBadge: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderColor: 'rgba(212, 175, 55, 0.3)'
    },
    scoreText: {
        color: Colors.primary,
        fontSize: 11,
        fontFamily: 'PoppinsBold'
    },
});