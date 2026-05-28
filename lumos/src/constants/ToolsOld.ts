import {
    Anchor, Archive, BatteryCharging,
    Brain,
    BrainCircuit, Cloud, Compass, Crosshair,
    Eye,
    FilterIcon,
    Grid,
    Hand, Hourglass, ListPlus, Mail, MessageCircleHeart,
    Puzzle,
    Rocket,
    ShoppingBag, Swords, Target, Type, Users, Wind,
    Zap
} from 'lucide-react-native';
import { Colors } from './Colors';

export type ToolCategory = 'mental' | 'vision' | 'social' | 'focus' | 'archives' | 'neuro';

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
    // --- 🚨 MENTAL (Urgences & Régulation rapide) ---
    { id: 'breathing', title: "Respiration", desc: "Apaiser instantanément le système nerveux", icon: Wind, color: Colors.primary, category: 'mental' },
    { id: 'reframer', title: "Recadrage Mental", desc: "Transformer une pensée limitante", icon: BrainCircuit, color: "#E91E63", category: 'mental', isPremiumFeature: false },
    { id: 'brainDump', title: "Décharge Cognitive", desc: "Vider son esprit sur le papier", icon: Cloud, color: "#607D8B", category: 'mental' },
    { id: 'grounding', title: "Ancrage Sensoriel", desc: "Revenir au présent face à l'anxiété", icon: Anchor, color: "#4CAF50", category: 'mental' },
    { id: 'boredom', title: "Éloge de l'Ennui", desc: "Restaurer sa capacité d'attention", icon: Hourglass, color: "#FF9800", category: 'mental', isPremiumFeature: false },

    // --- 👁️ VISION (Prise de recul & Philosophie) ---
    { id: 'futureSelf', title: "Lettre au futur", desc: "Écris une lettre à ton futur toi", icon: Mail, color: "#3F51B5", category: 'vision' },
    { id: 'fearSetting', title: "Cartographie des peurs", desc: "Surmonter la paralysie de l'incertitude", icon: Compass, color: "#2196F3", category: 'vision', isPremiumFeature: false },
    { id: 'bisou', title: "Filtre d'Acquisition", desc: "Maîtriser ses pulsions de consommation", icon: ShoppingBag, color: Colors.error, category: 'vision' },
    { id: 'antidote', title: "L'Antidote", desc: "Pratiquer la gratitude radicale", icon: BatteryCharging, color: "#009688", category: 'vision' },
    { id: 'filter', title: "Mes Standards", desc: "Protéger son énergie et son entourage", icon: FilterIcon, color: "#9C27B0", category: 'vision', isPremiumFeature: false },

    // --- 🎯 FOCUS (Le tunnel de concentration) ---
    { id: 'focusSession', title: "Session de Travail", desc: "55 minutes de concentration absolue", icon: Target, color: Colors.primary, category: 'focus' },
    { id: 'flow', title: "Rituel de Concentration", desc: "Préparer son esprit avant l'effort", icon: Rocket, color: "#FF9800", category: 'focus', isPremiumFeature: false },
    { id: 'microSteps', title: 'Micro Étapes', desc: 'Découper une tâche paralysante en micro-actions', icon: ListPlus, color: '#4CAF50', category: 'focus' },

    // --- 💬 SOCIAL (Interactions) ---
    { id: 'dojo', title: "Dojo Social", desc: "Exercices pour vaincre l'inconfort social", icon: Swords, color: "#E91E63", category: 'social' },
    { id: 'social', title: "Briseur de Glace", desc: "Inspirer des échanges authentiques", icon: MessageCircleHeart, color: "#2196F3", category: 'social', isPremiumFeature: false },
    { id: 'bodyLang', title: "Présence & Posture", desc: "Incarner la confiance par le langage corporel", icon: Hand, color: "#4CAF50", category: 'social', isPremiumFeature: false },

    // --- 🧠 NEURO (Entraînement cognitif) ---
    { id: 'memoryMatrix', title: "Matrice Mémorielle", desc: "Améliorer sa mémoire spatiale", icon: Grid, color: "#9C27B0", category: 'neuro', isPremiumFeature: true },
    { id: 'stroop', title: "Réflexe Stroop", desc: "Renforcer son inhibition cognitive", icon: Zap, color: Colors.error, category: 'neuro' },
    { id: 'mathRush', title: "Calcul Éclair", desc: "Augmenter sa vitesse de traitement", icon: Brain, color: "#FF9800", category: 'neuro' },
    { id: 'logicPath', title: "Suite Logique", desc: "Aiguiser son raisonnement analytique", icon: Puzzle, color: "#4CAF50", category: 'neuro', isPremiumFeature: true },
    { id: 'schulte', title: "Table de Schulte", desc: "Élargir sa vision périphérique", icon: Eye, color: "#2196F3", category: 'neuro' },
    { id: 'targetTracker', title: "Traque Cible", desc: "Entraîner son attention divisée", icon: Crosshair, color: "#673AB7", category: 'neuro', isPremiumFeature: true },
    { id: 'wordCascade', title: "Cascade Lexicale", desc: "Entraîner sa fluidité verbale", icon: Type, color: "#009688", category: 'neuro' },
    { id: 'nameRecall', title: "Mémoire Sociale", desc: "Associer visages, prénoms et détails", icon: Users, color: "#8B5CF6", category: 'neuro', isPremiumFeature: true },
    /*{ id: 'nback', title: "Surcharge N-Back", desc: "Muscler sa mémoire de travail", icon: Activity, color: "#2196F3", category: 'neuro' },*/
    // --- 📚 ARCHIVES ---
    { id: 'vault', title: "Coffre-fort", desc: "Explorer les archives de son esprit", icon: Archive, color: Colors.primary, category: 'archives' },
    /*{ id: 'exportData', title: "Sauvegarder", desc: "Exporter la sauvegarde de sa progression", icon: Save, color: "#4CAF50", category: 'archives', isPremiumFeature: true },
    { id: 'importData', title: "Restaurer", desc: "Importer ses données personnelles", icon: Download, color: Colors.primary, category: 'archives', isPremiumFeature: true },*/
];