import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

// Importation de nos 4 stores Zustand
import { useHabitStore } from '../store/useHabitStore';
import { useJournalStore } from '../store/useJournalStore';
import { useTaskStore } from '../store/useTaskStore';
import { useUserStore } from '../store/useUserStore';
// Importation du service de notifications pour la reprogrammation automatique
import { useAlertStore } from '../store/useAlertStore';
import { notificationService } from './notificationService';

export const dataBackupService = {
    // --- EXPORTATION ---


    async exportDataJSON() {
        try {
            const backupData = {
                version: "1.0.0",
                exportDate: new Date().toISOString(),
                user: useUserStore.getState(),
                tasks: useTaskStore.getState(),
                habits: useHabitStore.getState(),
                journal: useJournalStore.getState(),
            };

            const jsonString = JSON.stringify(backupData, null, 2);
            const dateStr = new Date().toISOString().split('T')[0];
            const fileName = `LUMOS_Backup_${dateStr}.json`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            await FileSystem.writeAsStringAsync(fileUri, jsonString, {
                encoding: FileSystem.EncodingType.UTF8
            });

            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                useAlertStore.getState().showAlert('Erreur', 'Le partage de fichiers n\'est pas disponible sur cet appareil.');
                return;
            }

            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/json',
                dialogTitle: 'Sauvegarder vos données LUMOS',
                UTI: 'public.json'
            });

        } catch (error) {
            console.error("Erreur lors de l'exportation:", error);
            useAlertStore.getState().showAlert('Erreur', 'Une erreur est survenue lors de la création de la sauvegarde.');
        }
    },

    // 💡 NOUVEAU : --- IMPORTATION & RESTAURATION ---
    async importDataJSON() {
        try {
            // 1. Ouvrir le sélecteur de fichier natif filtré sur les fichiers JSON
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
            });

            // Si l'utilisateur quitte la fenêtre sans choisir de fichier
            if (result.canceled || !result.assets || result.assets.length === 0) {
                return;
            }

            const fileUri = result.assets[0].uri;

            // 2. Lire le contenu textuel du fichier sélectionné (avec l'API Legacy d'Expo 54)
            const jsonString = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            // 3. Parser la chaîne de caractères et valider sa structure globale
            const parsed = JSON.parse(jsonString);

            if (!parsed.version || !parsed.user || !parsed.tasks || !parsed.habits || !parsed.journal) {
                useAlertStore.getState().showAlert('Fichier invalide', 'Le document sélectionné n\'est pas un fichier de sauvegarde LUMOS valide.');
                return;
            }

            // 4. Alerte de sécurité pour éviter une fausse manipulation destructrice
            useAlertStore.getState().showAlert(
                'Restaurer tes données',
                'Cette action va écraser définitivement ton avancement actuel (XP, tâches, habitudes et journal) par les données de ce fichier. Continuer ?',
                [
                    { text: 'Annuler', style: 'cancel' },
                    {
                        text: 'Restaurer',
                        style: 'destructive',
                        onPress: async () => {
                            // Envoi des données dans les stores Zustand (les actions/fonctions restent intactes)
                            useUserStore.setState(parsed.user);
                            useTaskStore.setState(parsed.tasks);
                            useHabitStore.setState(parsed.habits);
                            useJournalStore.setState(parsed.journal);

                            // 5. Nettoyage et reprogrammation complète des alarmes locales du téléphone
                            try {
                                await notificationService.cancelAll(); // On annule tout l'ancien historique
                                await notificationService.scheduleEveningReview(); // On recrée le bilan de 20h

                                // On parcourt la liste des nouvelles routines pour recréer leurs rappels respectifs
                                const importedHabits = parsed.habits.habits || [];
                                for (const habit of importedHabits) {
                                    if (habit.reminderTime && habit.id) {
                                        await notificationService.scheduleHabitReminder(habit.id, habit.name, habit.reminderTime);
                                    }
                                }
                            } catch (notifError) {
                                console.error("Échec de la synchronisation des notifications:", notifError);
                            }

                            useAlertStore.getState().showAlert('Restauration réussie', 'Votre profil et votre historique ont été entièrement synchronisés.');
                        }
                    }
                ]
            );

        } catch (error) {
            console.error("Erreur lors de l'importation:", error);
            useAlertStore.getState().showAlert('Erreur de lecture', 'Impossible de lire ou de décoder ce fichier de sauvegarde JSON.');
        }
    }
};