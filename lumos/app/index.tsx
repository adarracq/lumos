import { Redirect } from 'expo-router';
import { useUserStore } from '../src/store/useUserStore';

export default function Index() {
    // On récupère l'état depuis Zustand
    const hasSeenOnboarding = useUserStore((state) => state.hasSeenOnboarding);

    // Le composant <Redirect /> gère la navigation proprement et instantanément 
    // sans déclencher d'erreur de "montage".
    if (!hasSeenOnboarding) {
        return <Redirect href="/onboarding" />;
    }

    return <Redirect href="/(tabs)" />;
}