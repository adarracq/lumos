import * as Haptics from 'expo-haptics';
import { useToastStore } from '../store/useToastStore';
import { useUserStore } from '../store/useUserStore';

export const grantXP = async (amount: number) => {
    if (amount === 0) return;

    // 1. Mise à jour des points
    useUserStore.getState().addLumens(amount);

    // 2. Si c'est un gain positif, on déclenche les feedbacks
    if (amount > 0) {
        // Retour haptique dynamique (plus on gagne gros, plus ça vibre fort)
        if (amount >= 20) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            //await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        // Retour visuel
        useToastStore.getState().showToast(`+ ${amount}`);
    }
    // Si amount < 0 (l'utilisateur décoche une case), on retire l'XP silencieusement pour éviter la frustration.
};