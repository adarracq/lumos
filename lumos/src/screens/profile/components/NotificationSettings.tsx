// src/screens/profile/components/NotificationSettings.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { Moon, Sun, Sunrise } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { feedbackService } from '../../../services/feedbackService';
import { notificationService } from '../../../services/notificationService';
import { useUserStore } from '../../../store/useUserStore';

export const NotificationSettings = () => {
    const { notifications, updateNotificationSetting } = useUserStore();

    // État pour le Time Picker
    const [pickerConfig, setPickerConfig] = useState<{
        visible: boolean;
        type: 'morning' | 'day' | 'evening' | null;
        tempDate: Date;
    }>({
        visible: false,
        type: null,
        tempDate: new Date(),
    });

    // Ouvre le sélecteur d'heure
    const openPicker = (type: 'morning' | 'day' | 'evening') => {
        feedbackService.light();
        const timeStr = notifications[type].time;
        const [hours, minutes] = timeStr.split(':').map(Number);
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);

        setPickerConfig({ visible: true, type, tempDate: d });
    };

    // Gestion du changement d'heure
    const onTimeChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            // Sur Android, on ferme tout de suite et on valide
            setPickerConfig(prev => ({ ...prev, visible: false }));
            if (selectedDate && event.type === 'set' && pickerConfig.type) {
                saveTime(pickerConfig.type, selectedDate);
            }
        } else {
            // Sur iOS, on met juste à jour la valeur visuelle, l'utilisateur validera via le bouton
            if (selectedDate) setPickerConfig(prev => ({ ...prev, tempDate: selectedDate }));
        }
    };

    // Sauvegarde l'heure dans le store ET dans le service iOS/Android
    const saveTime = async (type: 'morning' | 'day' | 'evening', date: Date) => {
        const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        updateNotificationSetting(type, { time: timeStr });

        // Si la notif est activée, on la reprogramme avec la nouvelle heure
        if (notifications[type].enabled) {
            if (type === 'morning') await notificationService.scheduleMorningRoutine(timeStr);
            if (type === 'day') await notificationService.scheduleDayExercise(timeStr);
            if (type === 'evening') await notificationService.scheduleEveningReview(timeStr);
        }
    };

    // Gestion du Switch ON/OFF
    const toggleNotification = async (type: 'morning' | 'day' | 'evening') => {
        feedbackService.light();
        const isCurrentlyEnabled = notifications[type].enabled;
        const willBeEnabled = !isCurrentlyEnabled;

        updateNotificationSetting(type, { enabled: willBeEnabled });

        if (willBeEnabled) {
            const hasPermission = await notificationService.requestPermissions();
            if (!hasPermission) {
                updateNotificationSetting(type, { enabled: false }); // On annule si pas de permission
                return;
            }
            // On planifie
            const timeStr = notifications[type].time;
            if (type === 'morning') await notificationService.scheduleMorningRoutine(timeStr);
            if (type === 'day') await notificationService.scheduleDayExercise(timeStr);
            if (type === 'evening') await notificationService.scheduleEveningReview(timeStr);
        } else {
            // On annule
            if (type === 'morning') await notificationService.cancelNotification('morning-routine');
            if (type === 'day') await notificationService.cancelNotification('day-exercise');
            if (type === 'evening') await notificationService.cancelNotification('evening-review');
        }
    };

    const SettingRow = ({ type, icon: Icon, label, isLast = false }: any) => {
        const data = notifications[type as 'morning' | 'day' | 'evening'];

        return (
            <View style={[styles.row, !isLast && styles.rowBorder]}>
                <View style={styles.rowLeft}>
                    <View style={[styles.iconWrapper, !data.enabled && { opacity: 0.4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                        <Icon color={data.enabled ? Colors.primary : Colors.textMuted} size={18} />
                    </View>
                    <View>
                        <Text style={[styles.rowLabel, !data.enabled && { color: Colors.textMuted }]}>{label}</Text>

                        <TouchableOpacity onPress={() => openPicker(type)} activeOpacity={0.7} disabled={!data.enabled}>
                            <Text style={[styles.timeText, !data.enabled && { color: Colors.textMuted, opacity: 0.5 }]}>
                                {data.time}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Switch
                    trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(212, 175, 55, 0.5)' }}
                    thumbColor={data.enabled ? Colors.primary : '#f4f3f4'}
                    ios_backgroundColor="rgba(255, 255, 255, 0.1)"
                    onValueChange={() => toggleNotification(type)}
                    value={data.enabled}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                <SettingRow type="morning" icon={Sunrise} label="Routine Matinale" />
                <SettingRow type="day" icon={Sun} label="Exercice du Jour" />
                <SettingRow type="evening" icon={Moon} label="Bilan du Soir" isLast={true} />
            </View>

            {/* TimePicker Modal (Style adapté de HabitModal) */}
            {pickerConfig.visible && (
                <View style={styles.pickerWrapper}>
                    <View style={styles.pickerHeader}>
                        <Text style={styles.pickerTitle}>Heure du rappel</Text>
                    </View>
                    <DateTimePicker
                        value={pickerConfig.tempDate}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={onTimeChange}
                        textColor={Colors.text}
                    />
                    {Platform.OS === 'ios' && (
                        <TouchableOpacity
                            style={styles.pickerCloseBtn}
                            onPress={() => {
                                saveTime(pickerConfig.type!, pickerConfig.tempDate);
                                setPickerConfig(prev => ({ ...prev, visible: false }));
                                feedbackService.success();
                            }}
                        >
                            <Text style={{ color: Colors.background, fontFamily: 'PoppinsBold' }}>Valider l'heure</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    listContainer: {
        backgroundColor: 'rgba(20, 20, 25, 0.6)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    rowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.03)',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLabel: {
        color: Colors.text,
        fontSize: 15,
        fontFamily: 'InterMedium',
        marginBottom: 2,
    },
    timeText: {
        color: Colors.primary,
        fontSize: 13,
        fontFamily: 'PoppinsBold',
    },

    // Styles du Picker (iOS)
    pickerWrapper: {
        backgroundColor: 'rgba(30, 30, 35, 1)',
        borderRadius: 20,
        marginTop: 15,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    pickerHeader: {
        alignItems: 'center',
        marginBottom: 10,
    },
    pickerTitle: {
        color: Colors.textMuted,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    pickerCloseBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        marginTop: 10,
        backgroundColor: Colors.primary,
        borderRadius: 14,
    },
});