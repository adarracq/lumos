import { useRouter } from 'expo-router';
import {
    ArrowRight,
    ChevronRight,
    ShieldCheck,
    Sparkles,
    Swords,
    Zap
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import { Colors } from '../src/constants/Colors';
import { useUserStore } from '../src/store/useUserStore';

// 1. Définition des données des slides
const ONBOARDING_DATA = [
    {
        id: '1',
        title: 'LUMOS',
        description: 'Éclaire ton chemin. Une approche holistique du développement personnel basée sur la psychologie cognitive et le stoïcisme.',
        icon: Zap,
        color: Colors.primary,
    },
    {
        id: '2',
        title: 'Cycle de 21 Jours',
        description: 'Chaque jour, un nouveau thème (Discipline, Sagesse, Sérénité) pour reprogrammer tes habitudes en profondeur.',
        icon: ShieldCheck,
        color: '#4CAF50',
    },
    {
        id: '3',
        title: 'Solo ou Social',
        description: 'Choisis ton défi quotidien. Travaille sur ton monde intérieur ou muscle ton aisance sociale avec des exercices concrets.',
        icon: Swords,
        color: '#E91E63',
    },
    {
        id: '4',
        title: 'La Boîte à Outils',
        description: 'Accède instantanément à des protocoles d\'urgence : respiration, ancrage contre l\'anxiété, et techniques de négociation.',
        icon: Sparkles,
        color: '#2196F3',
    },
];

export default function OnboardingScreen() {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const setHasSeenOnboarding = useUserStore((state) => state.setHasSeenOnboarding);

    const [currentIndex, setCurrentState] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: any) => {
        setCurrentState(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            setHasSeenOnboarding(true);
            router.replace('/(tabs)');
        }
    };

    // Composant pour chaque slide
    const RenderItem = ({ item }: any) => (
        <View style={[styles.slide, { width }]}>
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}15`, borderColor: `${item.color}30` }]}>
                <item.icon color={item.color} size={80} strokeWidth={1.5} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Le Carrousel */}
            <FlatList
                data={ONBOARDING_DATA}
                renderItem={({ item }) => <RenderItem item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
            />

            {/* Footer : Indicateurs + Bouton */}
            <View style={styles.footer}>
                {/* Points de progression (Dots) */}
                <View style={styles.indicatorContainer}>
                    {ONBOARDING_DATA.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 24, 10],
                            extrapolate: 'clamp',
                        });
                        const opacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });
                        return (
                            <Animated.View
                                key={i.toString()}
                                style={[styles.dot, { width: dotWidth, opacity, backgroundColor: Colors.primary }]}
                            />
                        );
                    })}
                </View>

                {/* Bouton d'action dynamique */}
                <TouchableOpacity
                    style={[styles.button, currentIndex === ONBOARDING_DATA.length - 1 && styles.buttonLast]}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {currentIndex === ONBOARDING_DATA.length - 1 ? 'Commencer' : 'Continuer'}
                    </Text>
                    {currentIndex === ONBOARDING_DATA.length - 1 ? (
                        <ArrowRight color={Colors.background} size={20} />
                    ) : (
                        <ChevronRight color={Colors.background} size={20} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    iconContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
        borderWidth: 1,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontFamily: 'PoppinsBold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    description: {
        fontSize: 16,
        fontFamily: 'InterRegular',
        color: Colors.textMuted,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    footer: {
        height: 150,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 40,
        marginBottom: 40,
    },
    indicatorContainer: {
        flexDirection: 'row',
        height: 64,
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        alignItems: 'center',
        gap: 10,
    },
    buttonLast: {
        paddingHorizontal: 45,
        backgroundColor: Colors.primary,
        // Optionnel : donner un feedback visuel plus fort sur le dernier bouton
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonText: {
        color: Colors.background,
        fontSize: 16,
        fontFamily: 'PoppinsBold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});