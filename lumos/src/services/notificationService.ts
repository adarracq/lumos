import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuration du comportement des notifications quand l'app est au premier plan
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const notificationService = {
    // 1. Demander la permission
    async requestPermissions() {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    },

    // 2. Planifier la notification du Bilan du Soir (ex: 20h00)
    async scheduleEveningReview() {
        // On annule d'abord toute notification de bilan existante pour éviter les doublons
        await this.cancelNotification('evening-review');

        await Notifications.scheduleNotificationAsync({
            identifier: 'evening-review',
            content: {
                title: "🌙 Bilan du Soir",
                body: "Prends 2 minutes pour valider ta journée, noter tes réflexions et clôturer ton cycle.",
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: 20,
                minute: 0,
            },
        });
    },

    // 3. Planifier une notification pour une habitude spécifique
    async scheduleHabitReminder(habitId: string, habitName: string, timeString: string, frequency: number[]) {
        if (!timeString || !frequency || frequency.length === 0) return;

        await this.cancelNotification(`habit-${habitId}`);

        const [hour, minute] = timeString.split(':').map(Number);

        // Planifier une notification pour chaque jour de la fréquence
        for (const day of frequency) {
            await Notifications.scheduleNotificationAsync({
                identifier: `habit-${habitId}-day-${day}`,
                content: {
                    title: "⚡ Rappel d'Habitude",
                    body: `Il est l'heure pour : ${habitName}. Maintenez le cap !`,
                    sound: true,
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                    weekday: day,
                    hour,
                    minute,
                },
            });
        }
    },

    // 4. Annuler une notification spécifique
    async cancelNotification(identifier: string) {
        await Notifications.cancelScheduledNotificationAsync(identifier);
    },

    // 5. Annuler toutes les notifications (utile si l'utilisateur désactive l'option globale)
    async cancelAll() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
};