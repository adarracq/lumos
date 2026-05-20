import { EXERCISES } from '../constants/Exercises';
import { THEMES } from '../constants/Themes';
import { useUserStore } from '../store/useUserStore';

export const getDailyContent = (totalDaysActive: number) => {
    const themeIndex = (totalDaysActive - 1) % 21;
    const currentTheme = THEMES[themeIndex] || THEMES[0];

    // On récupère les niveaux de l'utilisateur pour ce thème spécifique
    const userLevels = useUserStore.getState().themeLevels[currentTheme.dayId] || { solo: 1, social: 1 };
    const themeExercises = EXERCISES.find(e => e.themeId === currentTheme.dayId) || EXERCISES[0];

    // On cherche l'exercice correspondant au niveau, sinon on prend le dernier niveau dispo
    const solo = themeExercises.solo.find(e => e.level === userLevels.solo) || themeExercises.solo[themeExercises.solo.length - 1];
    const social = themeExercises.social.find(e => e.level === userLevels.social) || themeExercises.social[themeExercises.social.length - 1];

    // Pour le rituel du soir, on peut prendre celui qui correspond au plus haut niveau atteint (ou le lier au type choisi)
    const maxLevel = Math.max(userLevels.solo, userLevels.social);
    const eveningRitual = themeExercises.rituals.find(r => r.level === maxLevel) || themeExercises.rituals[themeExercises.rituals.length - 1];

    return {
        theme: currentTheme,
        levels: userLevels,
        solo,
        social,
        eveningRitual
    };
};