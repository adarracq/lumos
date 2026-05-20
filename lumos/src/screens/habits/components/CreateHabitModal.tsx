// src/components/organisms/CreateHabitModal.tsx
import { LumosButton } from '@/src/components/atoms/LumosButton';
import { BaseBottomSheetModal } from '@/src/components/molecules/BaseBottomSheet';
import { Colors } from '@/src/constants/Colors';
import { Habit, HabitType } from '@/src/models/Habit';
import { feedbackService } from '@/src/services/feedbackService';
import { useAlertStore } from '@/src/store/useAlertStore';
import { useHabitStore } from '@/src/store/useHabitStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Bell, Clock, Minus, Plus, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DAYS = [
    { id: 1, label: 'L' }, { id: 2, label: 'M' }, { id: 3, label: 'M' },
    { id: 4, label: 'J' }, { id: 5, label: 'V' }, { id: 6, label: 'S' }, { id: 7, label: 'D' }
];
const HABIT_COLORS = [Colors.primary, '#CF6679', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800'];
const ICONS = [
    // --- Les Essentiels & Énergie ---
    'Star',         // Objectif global, favori
    'Sun',          // Routine matinale, réveil tôt
    'Moon',         // Routine du soir, sommeil
    'Coffee',       // Matin, pause, hydratation
    'Flame',        // Motivation, streak, intensité

    // --- Santé & Physique ---
    'Dumbbell',     // Musculation, sport intense
    'Footprints',   // Marche (ex: 10 000 pas), course à pied
    'Activity',     // Cardio, santé générale
    'Apple',        // Alimentation saine, fruits
    'Utensils',     // Cuisiner maison, jeûne intermittent
    'Droplets',     // Boire de l'eau, douche froide, hygiène
    'Pill',         // Vitamines, médicaments, compléments

    // --- Mental & Esprit ---
    'BrainCircuit', // Apprentissage, neuroplasticité, mindset
    'Wind',         // Respiration, méditation (cohérence cardiaque)
    'Leaf',         // Temps dans la nature, écologie, calme
    'Heart',        // Gratitude, self-care, santé émotionnelle
    'Sparkles',     // Rangement, clarté mentale, ménage

    // --- Productivité & Intellect ---
    'Target',       // Focus, objectif précis, deep work
    'BookOpen',     // Lecture
    'PenTool',      // Journaling, écriture, réflexion (tu peux aussi utiliser 'Pen' ou 'Edit3')
    'Briefcase',    // Travail, projet pro
    'Globe',        // Apprentissage d'une langue, ouverture

    // --- Créativité & Loisirs ---
    'Palette',      // Art, dessin, créativité
    'Music',        // Instrument, pratique musicale

    // --- Social & Finances ---
    'Users',        // Temps en famille, voir des amis
    'MessageCircle',// Appeler un proche, sociabiliser
    'PiggyBank',    // Épargne, budget, ne pas dépenser

    // --- Digital Detox ---
    'MonitorOff',   // Pas d'écran (TV/Ordi)
    'Smartphone',   // Limite de temps d'écran (ou 'SmartphoneOff' si tu l'as)
];

interface CreateHabitModalProps {
    isVisible: boolean;
    onClose: () => void;
    habitToEdit?: Habit | null; // 💡 NOUVEAU
}

export const CreateHabitModal = ({ isVisible, onClose, habitToEdit }: CreateHabitModalProps) => {
    const { addHabit, updateHabit, deleteHabit } = useHabitStore();
    const { showAlert } = useAlertStore();

    const [name, setName] = useState('');
    const [type, setType] = useState<HabitType>('UNIQUE');
    const [color, setColor] = useState(Colors.primary);
    const [icon, setIcon] = useState('Star');
    const [frequency, setFrequency] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
    const [targetValue, setTargetValue] = useState<number>(1);
    const [reminderTime, setReminderTime] = useState<Date | null>(null);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // 💡 NOUVEAU : Pré-remplir les champs si on est en mode édition
    useEffect(() => {
        if (habitToEdit) {
            setName(habitToEdit.name);
            setType(habitToEdit.type);
            setColor(habitToEdit.color);
            setIcon(habitToEdit.icon);
            setFrequency(habitToEdit.frequency);
            if (habitToEdit.targetValue) setTargetValue(habitToEdit.targetValue);

            // Convertir la chaîne "HH:mm" en objet Date
            if (habitToEdit.reminderTime) {
                const [hours, minutes] = habitToEdit.reminderTime.split(':').map(Number);
                const d = new Date();
                d.setHours(hours, minutes, 0, 0);
                setReminderTime(d);
            } else {
                setReminderTime(null);
            }
        } else {
            // Reset complet pour la création
            setName(''); setType('UNIQUE'); setColor(Colors.primary); setIcon('Star');
            setFrequency([1, 2, 3, 4, 5, 6, 7]); setTargetValue(1); setReminderTime(null);
        }
    }, [habitToEdit, isVisible]);

    useEffect(() => {
        if (!habitToEdit) {
            if (type === 'QUANTITY') setTargetValue(1);
            if (type === 'TIME') setTargetValue(15);
        }
    }, [type, habitToEdit]);

    const toggleDay = (dayId: number) => {
        if (frequency.includes(dayId)) setFrequency(frequency.filter(d => d !== dayId));
        else setFrequency([...frequency, dayId].sort());
    };

    const increment = () => setTargetValue(prev => prev + (type === 'TIME' ? 5 : 1));
    const decrement = () => setTargetValue(prev => Math.max(1, prev - (type === 'TIME' ? 1 : 1)));

    const onTimeChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || reminderTime;
        setShowTimePicker(Platform.OS === 'ios');
        if (currentDate) setReminderTime(currentDate);
    };

    const handleSave = () => {
        if (name.trim().length > 0 && frequency.length > 0) {
            const formattedReminder = reminderTime
                ? `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}`
                : undefined;

            const habitData = {
                name: name.trim(),
                type,
                color,
                icon,
                frequency,
                targetValue: type !== 'UNIQUE' ? targetValue : undefined,
                reminderTime: formattedReminder
            };

            if (habitToEdit) {
                updateHabit(habitToEdit.id, habitData); // 💡 NOUVEAU
            } else {
                addHabit(habitData);
            }

            onClose();
        }
    };

    const handleDelete = () => {
        if (!habitToEdit) return;

        showAlert(
            "Supprimer l'habitude",
            `Voulez-vous vraiment supprimer "${habitToEdit.name}" ? L'historique sera conservé.`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => {
                        deleteHabit(habitToEdit.id);
                        onClose();
                    }
                }
            ]
        );
    };

    return (
        <BaseBottomSheetModal
            isVisible={isVisible}
            onClose={onClose}
            title={habitToEdit ? "Modifier l'habitude" : "Créer une habitude"}
        >

            <TextInput style={styles.glassInput} placeholder="Nom de l'habitude..." placeholderTextColor={Colors.textMuted} value={name} onChangeText={setName} selectionColor={Colors.primary} />

            {/* ICÔNES */}
            <Text style={styles.sectionLabel}>ICÔNE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconsContainer}>
                {ICONS.map(i => {
                    const IconComp = require('lucide-react-native')[i];
                    return (
                        <TouchableOpacity key={i} style={[styles.iconBox, icon === i && { borderColor: color, backgroundColor: `${color}15` }]} onPress={() => { setIcon(i); feedbackService.light(); }} activeOpacity={0.8}>
                            <IconComp color={icon === i ? color : Colors.textMuted} size={24} />
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* TYPE */}
            <Text style={styles.sectionLabel}>TYPE D'OBJECTIF</Text>
            <View style={styles.typeContainer}>
                {(['UNIQUE', 'QUANTITY', 'TIME'] as HabitType[]).map((t) => (
                    <TouchableOpacity key={t} style={[styles.typeBtn, type === t && styles.typeBtnActive]} onPress={() => { setType(t); feedbackService.light(); }} activeOpacity={0.8}>
                        <Text style={[styles.typeText, type === t && styles.typeTextActive]}>
                            {t === 'UNIQUE' ? 'Validation' : t === 'QUANTITY' ? 'Quantité' : 'Chrono'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* STEPPER QUANTITÉ / TEMPS */}
            {type !== 'UNIQUE' && (
                <View style={{ marginBottom: 25 }}>
                    <Text style={styles.sectionLabel}>{type === 'QUANTITY' ? 'OBJECTIF À ATTEINDRE' : 'DURÉE VISÉE'}</Text>
                    <View style={styles.stepperContainer}>
                        <TouchableOpacity style={styles.stepperBtn} onPress={decrement} activeOpacity={0.7}>
                            <Minus color={Colors.textMuted} size={20} />
                        </TouchableOpacity>

                        <View style={styles.stepperValueBox}>
                            <Text style={styles.stepperValue}>{targetValue}</Text>
                            <Text style={styles.stepperUnit}>{type === 'QUANTITY' ? 'fois' : 'min'}</Text>
                        </View>

                        <TouchableOpacity style={styles.stepperBtn} onPress={increment} activeOpacity={0.7}>
                            <Plus color={Colors.textMuted} size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* RÉCURRENCE */}
            <Text style={styles.sectionLabel}>RÉCURRENCE</Text>
            <View style={styles.daysContainer}>
                {DAYS.map(day => (
                    <TouchableOpacity key={day.id} style={[styles.dayCircle, frequency.includes(day.id) && { backgroundColor: color, borderColor: color }]} onPress={() => { toggleDay(day.id); feedbackService.light(); }} activeOpacity={0.8}>
                        <Text style={[styles.dayText, frequency.includes(day.id) && { color: Colors.background }]}>{day.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* TIME PICKER DE RAPPEL */}
            <View style={styles.reminderHeader}>
                <Bell color={Colors.textMuted} size={14} />
                <Text style={[styles.sectionLabel, { marginBottom: 0, marginTop: 0 }]}>RAPPEL (Optionnel)</Text>
            </View>

            <TouchableOpacity style={[styles.timePickerBtn, reminderTime && { borderColor: color, backgroundColor: `${color}10` }]} onPress={() => { setShowTimePicker(true); feedbackService.light(); }} activeOpacity={0.7}>
                <Clock color={reminderTime ? color : Colors.textMuted} size={18} />
                <Text style={[styles.timePickerText, reminderTime && { color: color, fontFamily: 'PoppinsBold' }]}>
                    {reminderTime ? `${reminderTime.getHours().toString().padStart(2, '0')}:${reminderTime.getMinutes().toString().padStart(2, '0')}` : "Ajouter une heure de rappel"}
                </Text>

                {reminderTime && (
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); setReminderTime(null); setShowTimePicker(false); feedbackService.light(); }} style={{ marginLeft: 'auto', padding: 4 }}>
                        <X color={color} size={18} />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>

            {showTimePicker && (
                <View style={styles.pickerWrapper}>
                    <DateTimePicker value={reminderTime || new Date()} mode="time" is24Hour={true} display="spinner" onChange={onTimeChange} textColor={Colors.text} />
                    {Platform.OS === 'ios' && (
                        <TouchableOpacity style={styles.pickerCloseBtn} onPress={() => { setShowTimePicker(false); feedbackService.light(); }}>
                            <Text style={{ color: color, fontFamily: 'PoppinsBold' }}>Valider l'heure</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* COULEURS */}
            <Text style={styles.sectionLabel}>COULEUR</Text>
            <View style={styles.colorsContainer}>
                {HABIT_COLORS.map(c => (
                    <TouchableOpacity key={c} style={[styles.colorCircle, { backgroundColor: c }, color === c && styles.colorCircleSelected]} onPress={() => { setColor(c); feedbackService.light(); }} />
                ))}
            </View>

            <View style={{ marginTop: 10, gap: 12 }}>
                <LumosButton
                    title={habitToEdit ? "Mettre à jour" : "Sauvegarder l'habitude"}
                    onPress={handleSave}
                    disabled={name.trim().length === 0 || frequency.length === 0}
                />

                {habitToEdit && (
                    <LumosButton
                        title={"Supprimer l'habitude"}
                        onPress={handleDelete}
                        disabled={name.trim().length === 0 || frequency.length === 0}
                        color={"#E53935"}
                        variant='outline'
                    />
                )}
            </View>
        </BaseBottomSheetModal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40, maxHeight: '90%' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    closeBtn: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },

    glassInput: { backgroundColor: 'rgba(0,0,0,0.3)', color: Colors.text, fontSize: 16, fontFamily: 'InterRegular', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 20 },
    sectionLabel: { color: Colors.textMuted, fontSize: 11, fontFamily: 'PoppinsBold', letterSpacing: 1, marginBottom: 12, marginTop: 5 },

    iconsContainer: { flexDirection: 'row', marginBottom: 24 },
    iconBox: { padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, marginRight: 12 },

    typeContainer: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' },
    typeBtnActive: { borderColor: Colors.primary, backgroundColor: 'rgba(212, 175, 55, 0.15)' },
    typeText: { color: Colors.textMuted, fontFamily: 'PoppinsSemiBold', fontSize: 13 },
    typeTextActive: { color: Colors.primary },

    stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 8 },
    stepperBtn: { padding: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 },
    stepperValueBox: { alignItems: 'center' },
    stepperValue: { color: Colors.text, fontSize: 26, fontFamily: 'PoppinsBold' },
    stepperUnit: { color: Colors.textMuted, fontSize: 12, fontFamily: 'PoppinsSemiBold', marginTop: -4 },

    daysContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    dayCircle: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center' },
    dayText: { color: Colors.text, fontFamily: 'PoppinsBold', fontSize: 13 },

    colorsContainer: { flexDirection: 'row', gap: 15, marginBottom: 35 },
    colorCircle: { width: 36, height: 36, borderRadius: 18 },
    colorCircleSelected: { borderWidth: 3, borderColor: Colors.white, shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5 },

    reminderHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    timePickerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 25 },
    timePickerText: { color: Colors.textMuted, fontSize: 14, fontFamily: 'PoppinsMedium', marginLeft: 12 },
    pickerWrapper: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, marginBottom: 25, overflow: 'hidden', padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    pickerCloseBtn: { alignSelf: 'center', padding: 12, marginTop: 10 },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 82, 82, 0.2)',
        gap: 8,
    },
    deleteText: {
        color: '#FF5252',
        fontFamily: 'PoppinsSemiBold',
        fontSize: 14,
    }
});