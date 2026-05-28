import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Gère l'état global (pourra être relié à un Zustand "SettingsStore" plus tard)
let isHapticsEnabled = true;
let isSoundEnabled = true;

let currentSound: Audio.Sound | null = null;

// Fonction utilitaire interne pour jouer un son, arrêter l'ancien, et libérer la mémoire ensuite
const playSound = async (source: any) => {
    if (!isSoundEnabled || Platform.OS === 'web') return;
    try {
        // 💡 NOUVEAU : Si un son est déjà en cours, on l'arrête et on le décharge
        if (currentSound) {
            await currentSound.stopAsync();
            await currentSound.unloadAsync();
            currentSound = null;
        }

        const { sound } = await Audio.Sound.createAsync(source);
        currentSound = sound; // On sauvegarde la référence du nouveau son

        await sound.playAsync();

        // Nettoyage de la mémoire après la lecture naturelle
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
                sound.unloadAsync();
                // Si le son actuel vient de finir de lui-même, on vide la référence
                if (currentSound === sound) {
                    currentSound = null;
                }
            }
        });
    } catch (error) {
        console.log("Erreur de lecture audio", error);
    }
};

export const feedbackService = {
    // --- VIBRATIONS (HAPTICS) SEULES ---

    light() {
        if (!isHapticsEnabled || Platform.OS === 'web') return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },

    medium() {
        if (!isHapticsEnabled || Platform.OS === 'web') return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },

    heavy() {
        if (!isHapticsEnabled || Platform.OS === 'web') return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    },

    error() {
        if (!isHapticsEnabled || Platform.OS === 'web') return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },

    // --- MIXTES : VIBRATIONS + SONS ---

    success(withSound = false) {
        if (isHapticsEnabled && Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        if (withSound) {
            playSound(require('../../assets/sounds/success2.mp3'));
        }
    },

    // --- 🫁 RESPIRATION (MIXTE) ---

    breatheIn() {
        if (isHapticsEnabled && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        // Son montant ou cloche aiguë (Décommente quand le fichier existera)
        playSound(require('../../assets/sounds/breathe-in.wav'));
    },

    breatheOut() {
        if (isHapticsEnabled && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Son descendant ou cloche grave (Décommente quand le fichier existera)
        playSound(require('../../assets/sounds/breathe-out.wav'));
    },

    breatheHold() {
        if (isHapticsEnabled && Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        // Petit "tic" subtil pour marquer le blocage (Décommente quand le fichier existera)
        playSound(require('../../assets/sounds/breathe-hold.wav'));
    },

    // --- 🧘 ÉTIREMENTS (MIXTE) ---

    stretchCountdown() {
        // Un retour haptique léger pour chaque seconde du décompte final
        if (isHapticsEnabled && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Petit 'tic' discret (Décommentez et ajoutez le fichier quand vous l'aurez)
        playSound(require('../../assets/sounds/breathe-hold.wav'));
    },

    stretchEnd() {
        // Un retour haptique bien distinct pour signaler le changement d'étirement
        if (isHapticsEnabled && Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        // Son relaxant, type gong tibétain léger (Décommentez et ajoutez le fichier quand vous l'aurez)
        playSound(require('../../assets/sounds/success.mp3'));
    },
};