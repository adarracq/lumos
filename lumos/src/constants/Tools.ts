import { Anchor, Archive, BatteryCharging, BrainCircuit, Compass, Download, FilterIcon, Hand, Hourglass, MessageCircleHeart, Rocket, Save, ShoppingBag, Swords, Target, Wind } from 'lucide-react-native';
import { Colors } from './Colors';

export type ToolCategory = 'mental' | 'vision' | 'social' | 'focus' | 'archives';

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
    { id: 'reframer', title: "Recadrage Mental", desc: "Transformer une pensée limitante", icon: BrainCircuit, color: "#E91E63", category: 'mental' },
    { id: 'grounding', title: "Ancrage Sensoriel", desc: "Revenir au présent face à l'anxiété", icon: Anchor, color: "#4CAF50", category: 'mental' },
    { id: 'boredom', title: "Éloge de l'Ennui", desc: "Restaurer sa capacité d'attention", icon: Hourglass, color: "#FF9800", category: 'mental' },

    // --- 👁️ VISION (Prise de recul & Philosophie) ---
    { id: 'fearSetting', title: "Cartographie des peurs", desc: "Surmonter la paralysie de l'incertitude", icon: Compass, color: "#2196F3", category: 'vision' },
    { id: 'bisou', title: "Filtre d'Acquisition", desc: "Maîtriser ses pulsions de consommation", icon: ShoppingBag, color: Colors.error, category: 'vision' },
    { id: 'antidote', title: "L'Antidote", desc: "Pratiquer la gratitude radicale", icon: BatteryCharging, color: "#009688", category: 'vision' },
    { id: 'filter', title: "Mes Standards", desc: "Protéger son énergie et son entourage", icon: FilterIcon, color: "#9C27B0", category: 'vision' },

    // --- 🎯 FOCUS (Le tunnel de concentration) ---
    { id: 'focusSession', title: "Immersion Totale", desc: "Cinquante-cinq minutes de concentration absolue", icon: Target, color: Colors.primary, category: 'focus' },
    { id: 'flow', title: "Rituel de Concentration", desc: "Préparer son esprit avant l'effort", icon: Rocket, color: "#FF9800", category: 'focus' },

    // --- 💬 SOCIAL (Interactions) ---
    { id: 'dojo', title: "Dojo Social", desc: "Exercices pour vaincre l'inconfort social", icon: Swords, color: "#E91E63", category: 'social' },
    { id: 'social', title: "Briser la Glace", desc: "Inspirer des échanges authentiques", icon: MessageCircleHeart, color: "#2196F3", category: 'social' },
    { id: 'bodyLang', title: "Présence & Posture", desc: "Incarner la confiance par le langage corporel", icon: Hand, color: "#4CAF50", category: 'social' },

    // --- 📚 ARCHIVES ---
    { id: 'vault', title: "Coffre-fort", desc: "Explorer les archives de son esprit", icon: Archive, color: Colors.primary, category: 'archives' },
    { id: 'exportData', title: "Sauvegarder", desc: "Exporter la sauvegarde de sa progression", icon: Save, color: "#4CAF50", category: 'archives', isPremiumFeature: true },
    { id: 'importData', title: "Restaurer", desc: "Importer ses données personnelles", icon: Download, color: Colors.primary, category: 'archives', isPremiumFeature: true },
];