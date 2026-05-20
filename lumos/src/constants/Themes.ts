export type RitualFamily = 'BREATHING' | 'JOURNALING' | 'REFLECTION' | 'ACTION';
export type ThemeAxis = 'DISCIPLINE' | 'SERENITE' | 'EMPATHIE' | 'SAGESSE' | 'ANCRAGE';

export interface ThemeDef {
    dayId: number;
    name: string;
    mantra: string;
    ruleLabel: string;
    description: string;
    axis: ThemeAxis;
}

export interface ExerciseDef {
    level: number;
    action: string;
    analysis: string;
}

export interface RitualDef {
    level: number;
    title: string;
    family: RitualFamily;
    description: string;
    durationMin?: number;
}

export interface ThemeContent {
    themeId: number;
    solo: ExerciseDef[];
    social: ExerciseDef[];
    rituals: RitualDef[];
}

export const THEMES: ThemeDef[] = [
    {
        dayId: 1,
        axis: 'SAGESSE',
        name: "Émerveillement",
        mantra: "Je cultive ma curiosité.",
        ruleLabel: "Zéro cynisme",
        description: "Ouvrez les yeux comme si c'était la première fois. La curiosité et la contemplation chassent la lassitude et renouvellent votre esprit."
    },
    {
        dayId: 2,
        axis: 'DISCIPLINE',
        name: "Effort",
        mantra: "L'action bat la perfection.",
        ruleLabel: "Faire le premier pas",
        description: "L'élan se crée par l'action. Réalisez de petites choses pour vaincre la paresse et bâtir une discipline inébranlable."
    },
    {
        dayId: 3,
        axis: 'EMPATHIE',
        name: "Douceur",
        mantra: "Je suis mon propre allié.",
        ruleLabel: "Zéro autocritique",
        description: "Soyez aussi indulgent envers vous-même qu'envers un véritable ami. La vraie force réside dans une douceur maîtrisée et authentique."
    },
    {
        dayId: 4,
        axis: 'SERENITE',
        name: "Humour",
        mantra: "Je choisis la légèreté.",
        ruleLabel: "Dédramatiser les obstacles",
        description: "L’humour est un bouclier mental de taille. Prenez du recul et utilisez l'autodérision pour mieux traverser les petites tempêtes du quotidien."
    },
    {
        dayId: 5,
        axis: 'ANCRAGE',
        name: "Confiance",
        mantra: "Je lâche prise et j'avance.",
        ruleLabel: "Accepter ce qui m'échappe",
        description: "L'ancrage vient de l'acceptation de soi et du monde. Contrôlez vos actions, mais faites confiance à la vie pour le reste."
    },
    {
        dayId: 6,
        axis: 'EMPATHIE',
        name: "Générosité",
        mantra: "Donner enrichit mon âme.",
        ruleLabel: "Offrir sans rien attendre",
        description: "L'ouverture aux autres est la clé de la joie. La véritable générosité ne calcule pas : elle se libère de l'attente d'un retour et combat la rareté."
    },
    {
        dayId: 7,
        axis: 'DISCIPLINE',
        name: "Courage",
        mantra: "Je grandis dans l'inconfort.",
        ruleLabel: "Affronter une peur",
        description: "La véritable croissance se trouve de l'autre côté de l'inconfort. Apprivoisez vos peurs par l'action pour vous en libérer définitivement."
    },
    {
        dayId: 8,
        axis: 'EMPATHIE',
        name: "Bienveillance",
        mantra: "Mon attention est un cadeau.",
        ruleLabel: "L'hypothèse bienveillante",
        description: "En choisissant de voir le bon chez les autres et en leur accordant une écoute totale, vous désamorcez les conflits et nourrissez des liens profonds."
    },
    {
        dayId: 9,
        axis: 'SAGESSE',
        name: "Vérité",
        mantra: "Mes actes reflètent mes paroles.",
        ruleLabel: "Authenticité radicale",
        description: "Le mensonge, même petit, est une charge mentale toxique. La vérité et la sincérité sont le fondement d'un esprit libre et serein."
    },
    {
        dayId: 10,
        axis: 'SAGESSE',
        name: "Souplesse",
        mantra: "J'épouse le flux de la vie.",
        ruleLabel: "Accueillir l'imprévu",
        description: "Le roseau plie mais ne rompt pas. Apprenez à lâcher vos attentes rigides pour vous adapter avec grâce aux imprévus de l'existence."
    },
    {
        dayId: 11,
        axis: 'ANCRAGE',
        name: "Justice",
        mantra: "J'agis avec intégrité et équité.",
        ruleLabel: "Le jugement suspendu",
        description: "L'ancrage véritable exige de traiter soi-même et le monde avec justesse. Refusez de juger hâtivement et ne confondez jamais l'équité avec la vengeance ou l'envie."
    },
    {
        dayId: 12,
        axis: 'ANCRAGE',
        name: "Humilité",
        mantra: "J'ai toujours à apprendre.",
        ruleLabel: "L'ego en veilleuse",
        description: "L'humilité n'est pas de se rabaisser, mais de penser moins à soi-même. Acceptez d'être perfectible : c'est la seule posture qui permet de continuer à grandir."
    },
    {
        dayId: 13,
        axis: 'SERENITE',
        name: "Contentement",
        mantra: "J'ai déjà ce dont j'ai besoin.",
        ruleLabel: "Zéro plainte matérielle",
        description: "Le bonheur n'est pas d'obtenir ce que l'on désire, mais d'apprécier ce que l'on possède déjà. Renouez avec la simplicité pour atteindre la vraie liberté."
    },
    {
        dayId: 14,
        axis: 'SERENITE',
        name: "Gratitude",
        mantra: "Je vois la beauté dans le quotidien.",
        ruleLabel: "Remercier l'évidence",
        description: "La gratitude est le muscle de la joie. Entraînez-vous à reconnaître la valeur des choses simples et silencieuses qui composent votre vie."
    },
    {
        dayId: 15,
        axis: 'DISCIPLINE',
        name: "Prudence",
        mantra: "Je choisis mes batailles.",
        ruleLabel: "L'espace entre stimulus et réponse",
        description: "La prudence n'est pas la peur, c'est la lucidité. Remplacez la réactivité impulsive par l'observation stratégique pour garder la maîtrise de votre vie."
    }, {
        dayId: 16,
        axis: 'DISCIPLINE',
        name: "Tempérance",
        mantra: "Je choisis la voie du milieu.",
        ruleLabel: "Maîtriser ses excès",
        description: "La liberté ne réside pas dans l'assouvissement de toutes ses pulsions, mais dans la capacité à s'en détacher. Fuyez les extrêmes pour trouver votre équilibre."
    },
    {
        dayId: 17,
        axis: 'SERENITE',
        name: "Patience",
        mantra: "J'accepte le rythme naturel des choses.",
        ruleLabel: "Le calme dans l'attente",
        description: "L'urgence est souvent une illusion créée par notre propre anxiété. Apprenez à ralentir : ce qui doit pousser prend du temps, et s'énerver n'accélère rien."
    },
    {
        dayId: 18,
        axis: 'ANCRAGE',
        name: "Service",
        mantra: "En élevant les autres, je m'élève.",
        ruleLabel: "L'aide silencieuse",
        description: "L'humain s'accomplit véritablement lorsqu'il se rend utile au monde. Le leadership sain n'est pas une domination, c'est une mise à disposition de ses forces."
    },
    {
        dayId: 19,
        axis: 'EMPATHIE',
        name: "Pardon",
        mantra: "Je libère le passé pour avancer.",
        ruleLabel: "Laisser glisser",
        description: "Garder rancune, c'est boire du poison en espérant que l'autre meure. Le pardon n'excuse pas la faute, il vous libère de son poids psychologique."
    },
    {
        dayId: 20,
        axis: 'SAGESSE',
        name: "Tolérance",
        mantra: "J'élargis ma carte du monde.",
        ruleLabel: "Accueillir la différence",
        description: "Fuyez le dogmatisme. Acceptez que votre vision du monde n'est qu'une perspective parmi d'autres, et enrichissez-vous au contact de ce qui vous est étranger."
    },
    {
        dayId: 21,
        axis: 'SAGESSE',
        name: "Intégration",
        mantra: "Je suis l'architecte de ma vie.",
        ruleLabel: "Garder l'essentiel",
        description: "C'est la fin de ce cycle et le début du reste de votre vie. Conservez les outils qui ont résonné en vous pour forger votre propre discipline."
    }
];