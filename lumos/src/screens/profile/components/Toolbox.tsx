// src/screens/profile/Components/Toolbox.tsx
import { TOOLS_CATALOG } from '@/src/constants/Tools';
import { feedbackService } from '@/src/services/feedbackService';
import { ChevronRight, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { dataBackupService } from '../../../services/dataBackupService';

interface ToolboxProps {
    isPremium: boolean;
    onToolPress: (id: any) => void;
    onRequirePremium: () => void;
}

const ToolRowItem = ({ title, desc, icon: Icon, color, onPress }: any) => (
    <TouchableOpacity style={styles.toolRow} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.toolIconBg, { backgroundColor: `${color}15` }]}>
            <Icon color={color} size={20} />
        </View>
        <View style={styles.toolRowText}>
            <Text style={styles.toolTitle}>{title}</Text>
            <Text style={styles.toolDesc} numberOfLines={1}>{desc}</Text>
        </View>
        <ChevronRight color={Colors.textMuted} size={18} style={{ opacity: 0.5 }} />
    </TouchableOpacity>
);

export const Toolbox = ({ isPremium, onToolPress, onRequirePremium }: ToolboxProps) => {
    const [activeToolTab, setActiveToolTab] = useState<'mental' | 'vision' | 'social' | 'focus' | 'archives'>('mental');

    const renderCategory = (categoryName: string) => {
        return TOOLS_CATALOG
            .filter(tool => tool.category === categoryName)
            .map(tool => {
                // 1. Logique de verrouillage Premium
                const isLocked = tool.isPremiumFeature && !isPremium;
                const IconToUse = isLocked ? Lock : tool.icon;
                const colorToUse = isLocked ? Colors.textMuted : tool.color;
                const descToUse = isLocked ? "Fonctionnalité Premium" : tool.desc;

                return (
                    <ToolRowItem
                        key={tool.id}
                        title={tool.title}
                        desc={descToUse}
                        icon={IconToUse}
                        color={colorToUse}
                        onPress={() => {
                            // 2. Comportement au clic
                            if (isLocked) {
                                onRequirePremium();
                            } else if (tool.id === 'exportData') {
                                dataBackupService.exportDataJSON();
                            } else if (tool.id === 'importData') {
                                dataBackupService.importDataJSON();
                            } else {
                                onToolPress(tool.id); // Pour ouvrir les modales classiques
                            }
                        }}
                    />
                );
            });
    };

    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsContent}>
                {['mental', 'focus', 'social', 'vision', 'archives'].map((tab) => (
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
                {/* Plus aucun code en dur, la boucle s'occupe de tout afficher intelligemment ! */}
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
});