// src/screens/habits/components/HabitsHeader.tsx
import { Title } from '@/src/components/atoms/Typography';
import { Colors } from '@/src/constants/Colors';
import { feedbackService } from '@/src/services/feedbackService';
import { addDays, format, isToday, parseISO, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HabitsHeaderProps {
    selectedDate: string;
    onChangeDate: (newDate: string) => void;
}

export const HabitsHeader = ({ selectedDate, onChangeDate }: HabitsHeaderProps) => {
    const dateObj = parseISO(selectedDate);
    const isCurrentToday = isToday(dateObj);

    const dateLabel = format(dateObj, 'EEEE d MMMM', { locale: fr });

    const handlePrev = () => {
        feedbackService.light();
        onChangeDate(format(subDays(dateObj, 1), 'yyyy-MM-dd'));
    };

    const handleNext = () => {
        if (isCurrentToday) return;
        feedbackService.light();
        onChangeDate(format(addDays(dateObj, 1), 'yyyy-MM-dd'));
    };

    return (
        <View style={styles.container}>
            {/* Titre aligné à sa place originelle */}
            <Title style={styles.mainTitle}>Habitudes</Title>

            {/* Sélecteur compact avec flèches collées au texte de la date */}
            <View style={[styles.dateSelectorContainer, !isCurrentToday && styles.dateSelectorPast]}>
                <TouchableOpacity onPress={handlePrev} style={styles.arrowBtn}>
                    <ChevronLeft color={!isCurrentToday ? Colors.primary : Colors.text} size={20} />
                </TouchableOpacity>

                <View style={styles.dateTextWrapper}>
                    <Calendar color={!isCurrentToday ? Colors.primary : Colors.textMuted} size={13} style={{ marginRight: 6 }} />
                    <Text style={[styles.dateText, !isCurrentToday && styles.dateTextPast]}>
                        {isCurrentToday ? `Aujourd'hui • ${dateLabel}` : dateLabel}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={handleNext}
                    style={[styles.arrowBtn, isCurrentToday && styles.arrowBtnDisabled]}
                    disabled={isCurrentToday}
                >
                    <ChevronRight color={isCurrentToday ? Colors.textMuted : Colors.primary} size={20} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingTop: 60, paddingBottom: 16 },
    mainTitle: { fontSize: 32, letterSpacing: -0.5, marginBottom: 10 },
    dateSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        paddingHorizontal: 2,
        paddingVertical: 2,
        width: '100%'
    },
    dateSelectorPast: {
        backgroundColor: 'rgba(212, 175, 55, 0.02)',
        borderColor: 'rgba(212, 175, 55, 0.1)',
    },
    arrowBtn: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowBtnDisabled: {
        opacity: 0.15,
    },
    dateTextWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    dateText: {
        color: Colors.text,
        fontSize: 12,
        fontFamily: 'PoppinsSemiBold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dateTextPast: {
        color: Colors.primary, // Teinte dorée légère pour rappeler qu'on consulte le passé
    },
});