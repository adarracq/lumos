// src/components/organisms/JournalVaultModal.tsx
import { useAlertStore } from '@/src/store/useAlertStore';
import { differenceInDays, format, parseISO, subDays, subMonths, subYears } from 'date-fns';
import { Calendar, ChevronDown, ChevronUp, Cloud, CloudRain, Heart, History, Search, Sparkles, Sun, Trash2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { LayoutAnimation, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { feedbackService } from '../../services/feedbackService';
import { useJournalStore } from '../../store/useJournalStore';
import { BodyText } from '../atoms/Typography';
import { BaseBottomSheetModal } from '../molecules/BaseBottomSheet';

interface JournalVaultModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const MOOD_MAP: Record<string, { icon: any; color: string; label: string }> = {
    RADIANT: { icon: Sparkles, color: Colors.primary, label: 'Rayonnant' },
    PEACEFUL: { icon: Sun, color: '#4CAF50', label: 'Paisible' },
    NEUTRAL: { icon: Cloud, color: Colors.textMuted, label: 'Neutre' },
    EXHAUSTED: { icon: CloudRain, color: '#CF6679', label: 'Épuisé' }
};

export const JournalVaultModal = ({ isVisible, onClose }: JournalVaultModalProps) => {
    const { entries, deleteEntry, toggleFavorite } = useJournalStore();
    const [activeTab, setActiveTab] = useState<'ALL' | 'FAVORITES'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

    // 💡 NOUVEAU : Gestion du Flashback
    const [flashback, setFlashback] = useState<{ entry: any, label: string } | null>(null);
    const [isFlashbackExpanded, setIsFlashbackExpanded] = useState(false);

    const { showAlert } = useAlertStore();

    // 💡 MOTEUR DU FLASHBACK (Se déclenche à l'ouverture)
    useEffect(() => {
        if (isVisible && entries.length > 0) {
            const now = new Date();
            const oneYearAgo = format(subYears(now, 1), 'yyyy-MM-dd');
            const oneMonthAgo = format(subMonths(now, 1), 'yyyy-MM-dd');
            const oneWeekAgo = format(subDays(now, 7), 'yyyy-MM-dd');

            let found = entries.find(e => e.date === oneYearAgo);
            let label = "Il y a exactement un an...";

            if (!found) {
                found = entries.find(e => e.date === oneMonthAgo);
                label = "Il y a exactement un mois...";
            }

            if (!found) {
                found = entries.find(e => e.date === oneWeekAgo);
                label = "Il y a exactement une semaine...";
            }

            if (!found) {
                // On cherche une entrée de plus de 5 jours au hasard
                const olderEntries = entries.filter(e => {
                    try { return differenceInDays(now, parseISO(e.date)) > 5; }
                    catch { return false; }
                });

                if (olderEntries.length > 0) {
                    found = olderEntries[Math.floor(Math.random() * olderEntries.length)];
                    label = "Un saut dans ton passé...";
                }
            }
            setFlashback(found ? { entry: found, label } : null);
            setIsFlashbackExpanded(false);
        } else {
            setFlashback(null);
        }
    }, [isVisible, entries]);

    if (!isVisible) return null;

    const handleToggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedEntryId(expandedEntryId === id ? null : id);
        feedbackService.light();
    };

    const handleDelete = (id: string) => {
        feedbackService.medium();
        showAlert(
            "Effacer l'introspection",
            "Cette action est irréversible. Souhaitez-vous supprimer cette réflexion ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => {
                        feedbackService.heavy();
                        deleteEntry(id);
                        if (flashback?.entry.id === id) setFlashback(null);
                    }
                }
            ]
        );
    };

    const formatFrenchDate = (dateStr: string) => {
        try {
            const d = parseISO(dateStr);
            const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        } catch {
            return dateStr;
        }
    };

    const renderCleanContent = (content: string) => {
        const lines = content.split('\n');

        return (
            <View style={styles.parsedContainer}>
                {lines.map((line, index) => {
                    const text = line.trim();
                    if (!text) return <View key={index} style={styles.lineSpacer} />;

                    if (text.startsWith('[') && text.endsWith(']')) {
                        return (
                            <Text key={index} style={styles.sectionHeaderLabel}>
                                {text.substring(1, text.length - 1)}
                            </Text>
                        );
                    }

                    return <Text key={index} style={styles.sectionBodyText}>{text}</Text>;
                })}
            </View>
        );
    };

    const filteredEntries = entries.filter(e => {
        const matchesTab = activeTab === 'ALL' || e.isFavorite;
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title="Coffre-fort"
        >
            {/* SÉLECTEUR D'ONGLETS */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'ALL' && styles.tabBtnActive]}
                    onPress={() => { setActiveTab('ALL'); feedbackService.light(); }}
                >
                    <Text style={[styles.tabText, activeTab === 'ALL' && styles.tabTextActive]}>Archives</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'FAVORITES' && styles.tabBtnActive]}
                    onPress={() => { setActiveTab('FAVORITES'); feedbackService.light(); }}
                >
                    <Heart size={14} color={activeTab === 'FAVORITES' ? Colors.primary : Colors.textMuted} fill={activeTab === 'FAVORITES' ? Colors.primary : 'transparent'} style={{ marginRight: 6 }} />
                    <Text style={[styles.tabText, activeTab === 'FAVORITES' && styles.tabTextActive]}>Favoris</Text>
                </TouchableOpacity>
            </View>

            {/* BARRE DE RECHERCHE */}
            <View style={styles.searchBar}>
                <Search color={Colors.textMuted} size={18} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Rechercher une réflexion..."
                    placeholderTextColor={Colors.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <X color={Colors.textMuted} size={16} />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView style={styles.listScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 💡 MODULE FLASHBACK (S'affiche uniquement sans recherche et sur "Archives") */}
                {flashback && activeTab === 'ALL' && searchQuery === '' && (
                    <TouchableOpacity
                        style={[styles.flashbackCard, isFlashbackExpanded && styles.flashbackCardExpanded]}
                        onPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                            setIsFlashbackExpanded(!isFlashbackExpanded);
                            feedbackService.light();
                        }}
                        activeOpacity={0.9}
                    >
                        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
                            <History color={Colors.primary} size={120} style={styles.flashbackBgIcon} opacity={0.03} />
                        </View>

                        <View style={styles.flashbackHeaderRow}>
                            <View style={styles.flashbackBadge}>
                                <Sparkles color={Colors.primary} size={12} />
                                <Text style={styles.flashbackBadgeText}>FLASHBACK</Text>
                            </View>
                            <Text style={styles.flashbackLabel}>{flashback.label}</Text>
                        </View>

                        <Text style={styles.flashbackTitle}>{flashback.entry.title}</Text>

                        {isFlashbackExpanded ? (
                            <View style={styles.flashbackExpandedContent}>
                                <View style={styles.divider} />
                                {renderCleanContent(flashback.entry.content)}
                            </View>
                        ) : (
                            <Text style={styles.flashbackPreview} numberOfLines={2}>
                                {flashback.entry.content.replace(/\[.*?\]/g, '').replace(/\n/g, ' ').trim()}
                            </Text>
                        )}

                        {!isFlashbackExpanded && (
                            <View style={styles.flashbackFooter}>
                                <Text style={styles.flashbackActionText}>Appuyer pour redécouvrir</Text>
                                <ChevronDown color={Colors.primary} size={16} />
                            </View>
                        )}
                    </TouchableOpacity>
                )}

                {/* LISTE DES INTROSPECTIONS */}
                {filteredEntries.length === 0 ? (
                    <BodyText center color={Colors.textMuted} style={styles.emptyText}>
                        {searchQuery.length > 0
                            ? "Aucun résultat pour cette recherche."
                            : activeTab === 'ALL' ? "Aucun cycle n'a encore été scellé." : "Aucune introspection n'est marquée comme favorite."}
                    </BodyText>
                ) : (
                    filteredEntries.map((entry) => {
                        // Optionnel : ne pas réafficher le flashback s'il est déjà tout en haut
                        if (flashback && entry.id === flashback.entry.id && activeTab === 'ALL' && searchQuery === '') return null;

                        const isExpanded = expandedEntryId === entry.id;
                        const moodConfig = entry.mood ? MOOD_MAP[entry.mood] : MOOD_MAP['NEUTRAL'];
                        const MoodIcon = moodConfig?.icon || Cloud;

                        return (
                            <View key={entry.id} style={[styles.glassCard, isExpanded && styles.glassCardExpanded]}>
                                <TouchableOpacity style={styles.cardMainRow} onPress={() => handleToggleExpand(entry.id)} activeOpacity={0.8}>

                                    <View style={[styles.moodIconBg, { backgroundColor: `${moodConfig?.color || Colors.textMuted}10` }]}>
                                        <MoodIcon color={moodConfig?.color || Colors.textMuted} size={18} strokeWidth={2} />
                                    </View>

                                    <View style={styles.cardMeta}>
                                        <Text style={styles.cardTitle} numberOfLines={1}>{entry.title}</Text>
                                        <View style={styles.dateRow}>
                                            <Calendar color={Colors.textMuted} size={12} style={{ marginRight: 4 }} />
                                            <Text style={styles.cardDate}>{formatFrenchDate(entry.date)}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.cardRightActions}>
                                        <TouchableOpacity
                                            style={styles.actionBtn}
                                            onPress={() => { toggleFavorite(entry.id); feedbackService.light(); }}
                                        >
                                            <Heart size={18} color={entry.isFavorite ? '#E91E63' : Colors.textMuted} fill={entry.isFavorite ? '#E91E63' : 'transparent'} />
                                        </TouchableOpacity>
                                        {isExpanded ? <ChevronUp color={Colors.textMuted} size={18} /> : <ChevronDown color={Colors.textMuted} size={18} />}
                                    </View>
                                </TouchableOpacity>

                                {isExpanded && (
                                    <View style={styles.expandedContent}>
                                        <View style={styles.divider} />
                                        {renderCleanContent(entry.content)}

                                        <View style={styles.expandedFooter}>
                                            <TouchableOpacity style={styles.deleteBtn} onPress={() => { handleDelete(entry.id); feedbackService.error(); }}>
                                                <Trash2 color="#CF6679" size={14} />
                                                <Text style={styles.deleteBtnText}>Supprimer</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    // Tab Bar
    tabBar: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 14, padding: 4, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10 },
    tabBtnActive: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    tabText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 13 },
    tabTextActive: { color: Colors.text },

    // Search Bar
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    searchInput: { flex: 1, marginLeft: 10, color: Colors.text, fontSize: 14, fontFamily: 'InterRegular', height: '100%' },

    // ScrollView
    listScroll: { flex: 1, marginHorizontal: -20, paddingHorizontal: 20 },
    scrollContent: { gap: 12, paddingBottom: 60 },
    emptyText: { marginTop: 40, fontStyle: 'italic', paddingHorizontal: 20, fontSize: 14 },

    // 💡 STYLES FLASHBACK
    flashbackCard: { backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)', padding: 16, overflow: 'hidden', marginBottom: 8 },
    flashbackCardExpanded: { backgroundColor: 'rgba(212, 175, 55, 0.08)' },
    flashbackBgIcon: { position: 'absolute', right: -20, top: -20, transform: [{ rotate: '15deg' }] },
    flashbackHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    flashbackBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(212, 175, 55, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    flashbackBadgeText: { color: Colors.primary, fontFamily: 'PoppinsBold', fontSize: 10, letterSpacing: 0.5 },
    flashbackLabel: { color: Colors.textMuted, fontFamily: 'InterMedium', fontSize: 12 },
    flashbackTitle: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 18, marginBottom: 8 },
    flashbackPreview: { color: Colors.textMuted, fontFamily: 'InterRegular', fontSize: 14, lineHeight: 22, opacity: 0.8 },
    flashbackExpandedContent: { marginTop: 8 },
    flashbackFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(212, 175, 55, 0.1)', paddingTop: 12 },
    flashbackActionText: { color: Colors.primary, fontFamily: 'PoppinsSemiBold', fontSize: 12 },

    // Cards Classiques
    glassCard: { backgroundColor: 'rgba(30, 30, 30, 0.4)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' },
    glassCardExpanded: { borderColor: 'rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(30, 30, 30, 0.6)' },
    cardMainRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },

    moodIconBg: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    cardMeta: { flex: 1, justifyContent: 'center', marginRight: 10 },
    cardTitle: { color: Colors.text, fontSize: 15, fontFamily: 'PoppinsSemiBold', marginBottom: 2 },
    dateRow: { flexDirection: 'row', alignItems: 'center' },
    cardDate: { color: Colors.textMuted, fontSize: 11, fontFamily: 'InterRegular' },

    cardRightActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    actionBtn: { padding: 4 },

    expandedContent: { paddingHorizontal: 16, paddingBottom: 16 },
    divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)', marginBottom: 16 },

    parsedContainer: { gap: 6 },
    lineSpacer: { height: 8 },
    sectionHeaderLabel: { color: Colors.primary, fontFamily: 'PoppinsSemiBold', fontSize: 13, marginTop: 10, opacity: 0.9 },
    sectionBodyText: { color: Colors.text, fontSize: 14, fontFamily: 'InterRegular', lineHeight: 22, opacity: 0.85, paddingLeft: 2 },

    expandedFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.04)' },
    deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 4 },
    deleteBtnText: { color: '#CF6679', fontSize: 11, fontFamily: 'PoppinsMedium' }
});