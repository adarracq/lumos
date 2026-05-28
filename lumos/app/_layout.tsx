import { FloatingToast } from '@/src/components/molecules/FloatingToast';
import { GlobalAlertModal } from '@/src/components/molecules/GlobalAlertModal';
import { notificationService } from '@/src/services/notificationService';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

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

      const setupRevenueCat = async () => {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

        const iosApiKey = 'test_jkYeIEIezOOTSMUKritfDLrRiPf';
        const androidApiKey = 'goog_QksPQPWLjiNcPkgKBeQTNzIoJUO';

        if (Platform.OS === 'ios') {
          await Purchases.configure({ apiKey: iosApiKey });
        } else if (Platform.OS === 'android') {
          await Purchases.configure({ apiKey: androidApiKey });
        }

        // 👇 NOUVEAU : On vérifie le statut réel au démarrage
        try {
          const customerInfo = await Purchases.getCustomerInfo();
          const { useUserStore } = require('@/src/store/useUserStore');
          const setPremium = useUserStore.getState().setPremium;

          // On vérifie si l'utilisateur possède l'accès 'lumos-premium'
          if (typeof customerInfo.entitlements.active['lumos-premium'] !== "undefined") {
            setPremium(true); // L'abonnement est valide
          } else {
            setPremium(false); // L'abonnement a expiré ou n'a jamais existé
          }
        } catch (e) {
          console.error("Erreur de vérification RevenueCat au démarrage", e);
        }

        // Optionnel mais recommandé : Écouter les changements en temps réel (ex: renouvellement en arrière-plan)
        Purchases.addCustomerInfoUpdateListener((info) => {
          const { useUserStore } = require('@/src/store/useUserStore');
          const setPremium = useUserStore.getState().setPremium;

          if (typeof info.entitlements.active['lumos-premium'] !== "undefined") {
            setPremium(true);
          } else {
            setPremium(false);
          }
        });
      };

      const setupNotifications = async () => {
        const hasPermission = await notificationService.requestPermissions();
        if (hasPermission) {
          const { useUserStore } = require('@/src/store/useUserStore');
          const { notifications } = useUserStore.getState();

          if (notifications.morning.enabled) notificationService.scheduleMorningRoutine(notifications.morning.time);
          if (notifications.day.enabled) notificationService.scheduleDayExercise(notifications.day.time);
          if (notifications.evening.enabled) notificationService.scheduleEveningReview(notifications.evening.time);
        }
      };

      setupRevenueCat();
      setupNotifications();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
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