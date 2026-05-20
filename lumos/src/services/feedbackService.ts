import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Gère l'état global (pourra être relié à un Zustand "SettingsStore" plus tard)
let isHapticsEnabled = true;
let isSoundEnabled = true; // Préparation pour les sons

export const feedbackService = {
    // --- VIBRATIONS (HAPTICS) ---

    // Pour une action douce (ex: Incrémenter une habitude +1)
    light() {
        if (!isHapticsEnabled || Platform.OS === 'web') return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },

    // Pour une action standard (ex: Ouvrir une modale, naviguer)
    medium() {
        if (!isHapticsEnabled || Platform.OS === 'web') return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },

    // Pour une action marquante (ex: Clic sur un gros bouton)
    heavy() {
        if (!isHapticsEnabled || Platform.OS === 'web') return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    },

    // Pour une victoire / complétion (ex: Tâche terminée, Habitude validée)
    success() {
        if (!isHapticsEnabled || Platform.OS === 'web') return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },

    // Pour un avertissement ou une erreur
    error() {
        if (!isHapticsEnabled || Platform.OS === 'web') return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },

    // --- SONS (AUDIO) ---

    // Exemple d'implémentation pour un son de succès (ding !)
    // Il te faudra un fichier "success.mp3" dans ton dossier assets/sounds/
    async playSuccessSound() {
        if (!isSoundEnabled) return;
        try {
            // Décommenter quand le fichier existera
            /*
            const { sound } = await Audio.Sound.createAsync(
               require('../../assets/sounds/success.mp3')
            );
            await sound.playAsync();
            // Nettoyage de la mémoire après la lecture
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
            */
        } catch (error) {
            console.log("Erreur de lecture audio", error);
        }
    }
};