import {
    Anchor, BatteryCharging, Brain, BrainCircuit, Cloud, Compass, Crosshair,
    Eye,
    FilterIcon,
    Grid, Hand, Hourglass, ListPlus, Mail, MessageCircleHeart,
    Puzzle, Rocket, ShoppingBag, Swords, Target, Type, Users, Wind, Zap
} from 'lucide-react-native';
import { Colors } from './Colors';

// Nouvelles catégories orientées "Cas d'usage"
export type ToolCategory = 'sos' | 'focus' | 'vision' | 'neuro' | 'theory';

export interface ToolDef {
    id: string;
    title: string;
    desc: string;
    icon: any; // Lucide Icon
    color: string;
    category: ToolCategory;
    isPremiumFeature?: boolean;
}

export const TOOLS_CATALOG: ToolDef[] = [
    // --- 🚨 SOS (Urgences & Régulation : Que des outils gratuits de "premiers secours") ---
    { id: 'breathing', title: "Relaxation", desc: "Apaiser le système nerveux (Respiration).", icon: Wind, color: Colors.primary, category: 'sos' },
    { id: 'brainDump', title: "Surcharge mentale", desc: "Vider ses pensées sur le papier.", icon: Cloud, color: "#607D8B", category: 'sos', isPremiumFeature: true },
    { id: 'bisou', title: "Pulsion d'achat", desc: "Passer l'envie d'achat compulsive.", icon: ShoppingBag, color: Colors.error, category: 'sos', isPremiumFeature: true },
    { id: 'grounding', title: "Stress & Angoisse", desc: "S'ancrer dans le présent.", icon: Anchor, color: "#4CAF50", category: 'sos' },

    // --- 🎯 FOCUS (Action & Productivité) ---
    { id: 'microSteps', title: "Paralysie face à la tâche", desc: "Découper l'insurmontable.", icon: ListPlus, color: '#4CAF50', category: 'focus', isPremiumFeature: true },
    { id: 'flow', title: "Rituel de Concentration", desc: "Conditionner son esprit avant l'effort.", icon: Rocket, color: "#FF9800", category: 'focus' },
    { id: 'focusSession', title: "Session de Travail", desc: "55 minutes de concentration.", icon: Target, color: Colors.primary, category: 'focus' },
    { id: 'boredom', title: "Éloge de l'Ennui", desc: "Sevrer son cerveau de la dopamine.", icon: Hourglass, color: "#9C27B0", category: 'focus', isPremiumFeature: true },

    // --- 👁️ VISION (Clarté, Recul & Dépassement de soi) ---
    { id: 'dojo', title: "Défis sociaux", desc: "Sortir de sa zone de confort.", icon: Swords, color: "#E91E63", category: 'vision' },
    { id: 'antidote', title: "Baisse de moral", desc: "Pratiquer la gratitude radicale.", icon: BatteryCharging, color: "#009688", category: 'vision', isPremiumFeature: true },
    { id: 'fearSetting', title: "Peur de l'échec", desc: "Oser se lancer.", icon: Compass, color: "#2196F3", category: 'vision', isPremiumFeature: true },
    { id: 'futureSelf', title: "Perte de sens", desc: "Écrire une lettre à son futur soi.", icon: Mail, color: "#3F51B5", category: 'vision' },

    // --- 🧠 NEURO (La salle de sport cognitive - 4 gratuits, 4 Premium) ---
    { id: 'memoryMatrix', title: "Matrice Mémorielle", desc: "Améliorer sa mémoire spatiale.", icon: Grid, color: "#9C27B0", category: 'neuro' },
    { id: 'mathRush', title: "Calcul Éclair", desc: "Augmenter sa vitesse de traitement.", icon: Brain, color: "#FF9800", category: 'neuro' },
    { id: 'wordCascade', title: "Cascade Lexicale", desc: "Entraîner sa fluidité verbale.", icon: Type, color: "#009688", category: 'neuro' },
    { id: 'targetTracker', title: "Traque Cible", desc: "Entraîner son attention divisée.", icon: Crosshair, color: "#673AB7", category: 'neuro' },

    { id: 'stroop', title: "Réflexe Stroop", desc: "Muscler son inhibition cognitive.", icon: Zap, color: Colors.error, category: 'neuro', isPremiumFeature: true },
    { id: 'logicPath', title: "Suite Logique", desc: "Aiguiser son raisonnement analytique.", icon: Puzzle, color: "#4CAF50", category: 'neuro', isPremiumFeature: true },
    { id: 'schulte', title: "Table de Schulte", desc: "Élargir sa vision périphérique.", icon: Eye, color: "#2196F3", category: 'neuro', isPremiumFeature: true },
    { id: 'nameRecall', title: "Mémoire Sociale", desc: "Associer visages, prénoms et détails.", icon: Users, color: "#8B5CF6", category: 'neuro', isPremiumFeature: true },

    // --- 📚 THÉORIE (Mise de côté / Bibliothèque de savoir) ---
    { id: 'reframer', title: "Recadrage Mental", desc: "Identifier les biais cognitifs.", icon: BrainCircuit, color: "#E91E63", category: 'theory' },
    { id: 'social', title: "Briseurs de Glace", desc: "Inspirer des échanges authentiques.", icon: MessageCircleHeart, color: "#2196F3", category: 'theory', isPremiumFeature: true },
    { id: 'bodyLang', title: "Présence & Posture", desc: "Incarner la confiance.", icon: Hand, color: "#4CAF50", category: 'theory' },
    { id: 'filter', title: "Filtres sociaux", desc: "Définir ses standards et se protéger.", icon: FilterIcon, color: "#9C27B0", category: 'theory', isPremiumFeature: true },
];