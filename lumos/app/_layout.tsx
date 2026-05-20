import { FloatingToast } from '@/src/components/molecules/FloatingToast';
import { GlobalAlertModal } from '@/src/components/molecules/GlobalAlertModal';
import { notificationService } from '@/src/services/notificationService';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Empêche le splash screen de disparaître automatiquement
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    InterRegular: Inter_400Regular,
    InterMedium: Inter_500Medium,
    PoppinsSemiBold: Poppins_600SemiBold,
    PoppinsBold: Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();

      const setupNotifications = async () => {
        const hasPermission = await notificationService.requestPermissions();
        if (hasPermission) {
          await notificationService.scheduleEveningReview();
        }
      };

      setupNotifications();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null; // On ne rend rien tant que ce n'est pas prêt
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <FloatingToast />
      <GlobalAlertModal />
    </>
  );
}