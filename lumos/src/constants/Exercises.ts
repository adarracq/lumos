import { ThemeContent } from './Themes';

export const EXERCISES: ThemeContent[] = [
    {
        themeId: 1, // Émerveillement
        solo: [
            { level: 1, action: "Regarder le ciel ou un élément naturel pendant 2 minutes sans but.", analysis: "Réinitialise l'attention visuelle et calme le mental sur-stimulé." },
            { level: 2, action: "Prendre un chemin totalement différent pour un trajet habituel.", analysis: "Casse l'automatisme cérébral et force le cerveau à observer la nouveauté." },
            { level: 3, action: "Goûter ou sentir un aliment les yeux fermés en analysant chaque texture.", analysis: "La privation visuelle décuple les autres sens et ramène à l'instant présent." },
            { level: 4, action: "Chercher l'histoire ou la fabrication d'un objet banal de votre quotidien.", analysis: "Transforme l'ordinaire en extraordinaire en ravivant la curiosité intellectuelle." },
            { level: 5, action: "Passer 2 heures sans montre ni téléphone, juste pour observer le monde.", analysis: "Déconnexion totale pour forcer l'émerveillement brut et briser l'urgence du temps." }
        ],
        social: [
            { level: 1, action: "Remarquer et féliciter un détail inédit chez quelqu'un (un accessoire, une intonation).", analysis: "Force à observer l'autre avec un œil neuf et bienveillant." },
            { level: 2, action: "Poser une question sur une passion d'un proche que vous ne connaissez pas du tout.", analysis: "Ouvre une fenêtre sur l'univers de l'autre via une curiosité authentique." },
            { level: 3, action: "Écouter quelqu'un raconter une histoire de A à Z sans l'interrompre pour parler de soi.", analysis: "L'émerveillement relationnel passe par la capacité à s'effacer pour vraiment écouter." },
            { level: 4, action: "Engager la conversation avec un inconnu sur un détail précis de l'environnement actuel.", analysis: "Créer du lien spontané à partir d'une observation poétique ou amusante partagée." },
            { level: 5, action: "Faire le 'touriste' dans sa propre ville avec un ami : visiter un lieu jamais vu.", analysis: "Partager physiquement un état d'esprit de découverte et casser la routine sociale." }
        ],
        rituals: [
            { level: 1, title: "Gratitude", family: "JOURNALING", description: "Note 3 petites choses belles, surprenantes ou agréables vues aujourd'hui." },
            { level: 2, title: "Respiration des 5 Sens", family: "BREATHING", durationMin: 3, description: "Inspire calmement en identifiant 5 choses que tu vois, 4 que tu touches, 3 que tu entends." }
        ]
    },
    {
        themeId: 2, // Effort
        solo: [
            { level: 1, action: "Faire son lit de manière impeccable dès le lever.", analysis: "Première victoire de la journée : elle crée l'élan pour toutes les actions suivantes." },
            { level: 2, action: "Consacrer 10 minutes chrono à une tâche repoussée depuis longtemps.", analysis: "Franchir la barrière de l'initiation est le plus dur ; l'action appelle l'action." },
            { level: 3, action: "Terminer sa douche par 30 secondes d'eau froide.", analysis: "Prendre une décision physiquement inconfortable forge la résilience et la discipline." },
            { level: 4, action: "Travailler ou lire pendant 45 minutes non-stop en coupant toutes les notifications.", analysis: "Le 'Deep Work' muscle l'endurance mentale face aux distractions modernes." },
            { level: 5, action: "Accomplir la tâche la plus difficile de la journée (la grenouille) avant 10h du matin.", analysis: "Libère instantanément d'une charge mentale massive pour le reste du jour." }
        ],
        social: [
            { level: 1, action: "Répondre immédiatement à un message ou mail que l'on faisait traîner.", analysis: "Ne pas laisser la dette sociale s'accumuler et peser sur l'esprit." },
            { level: 2, action: "Proposer spontanément son aide pour une tâche ingrate ou physique (porter un truc, nettoyer).", analysis: "L'effort gratuit au service d'autrui forge le caractère et l'humilité." },
            { level: 3, action: "Garder son téléphone totalement hors de vue lors d'un repas à plusieurs.", analysis: "L'effort de la présence absolue est rare et extrêmement valorisant pour les autres." },
            { level: 4, action: "S'engager auprès d'un proche à terminer un projet précis aujourd'hui.", analysis: "Utiliser la pression sociale et la responsabilité pour s'obliger à agir." },
            { level: 5, action: "Prendre la responsabilité d'un échec ou assumer une erreur ouvertement devant les autres.", analysis: "L'effort moral ultime : mater son ego pour privilégier l'intégrité." }
        ],
        rituals: [
            { level: 1, title: "Bilan froid", family: "REFLECTION", description: "Analyse factuelle : note 1 action accomplie et 1 excuse que tu t'es donnée aujourd'hui." },
            { level: 2, title: "Visualisation de l'Obstacle", family: "REFLECTION", durationMin: 3, description: "Visualise ton principal défi de demain et vois-toi en train de le commencer avec calme." }
        ]
    },
    {
        themeId: 3, // Douceur
        solo: [
            { level: 1, action: "Remplacer immédiatement une pensée auto-dévalorisante par une observation neutre.", analysis: "Désamorce le critique intérieur. Remplace 'je suis nul' par 'cette tâche est ardue'." },
            { level: 2, action: "S'accorder 15 minutes de repos total et silencieux, sans aucune culpabilité.", analysis: "Accepter que le repos n'est pas de la paresse, mais un besoin physiologique." },
            { level: 3, action: "Écrire 3 qualités précises que vous appréciez réellement chez vous.", analysis: "Renforcer l'estime de soi avec la même bienveillance qu'on aurait pour un ami." },
            { level: 4, action: "Se masser les mains, la nuque ou le visage avec conscience pendant 5 minutes.", analysis: "Reconnexion physique : le corps a besoin de ressentir le réconfort pour s'apaiser." },
            { level: 5, action: "Se pardonner une erreur du passé par écrit, puis détruire le papier.", analysis: "La libération émotionnelle profonde passe par l'acte symbolique de clore un dossier." }
        ],
        social: [
            { level: 1, action: "Sourire sincèrement à une personne inconnue croisée dans la journée.", analysis: "Diffuser de la douceur passivement déclenche des neurones miroirs positifs." },
            { level: 2, action: "Parler avec une voix volontairement plus douce et posée toute la journée.", analysis: "Modifier consciemment l'énergie de l'interaction apaise l'interlocuteur et soi-même." },
            { level: 3, action: "Laisser passer quelqu'un devant soi (dans une file, dans la circulation).", analysis: "Un micro-acte de douceur anonyme qui brise l'urgence et la compétition." },
            { level: 4, action: "Offrir un moment de répit à un proche (faire une corvée à sa place, préparer un repas).", analysis: "La douceur s'incarne magnifiquement dans le service silencieux." },
            { level: 5, action: "Répondre par le silence ou une phrase douce à une remarque piquante/stressée.", analysis: "Briser net le cycle de la réactivité émotionnelle et de l'escalade conflictuelle." }
        ],
        rituals: [
            { level: 1, title: "Auto-Compassion", family: "REFLECTION", description: "Passe ta main sur ton cœur et dis-toi mentalement : 'J'ai fait de mon mieux aujourd'hui'." },
            { level: 2, title: "Scan Corporel Doux", family: "BREATHING", durationMin: 5, description: "Observe chaque zone de ton corps avec indulgence, en relâchant les tensions à l'expiration." }
        ]
    },
    {
        themeId: 4, // Humour
        solo: [
            { level: 1, action: "Consommer 10 minutes de contenu purement comique (stand-up, bêtisier, podcast drôle).", analysis: "Déclencher chimiquement la bonne humeur via la libération d'endorphines." },
            { level: 2, action: "Se sourire à soi-même dans le miroir pendant 30 secondes au réveil.", analysis: "Bio-hacking du cerveau : le mouvement des zygomatiques signale au corps que tout va bien." },
            { level: 3, action: "Trouver un angle absurde ou comique à un léger désagrément du jour (pluie, retard).", analysis: "Recadrage cognitif : refuser de laisser un petit événement gâcher l'humeur." },
            { level: 4, action: "Imaginer une situation stressante avec une musique de cirque en fond mentalement.", analysis: "Dédramatiser par la visualisation ridicule brise la gravité d'un problème." },
            { level: 5, action: "Rire volontairement et à voix haute de sa propre maladresse dès qu'elle survient.", analysis: "Tuer l'ego par l'autodérision est le super-pouvoir de la sérénité." }
        ],
        social: [
            { level: 1, action: "Partager un meme, une image ou une courte blague sans contexte à un proche.", analysis: "Créer une micro-connexion positive par le rire gratuit." },
            { level: 2, action: "Raconter une erreur ou un moment gênant récent de manière totalement exagérée.", analysis: "La vulnérabilité humoristique met les autres à l'aise et brise la glace." },
            { level: 3, action: "Répondre à une remarque tendue par une phrase légère (sans sarcasme ni attaque).", analysis: "Désamorcer la tension sociale en agissant comme un paratonnerre émotionnel." },
            { level: 4, action: "Se donner comme mission de faire sourire ou rire un inconnu (commerçant, voisin).", analysis: "Sortir de sa zone de confort sociale pour apporter de la joie dans un échange banal." },
            { level: 5, action: "Proposer ou participer à un jeu/activité avec des proches où le ridicule est garanti.", analysis: "Le lâcher-prise social absolu renforce immensément la complicité de groupe." }
        ],
        rituals: [
            { level: 1, title: "Le Journal du Rire", family: "JOURNALING", description: "Note la chose la plus drôle ou la plus absurde qui te soit arrivée ou passée par la tête aujourd'hui." },
            { level: 2, title: "Respiration du Ventre", family: "BREATHING", durationMin: 3, description: "Inspire profondément en gonflant le ventre (comme le Bouddha rieur). Lâche la pression corporelle." }
        ]
    },
    {
        themeId: 5, // Confiance
        solo: [
            { level: 1, action: "S'habiller avec le vêtement qui donne le plus d'assurance ou de prestance.", analysis: "Enclothed cognition : la tenue extérieure influence directement la posture mentale intérieure." },
            { level: 2, action: "Lister 3 défis majeurs ou périodes difficiles que vous avez déjà surmontés.", analysis: "Rappeler au cerveau ses propres preuves de résilience pour affronter le présent." },
            { level: 3, action: "Prendre une posture d'expansion (Power Pose - bras en V, torse bombé) pendant 2 minutes.", analysis: "Bio-hacking prouvé pour augmenter la testostérone et baisser l'hormone du stress." },
            { level: 4, action: "Prendre une décision concrète sans demander l'avis ni la validation de personne.", analysis: "Renforcer l'autonomie et faire confiance à son intuition." },
            { level: 5, action: "Déléguer ou abandonner totalement le contrôle sur une tâche ou un événement de la journée.", analysis: "L'ultime confiance est d'accepter que le monde tourne même sans notre micro-management." }
        ],
        social: [
            { level: 1, action: "Soutenir le regard (avec un léger sourire) lors des interactions de la journée.", analysis: "Le regard droit est le premier marqueur physique d'une saine assurance en société." },
            { level: 2, action: "Dire 'Je ne sais pas' à une question sans chercher à se justifier ou s'excuser.", analysis: "La véritable confiance consiste à assumer ses limites sans sentir sa valeur menacée." },
            { level: 3, action: "Exprimer une opinion minoritaire ou différente dans un groupe, avec calme.", analysis: "Détacher son estime de soi du besoin viscéral d'approbation sociale." },
            { level: 4, action: "Dire un 'Non' ferme et courtois à une sollicitation qui ne vous convient pas.", analysis: "Protéger son espace et son énergie avec assertivité montre que l'on se respecte." },
            { level: 5, action: "Aborder un inconnu ou une figure d'autorité pour entamer volontairement la discussion.", analysis: "Vaincre l'anxiété de statut en initiant soi-même l'interaction sociale." }
        ],
        rituals: [
            { level: 1, title: "Célébration Silencieuse", family: "ACTION", description: "Ferme le poing et dis-toi 'Yes' intérieurement pour avoir osé être toi-même aujourd'hui." },
            { level: 2, title: "Visualisation de Réussite", family: "REFLECTION", durationMin: 3, description: "Visualise le meilleur scénario possible pour ton prochain grand défi de la semaine." }
        ]
    },
    {
        themeId: 6, // Générosité
        solo: [
            { level: 1, action: "Sélectionner 3 objets, vêtements ou livres en bon état à donner.", analysis: "L'acte physique de se délester prépare mentalement à l'abondance et tue l'attachement matériel." },
            { level: 2, action: "Laisser la monnaie ou un généreux pourboire lors d'un achat quotidien.", analysis: "Se détacher de la peur de 'manquer' en faisant circuler la valeur financière." },
            { level: 3, action: "Faire un don financier (même modeste) à une association ou un créateur, de façon anonyme.", analysis: "Donner dans l'anonymat purifie l'acte : l'ego n'en retire aucune gloire publique." },
            { level: 4, action: "Dédier 30 minutes exclusives à son propre bien-être (bain, lecture).", analysis: "On ne peut pas verser d'une carafe vide. La générosité commence par l'auto-préservation." },
            { level: 5, action: "Payer secrètement l'addition, le café ou le péage de la personne derrière soi.", analysis: "Générer un moment de magie dans la journée d'un inconnu, sans récolter de remerciements." }
        ],
        social: [
            { level: 1, action: "Partager spontanément une ressource utile (article, contact, outil) à quelqu'un.", analysis: "Mettre son réseau ou son savoir au service de l'autre sans attendre qu'on le demande." },
            { level: 2, action: "Faire un compliment précis et inattendu sur le travail ou la personnalité d'un proche.", analysis: "La générosité verbale crée un ancrage positif et renforce durablement l'estime de l'autre." },
            { level: 3, action: "Céder sa place, son tour ou son avantage dans une file d'attente ou les transports.", analysis: "Lâcher la mentalité de compétition urbaine pour privilégier le confort d'autrui." },
            { level: 4, action: "Rendre un service qui vous demande du temps, sans que l'autre l'ait demandé.", analysis: "Anticiper un besoin (faire une course, ranger un espace) prouve une attention totale." },
            { level: 5, action: "Consacrer 1h pour aider un proche sur son projet, sans en tirer aucun bénéfice.", analysis: "Faire don de sa ressource la plus précieuse et irremplaçable : son propre temps." }
        ],
        rituals: [
            { level: 1, title: "Lettre de gratitude", family: "JOURNALING", description: "Écris pourquoi tu es reconnaissant envers quelqu'un. (Tu peux choisir de lui envoyer ou non)." },
            { level: 2, title: "Bilan des dons", family: "REFLECTION", durationMin: 2, description: "Avant de dormir, demande-toi : 'Qu'est-ce que j'ai apporté au monde aujourd'hui ?'" }
        ]
    },
    {
        themeId: 7, // Courage
        solo: [
            { level: 1, action: "Identifier par écrit une peur irrationnelle qui vous freine aujourd'hui.", analysis: "Mettre des mots sur l'anxiété la sort de l'inconscient et en réduit instantanément la taille." },
            { level: 2, action: "Faire une activité habituellement sociale seul (aller au restaurant, au cinéma).", analysis: "Affronter la peur du jugement et cultiver l'indépendance émotionnelle complète." },
            { level: 3, action: "Prendre une douche complètement froide pendant 1 minute.", analysis: "Démontrer à son cerveau primitif que le corps peut survivre à un inconfort intense et volontaire." },
            { level: 4, action: "Prendre une décision concrète sur un sujet procrastiné par peur de se tromper.", analysis: "Le courage d'avancer malgré l'incertitude détruit la paralysie de l'analyse." },
            { level: 5, action: "S'exposer à un petit 'rejet' volontaire (ex: demander une réduction impossible en magasin).", analysis: "Désensibilisation à l'échec et au 'Non', libérant une audace phénoménale pour la suite." }
        ],
        social: [
            { level: 1, action: "Soutenir calmement le regard des personnes croisées dans la rue, avec bienveillance.", analysis: "Le contact visuel est la base de la présence et de la confiance face au monde extérieur." },
            { level: 2, action: "Aborder un inconnu pour demander l'heure, un chemin ou faire un commentaire neutre.", analysis: "Briser la barrière de l'anxiété d'approche par une interaction sociale inoffensive." },
            { level: 3, action: "Dire un vrai 'Non' à une demande sociale sans inventer de fausse excuse.", analysis: "Le courage de poser ses limites et d'accepter de décevoir pour se respecter soi-même." },
            { level: 4, action: "Prendre la parole pour exprimer son idée lors d'une réunion ou d'un groupe.", analysis: "Affronter le syndrome de l'imposteur et assumer publiquement sa valeur intellectuelle." },
            { level: 5, action: "Avoir une conversation difficile ou un conflit constructif repoussé depuis longtemps.", analysis: "Le courage ultime : purger une relation de ses non-dits pour retrouver une vraie paix." }
        ],
        rituals: [
            { level: 1, title: "Célébration du Cran", family: "JOURNALING", description: "Écris la chose la plus audacieuse (même minime) que tu as faite aujourd'hui." },
            { level: 2, title: "Respiration de l'Ancrage", family: "BREATHING", durationMin: 3, description: "Debout, inspire profondément en imaginant des racines sous tes pieds. Expire en relâchant les épaules." }
        ]
    },
    {
        themeId: 8, // Bienveillance
        solo: [
            { level: 1, action: "Boire un grand verre d'eau et formuler un remerciement mental à son corps.", analysis: "Installer la bienveillance à la racine : la gratitude pour son propre véhicule physique." },
            { level: 2, action: "Éviter de consommer toute information négative (faits divers, clashs) toute la journée.", analysis: "Le régime mental : on ne peut pas être bienveillant en nourrissant son esprit de colère." },
            { level: 3, action: "Face à une contrariété, se forcer à trouver 3 aspects positifs à la situation.", analysis: "Entraîner la neuroplasticité à chercher l'opportunité plutôt que la victimisation." },
            { level: 4, action: "Pardonner mentalement à une personne qui a été rude ou maladroite aujourd'hui.", analysis: "Le pardon immédiat évite d'accumuler le poison de la rancune dans son propre esprit." },
            { level: 5, action: "Pratiquer 10 min de méditation 'Metta' (souhaiter sincèrement du bien à ses ennemis).", analysis: "L'exercice absolu de l'empathie : détacher son ego pour rayonner une bonté inconditionnelle." }
        ],
        social: [
            { level: 1, action: "Laisser quelqu'un parler pendant 2 minutes sans proposer de solution, juste écouter.", analysis: "La bienveillance pure est souvent d'offrir un espace d'expression, pas des conseils." },
            { level: 2, action: "Remplacer une critique qui allait sortir par une suggestion constructive et douce.", analysis: "Casser le réflexe de la critique stérile pour devenir un moteur d'élévation." },
            { level: 3, action: "Prendre la défense d'une personne absente lors d'une discussion ou d'un potin.", analysis: "La loyauté envers les absents est la marque des esprits les plus nobles et bienveillants." },
            { level: 4, action: "Appliquer 'l'hypothèse bienveillante' à quelqu'un qui fait une erreur ou vous coupe la route.", analysis: "Présumer l'ignorance, le stress ou la maladresse plutôt que la malice volontaire." },
            { level: 5, action: "Envoyer un message de soutien profond à quelqu'un qui traverse une tempête.", analysis: "Sortir de son propre monde pour devenir un pilier de chaleur humaine pour un autre." }
        ],
        rituals: [
            { level: 1, title: "L'Hypothèse Positve", family: "REFLECTION", description: "Pense à une interaction frustrante du jour, et trouve une raison non-malveillante à l'action de l'autre." },
            { level: 2, title: "Cohérence Cardiaque 5/5", family: "BREATHING", durationMin: 5, description: "Inspire 5s, expire 5s. Apaise le rythme cardiaque et favorise l'ouverture émotionnelle." }
        ]
    },
    {
        themeId: 9, // Vérité
        solo: [
            { level: 1, action: "Identifier et écrire le mensonge que l'on se raconte le plus souvent ('je n'ai pas le temps').", analysis: "Prendre conscience de ses rationalisations est le premier pas vers l'intégrité personnelle." },
            { level: 2, action: "Surveiller et supprimer les mots exagérés de ses pensées ('toujours', 'jamais', 'tout le monde').", analysis: "La vérité exige de la précision. L'exagération biaise l'esprit vers le drame." },
            { level: 3, action: "Regarder en face une réalité évitée (vérifier son compte en banque, monter sur la balance).", analysis: "Détruire le déni protecteur pour s'ancrer dans le réel factuel, seul terrain d'action possible." },
            { level: 4, action: "Tenir un carnet de notes strict sur sa journée, sans embellir ni omettre ses erreurs.", analysis: "L'objectivité radicale face à soi-même détruit l'ego et favorise l'apprentissage pur." },
            { level: 5, action: "S'avouer à voix haute un désir, une envie ou une ambition qu'on n'osait pas s'avouer.", analysis: "L'alignement total entre ce que l'on ressent au fond de soi et ce que l'on accepte de voir." }
        ],
        social: [
            { level: 1, action: "Répondre honnêtement à la question 'Ça va ?' plutôt que d'utiliser le pilote automatique.", analysis: "Casser l'hypocrisie sociale de base, sans pour autant se plaindre lourdement." },
            { level: 2, action: "Refuser de donner une 'fausse excuse' polie pour annuler ou refuser un engagement.", analysis: "Assumer ses vrais motifs force le respect et simplifie les relations à long terme." },
            { level: 3, action: "Donner un avis sincère, mais avec tact, lorsqu'une personne vous le demande.", analysis: "La complaisance est un mensonge confortable. La vérité bien amenée est une preuve d'amour." },
            { level: 4, action: "Avouer et corriger immédiatement une petite exagération que l'on vient de dire oralement.", analysis: "Rattraper son propre ego en vol ('En fait non, j'exagère, c'était plutôt...') force l'humilité." },
            { level: 5, action: "Révéler publiquement (ou à un groupe) une de ses vulnérabilités ou incompétences.", analysis: "Faire tomber le masque de la perfection libère de la peur d'être démasqué un jour." }
        ],
        rituals: [
            { level: 1, title: "Audit Factuel", family: "REFLECTION", description: "Note 1 succès réel et 1 échec assumé de la journée. Juste les faits, aucune émotion." },
            { level: 2, title: "Scan Corporel de Vérité", family: "BREATHING", durationMin: 5, description: "Observe les tensions dans ton corps. Où se logent tes résistances ou tes non-dits aujourd'hui ?" }
        ]
    },
    {
        themeId: 10, // Souplesse
        solo: [
            { level: 1, action: "Réaliser 5 minutes d'étirements doux (la souplesse du corps influence celle de l'esprit).", analysis: "Le bio-mimétisme intérieur : dénouer la rigidité musculaire signale au cerveau de s'assouplir." },
            { level: 2, action: "Manger un plat inconnu ou écouter un genre musical que l'on n'écoute jamais.", analysis: "Casser les micro-habitudes crée de nouvelles voies neuronales et repousse la sclérose mentale." },
            { level: 3, action: "Lire un article ou écouter une vidéo qui défend le point de vue inverse du sien.", analysis: "Exposer son cerveau à la dissonance cognitive pour comprendre plutôt que pour contrer." },
            { level: 4, action: "Casser totalement sa routine du soir et se laisser guider par l'instinct ou le hasard.", analysis: "S'entraîner à naviguer sans carte de route prédéfinie pour combattre le besoin de contrôle." },
            { level: 5, action: "Accepter avec le sourire un imprévu majeur de la journée, sans chercher de coupable.", analysis: "L'Amor Fati stoïcien : non seulement accepter ce qui arrive, mais l'embrasser comme une opportunité." }
        ],
        social: [
            { level: 1, action: "S'adapter physiquement au rythme de l'autre (marcher à son pas, parler à son volume).", analysis: "La synchronisation physique est le premier palier de l'empathie et de la souplesse relationnelle." },
            { level: 2, action: "Dire 'Tu as peut-être raison' lors d'un débat mineur pour laisser glisser.", analysis: "Renoncer à avoir le dernier mot économise une énergie précieuse et désamorce l'ego." },
            { level: 3, action: "Répondre à une critique ou une remarque par l'humour plutôt que par la défensive.", analysis: "Esquiver le choc frontal à la manière de l'Aïkido : utiliser l'énergie pour détendre la situation." },
            { level: 4, action: "Laisser quelqu'un d'autre choisir le lieu, le film ou le repas sans imposer de préférence.", analysis: "Lâcher le besoin de diriger le groupe et se laisser porter par les choix des autres." },
            { level: 5, action: "Changer d'avis publiquement en reconnaissant ouvertement la validité d'un autre argument.", analysis: "L'apogée de la souplesse intellectuelle : détacher son identité de ses propres opinions." }
        ],
        rituals: [
            { level: 1, title: "L'art du Pivot", family: "JOURNALING", description: "Écris comment tu t'es adapté (ou aurais dû t'adapter) à un imprévu aujourd'hui." },
            { level: 2, title: "Respiration de l'Eau", family: "BREATHING", durationMin: 3, description: "Inspire avec fluidité, expire sans marquer de pause, comme des vagues continues." }
        ]
    },
    {
        themeId: 11, // Justice
        solo: [
            { level: 1, action: "Équilibrer son temps : supprimer ou déléguer une tâche inutile aujourd'hui.", analysis: "La justice commence par l'équilibre de son propre emploi du temps et le respect de son énergie." },
            { level: 2, action: "Identifier un biais cognitif ou un préjugé que l'on a entretenu récemment.", analysis: "L'objectivité radicale envers soi-même nettoie les filtres qui faussent notre vision du monde." },
            { level: 3, action: "Ne pas prendre parti dans sa tête face à une situation en ligne (news, drama) incomplète.", analysis: "S'entraîner à la suspension du jugement face au tribunal médiatique ou émotionnel." },
            { level: 4, action: "Se rendre justice à soi-même : annuler un engagement qui ne respecte plus vos limites.", analysis: "Le coût irrécupérable est un piège. Savoir s'arrêter est un acte d'équité envers soi-même." },
            { level: 5, action: "Faire 'l'avocat du diable' par écrit sur une de ses propres convictions profondes.", analysis: "L'ultime honnêteté intellectuelle : prouver que l'on peut comprendre parfaitement l'argument adverse." }
        ],
        social: [
            { level: 1, action: "Partager équitablement le temps de parole (écouter autant qu'on parle).", analysis: "La justice dans la communication est de ne pas monopoliser l'attention." },
            { level: 2, action: "Reconnaître publiquement ou mentalement le mérite d'un adversaire ou d'un concurrent.", analysis: "Détacher son ego pour accorder le crédit là où il est légitimement dû." },
            { level: 3, action: "Défendre son espace ou son temps calmement (ex : 'J'ai besoin d'une heure de focus').", analysis: "Tracer une frontière claire et juste avec les autres, sans utiliser la moindre agressivité." },
            { level: 4, action: "Réclamer ce qui vous est dû sereinement (un remboursement, un retour, un respect de contrat).", analysis: "Revendiquer son droit sans émotion toxique est la base de l'assertivité en société." },
            { level: 5, action: "Intervenir (même subtilement) pour défendre une personne traitée injustement ou moquée.", analysis: "L'incarnation pure de la justice morale en bravant la pression du conformisme social." }
        ],
        rituals: [
            { level: 1, title: "L'Audit des Frontières", family: "REFLECTION", description: "Identifie une limite (temps, énergie) qui a été franchie aujourd'hui et comment la protéger demain." },
            { level: 2, title: "Respiration de la Balance", family: "BREATHING", durationMin: 3, description: "Inspire 4s (recevoir), expire 4s (donner). Trouve l'équilibre parfait entre l'intérieur et l'extérieur." }
        ]
    },
    {
        themeId: 12, // Humilité
        solo: [
            { level: 1, action: "Faire une petite tâche ménagère/utile pour la communauté, de manière totalement invisible.", analysis: "Le service silencieux détruit le besoin de validation externe et flatte la modestie." },
            { level: 2, action: "S'informer pendant 15 minutes sur un sujet complexe où l'on est un débutant absolu.", analysis: "Redevenir un débutant combat la complaisance et relance l'émerveillement intellectuel." },
            { level: 3, action: "S'abstenir de se regarder dans les miroirs ou de vérifier ses notifications/likes de la journée.", analysis: "Affamer l'ego numérique et narcissique pour se recentrer sur l'être, et non le paraître." },
            { level: 4, action: "Identifier une décision passée où l'on était persuadé d'avoir raison, et admettre qu'on avait tort.", analysis: "Accepter ses failles avec le recul permet de ne plus lier son identité à ses opinions." },
            { level: 5, action: "Faire une activité créative ou sportive où l'on est mauvais, et accepter joyeusement d'être nul.", analysis: "L'humilité la plus libératrice : s'autoriser à être imparfait sans que l'ego n'en souffre." }
        ],
        social: [
            { level: 1, action: "Demander de l'aide pour une petite chose, même si on pourrait le faire seul.", analysis: "Montrer sa vulnérabilité donne à l'autre l'occasion d'être utile et valorisé." },
            { level: 2, action: "Dire 'Je ne sais pas, tu peux m'expliquer ?' plutôt que de feindre la connaissance.", analysis: "Assumer son ignorance est paradoxalement une immense preuve de confiance en soi." },
            { level: 3, action: "Laisser quelqu'un expliquer une chose que vous savez déjà, sans le couper.", analysis: "L'ego veut toujours prouver son savoir. L'humilité laisse à l'autre la joie de transmettre." },
            { level: 4, action: "Ne jamais ramener la conversation à soi ('Moi aussi j'ai fait ça') de toute la journée.", analysis: "Tuer le réflexe de surenchère sociale pour laisser l'autre être le centre de l'attention." },
            { level: 5, action: "S'excuser clairement et sans 'mais' pour une erreur (même ancienne) auprès de quelqu'un.", analysis: "Une excuse sans justification est un acte de bravoure qui dissout l'orgueil et guérit les relations." }
        ],
        rituals: [
            { level: 1, title: "Le Journal de l'Élève", family: "JOURNALING", description: "Note 1 chose nouvelle (même minuscule) que tu as apprise aujourd'hui d'une autre personne." },
            { level: 2, title: "Méditation de l'Océan", family: "REFLECTION", durationMin: 3, description: "Ressens à quel point tu es une goutte d'eau dans un océan immense. L'insignifiance est libératrice." }
        ]
    },
    {
        themeId: 13, // Contentement
        solo: [
            { level: 1, action: "Ne rien acheter de non-essentiel aujourd'hui (zéro shopping, zéro gadget).", analysis: "Couper le flux de la consommation pour neutraliser le circuit dopamine/frustration." },
            { level: 2, action: "Manger un repas extrêmement simple (pain, riz, pomme) en l'appréciant consciemment.", analysis: "Le jeûne des super-stimuli gustatifs ramène la satisfaction aux fondamentaux de la survie." },
            { level: 3, action: "Annuler ou ignorer une envie d''upgrade' (nouveau téléphone, nouveau vêtement).", analysis: "Tuer le désir d'optimisation matérielle pour apprécier la fonctionnalité de ce qu'on a déjà." },
            { level: 4, action: "Faire une liste mentale de 5 choses que l'on possède aujourd'hui et qui étaient des rêves autrefois.", analysis: "L'adaptation hédonique nous fait oublier nos victoires. S'en souvenir ravive le contentement." },
            { level: 5, action: "Passer une soirée sans utiliser la technologie pour se divertir (ni écran, ni musique, ni livre).", analysis: "Affronter le vide pour réaliser que sa propre présence est suffisante pour être en paix." }
        ],
        social: [
            { level: 1, action: "Zéro plainte sur la météo, la circulation ou la fatigue de toute la journée.", analysis: "Se plaindre de choses inévitables renforce les circuits neuronaux de l'insatisfaction." },
            { level: 2, action: "Refuser poliment un supplément, un cadeau superflu ou une offre promotionnelle.", analysis: "S'entraîner à dire 'Non, merci, j'ai tout ce qu'il me faut' face à la surabondance." },
            { level: 3, action: "Éviter de participer à toute conversation basée sur le manque (d'argent, de temps, de chance).", analysis: "Ne pas alimenter l'égrégore de la rareté qui pollue souvent les discussions de groupe." },
            { level: 4, action: "Célébrer sincèrement la réussite ou l'acquisition matérielle d'un proche, sans aucune envie.", analysis: "Transformer la jalousie en joie par procuration purifie totalement le cœur." },
            { level: 5, action: "Répondre à 'Comment ça va ?' par un 'Parfaitement bien, je ne manque de rien' avec conviction.", analysis: "Diffuser une énergie d'abondance rare et déstabilisante de positivité pour les autres." }
        ],
        rituals: [
            { level: 1, title: "L'Inventaire du Suffisant", family: "JOURNALING", description: "Regarde autour de toi et note 3 objets du quotidien dont tu te sers peu mais qui te facilitent la vie." },
            { level: 2, title: "Visualisation Négative", family: "REFLECTION", durationMin: 3, description: "Imagine perdre une chose précieuse (la vue, un proche, ton toit). Ouvre les yeux et savoure le fait de l'avoir." }
        ]
    },
    {
        themeId: 14, // Gratitude
        solo: [
            { level: 1, action: "Prendre 1 minute au réveil pour sourire sans raison en ouvrant les yeux.", analysis: "Conditionne chimiquement le cerveau à commencer la journée sous l'angle de l'opportunité." },
            { level: 2, action: "Apprécier consciemment un confort moderne 'invisible' (eau chaude au robinet, électricité).", analysis: "Combattre l'amnésie du confort : nous vivons mieux que les rois d'il y a 200 ans." },
            { level: 3, action: "Trouver et verbaliser le côté positif ou instructif d'une situation ennuyeuse du jour.", analysis: "L'alchimie mentale : transformer un obstacle banal en matière première pour la résilience." },
            { level: 4, action: "Se remercier soi-même pour un effort, une guérison ou une difficulté surmontée récemment.", analysis: "La gratitude commence par soi. Reconnaître son propre mérite est vital." },
            { level: 5, action: "Méditer sur sa propre mortalité (Memento Mori) pour chérir l'intensité de l'instant présent.", analysis: "Réaliser que notre temps est compté transforme chaque banalité en miracle éphémère." }
        ],
        social: [
            { level: 1, action: "Dire un vrai 'Merci', en regardant la personne dans les yeux avec une pause d'une seconde.", analysis: "Le contact visuel transforme un mot automatique en une véritable connexion humaine." },
            { level: 2, action: "Exprimer sa reconnaissance pour le travail 'invisible' d'une personne (agent d'entretien, serveur).", analysis: "Sortir les travailleurs de l'ombre de leur anonymat par une valorisation inattendue." },
            { level: 3, action: "Envoyer un SMS de remerciement à quelqu'un pour un bon moment passé ou un conseil ancien.", analysis: "La gratitude différée a un impact émotionnel immense car elle prouve que vous n'avez pas oublié." },
            { level: 4, action: "Remercier mentalement quelqu'un qui vous a blessé pour la leçon de vie qu'il vous a donnée.", analysis: "Couper le lien de la rancœur en ne gardant que l'expérience acquise (la sagesse du stoïcisme)." },
            { level: 5, action: "Écrire une lettre manuscrite à une personne marquante de votre vie et lui donner/envoyer.", analysis: "L'acte de gratitude le plus puissant : matérialiser son appréciation de manière intemporelle." }
        ],
        rituals: [
            { level: 1, title: "Les 3 Trésors du Jour", family: "JOURNALING", description: "Note 3 choses spécifiques (pas générales) qui t'ont donné le sourire aujourd'hui." },
            { level: 2, title: "Scan Corporel de Gratitude", family: "BREATHING", durationMin: 3, description: "Respire lentement. Remercie tes poumons de respirer, ton cœur de battre, tes jambes de te porter." }
        ]
    },
    {
        themeId: 15, // Prudence
        solo: [
            { level: 1, action: "Préparer ses vêtements ou ses affaires la veille pour éviter le rush du matin.", analysis: "La prudence logistique : soulager le soi du futur en anticipant l'immédiat." },
            { level: 2, action: "S'imposer un délai de 5 minutes avant d'ouvrir une application source de distraction.", analysis: "Créer un sas de lucidité pour vérifier si l'impulsion est un besoin ou un automatisme." },
            { level: 3, action: "Mettre en place la règle des 24h avant tout achat en ligne non-essentiel.", analysis: "Laisser retomber l'excitation dopaminergique pour reprendre le contrôle de ses finances." },
            { level: 4, action: "Concevoir mentalement un 'Plan B' pour l'action ou la réunion la plus importante du jour.", analysis: "La prévoyance stoïcienne : se préparer au pire pour ne pas être déstabilisé s'il survient." },
            { level: 5, action: "S'isoler 10 minutes pour évaluer froidement les risques avant une décision importante.", analysis: "Prendre de la hauteur pour ne pas laisser l'émotion ou l'urgence dicter la direction." }
        ],
        social: [
            { level: 1, action: "Laisser passer une seconde de silence complète avant de répondre à quelqu'un.", analysis: "Briser le ping-pong verbal automatique. Cet espace donne de l'intelligence à la réponse." },
            { level: 2, action: "S'abstenir de donner un conseil ou une opinion qui n'a pas été explicitement demandé.", analysis: "La prudence sociale : éviter de se mêler de ce qui ne nous regarde pas pour préserver son énergie." },
            { level: 3, action: "Refuser de s'engager immédiatement sur une demande : répondre 'Je vérifie et je te dis demain'.", analysis: "Protéger son agenda en refusant la pression temporelle imposée par les autres." },
            { level: 4, action: "Attendre 2 heures au minimum avant de répondre à un message irritant ou stressant.", analysis: "Laisser la colère redescendre. Ne jamais répondre sous le coup d'un pic de cortisol." },
            { level: 5, action: "Quitter élégamment un groupe, un débat ou une situation qui s'envenime avant l'explosion.", analysis: "La plus grande victoire dans un conflit toxique est souvent de choisir de ne pas y participer." }
        ],
        rituals: [
            { level: 1, title: "L'Analyse du Risque", family: "JOURNALING", description: "Identifie un sujet d'inquiétude. Écris le pire scénario possible, et comment tu y survivrais concrètement." },
            { level: 2, title: "Respiration Carrée Tactique", family: "BREATHING", durationMin: 4, description: "Inspire 4s, bloque 4s, expire 4s, bloque 4s. Ramène le calme absolu avant de prendre une décision." }
        ]
    },
    {
        themeId: 16, // Tempérance
        solo: [
            { level: 1, action: "S'arrêter de manger ou de boire juste avant d'être totalement rassasié (à 80%).", analysis: "Le principe de 'Hara Hachi Bu' (Japon) : la frustration légère forge la discipline du corps." },
            { level: 2, action: "Repérer un petit excès quotidien (café, sucre, scrolling) et le diviser par deux aujourd'hui.", analysis: "La tempérance ne demande pas de tout couper, mais de prouver qu'on garde le contrôle du dosage." },
            { level: 3, action: "Si l'on a très envie d'acheter, de manger ou de regarder quelque chose, s'imposer 15 min d'attente.", analysis: "Briser l'arc de la gratification immédiate. L'attente dissipe souvent la fausse urgence du désir." },
            { level: 4, action: "Faire une journée de jeûne partiel (sauter un repas) ou de jeûne digital (zéro réseaux/vidéos).", analysis: "Prouver à son esprit qu'il peut parfaitement fonctionner, voire exceller, dans la privation volontaire." },
            { level: 5, action: "Arrêter net une activité extrêmement plaisante en plein milieu pour passer à autre chose.", analysis: "Maîtrise totale de l'impulsion. Le détachement absolu face à la stimulation de la dopamine." }
        ],
        social: [
            { level: 1, action: "Réduire volontairement son débit de parole et le volume de sa voix de 20%.", analysis: "La tempérance verbale : économiser son énergie et donner plus de poids à ses mots." },
            { level: 2, action: "Raconter une anecdote sans utiliser le moindre superlatif ni la moindre exagération.", analysis: "Lutter contre l'excès de dramatisation qui pollue nos interactions et biaise la vérité." },
            { level: 3, action: "Quitter une soirée, un appel ou un groupe au moment où c'est le plus agréable.", analysis: "Ne pas étirer le plaisir jusqu'à l'épuisement. Savoir partir en laissant un excellent souvenir." },
            { level: 4, action: "Rester parfaitement neutre et silencieux face à une provocation ou une rumeur croustillante.", analysis: "Maîtriser l'appétit social pour le drame ou le conflit. Ne pas jeter d'huile sur le feu." },
            { level: 5, action: "Écouter une personne se vanter ou dire une aberration sans chercher à la corriger.", analysis: "Rabaisser son propre ego : renoncer au plaisir de 'remettre l'autre à sa place'." }
        ],
        rituals: [
            { level: 1, title: "L'Audit des Excès", family: "JOURNALING", description: "Note une chose dont tu as abusé récemment (écran, nourriture, inquiétude) et pourquoi." },
            { level: 2, title: "Méditation du Détachement", family: "REFLECTION", durationMin: 5, description: "Observe tes envies ou pensées passer comme des nuages, sans t'y accrocher ni les juger." }
        ]
    },
    {
        themeId: 17, // Patience
        solo: [
            { level: 1, action: "Faire une tâche quotidienne (se brosser les dents, faire le café) deux fois plus lentement que d'habitude.", analysis: "Ralentir physiquement force le cerveau à sortir de son mode 'urgence permanente'." },
            { level: 2, action: "Ne regarder l'heure sous aucun prétexte pendant une demi-journée.", analysis: "Se détacher de la dictature de la montre pour s'ancrer dans le rythme de l'action présente." },
            { level: 3, action: "S'asseoir et ne strictement rien faire (sans écran, ni musique) pendant 5 minutes chronométrées.", analysis: "L'ennui choisi est un muscle. Apprendre à tolérer l'absence de stimulation." },
            { level: 4, action: "Choisir volontairement la file d'attente la plus longue au supermarché ou dans les bouchons.", analysis: "Transformer une frustration subie en un entraînement stoïcien au calme mental." },
            { level: 5, action: "Planifier et commencer une action dont vous ne verrez le résultat que dans 1 an (ex: planter un arbre).", analysis: "L'antidote à l'époque moderne : renouer avec le temps long et la vision intergénérationnelle." }
        ],
        social: [
            { level: 1, action: "Ne pas finir les phrases de son interlocuteur, même s'il cherche ses mots.", analysis: "Accorder à l'autre le temps d'exister à son propre rythme sans lui imposer le vôtre." },
            { level: 2, action: "Marcher ou agir au rythme de la personne la plus lente du groupe (enfant, personne âgée).", analysis: "L'empathie passe par l'adaptation physique. Briser sa propre précipitation." },
            { level: 3, action: "Expliquer calmement une deuxième fois quelque chose à quelqu'un qui n'a pas compris.", analysis: "La patience pédagogique : l'agacement détruit l'apprentissage, la répétition douce le construit." },
            { level: 4, action: "Laisser quelqu'un faire une erreur bénigne qu'il pourrait éviter, pour qu'il apprenne par lui-même.", analysis: "La patience de ne pas micro-manager et d'accepter que la progression de l'autre prend du temps." },
            { level: 5, action: "Donner du temps à une personne pour changer un comportement, sans lui mettre la pression aujourd'hui.", analysis: "Laisser germer les graines plantées lors d'une discussion sans exiger de résultat immédiat." }
        ],
        rituals: [
            { level: 1, title: "Ancrage Temporel", family: "REFLECTION", description: "Pense à un problème qui te stressait il y a 5 ans. Réalise à quel point le temps lisse tout." },
            { level: 2, title: "Respiration Allongée", family: "BREATHING", durationMin: 3, description: "Inspire 4s, expire 6s. L'expiration plus longue que l'inspiration active le système nerveux parasympathique." }
        ]
    },
    {
        themeId: 18, // Service
        solo: [
            { level: 1, action: "Nettoyer ou ranger un espace commun (bureau, rue, maison) sans que personne ne le sache.", analysis: "Faire le bien sans chercher la reconnaissance nourrit l'estime de soi intrinsèque." },
            { level: 2, action: "Ramasser un déchet dans la rue ou la nature et le jeter.", analysis: "Prendre la responsabilité de son environnement global, au-delà de sa sphère privée." },
            { level: 3, action: "Dédier les 10 premières minutes de sa journée à faciliter la vie de quelqu'un d'autre (préparer ses affaires).", analysis: "Placer l'esprit de service avant même son propre confort matinal." },
            { level: 4, action: "Apprendre ou réviser une compétence utile pour les autres (premiers secours, réparer un pneu).", analysis: "Se préparer dans l'ombre pour être la personne capable d'aider quand le chaos surviendra." },
            { level: 5, action: "Faire un sacrifice financier ou temporel important, de façon totalement anonyme.", analysis: "L'altruisme pur : donner quelque chose qui a de la valeur pour soi, sans aucun retour possible." }
        ],
        social: [
            { level: 1, action: "Poser sincèrement la question : 'Comment est-ce que je peux t'aider avec ça ?'.", analysis: "Se mettre à disposition sans imposer sa propre solution. Laisser l'autre guider le soutien." },
            { level: 2, action: "Mettre en lumière le travail ou l'idée de quelqu'un d'autre lors d'une discussion de groupe.", analysis: "Jouer le rôle d'amplificateur pour les autres, surtout ceux qui n'osent pas se mettre en avant." },
            { level: 3, action: "Mettre deux personnes de son réseau en contact parce qu'elles auraient intérêt à se connaître.", analysis: "Le service par la connexion : créer de la valeur exponentielle en s'effaçant de l'équation." },
            { level: 4, action: "Assumer publiquement la responsabilité d'un échec collectif pour protéger le groupe.", analysis: "Le véritable leadership : absorber les coups pour que l'équipe reste sereine et confiante." },
            { level: 5, action: "Prendre 1h pour mentorer ou débloquer quelqu'un sur un de ses problèmes profonds.", analysis: "Donner de son temps, de son énergie et de son expertise pour faire grandir son prochain." }
        ],
        rituals: [
            { level: 1, title: "Bilan d'Impact", family: "JOURNALING", description: "Écris le nom d'une personne dont tu as légèrement amélioré la journée aujourd'hui." },
            { level: 2, title: "Visualisation de l'Effet Papillon", family: "REFLECTION", durationMin: 3, description: "Imagine comment ta petite action positive du jour va se propager de personne en personne." }
        ]
    },
    {
        themeId: 19, // Pardon
        solo: [
            { level: 1, action: "Remplacer l'expression 'Il m'a fait ça' par 'Il a fait ça'.", analysis: "La sémantique est clé : retirer le 'me' supprime la dimension d'attaque personnelle." },
            { level: 2, action: "Identifier une rancœur ancienne, et lister les conséquences toxiques qu'elle a eues sur VOUS.", analysis: "Comprendre de manière pragmatique que refuser de pardonner est un acte d'auto-sabotage." },
            { level: 3, action: "Écrire une lettre de reproches à quelqu'un, puis la brûler ou la déchirer.", analysis: "L'acte physique d'exutoire permet au cerveau reptilien de tourner la page sans confrontation." },
            { level: 4, action: "Se pardonner à soi-même un échec passé en disant à voix haute : 'J'ai fait de mon mieux avec ce que je savais alors'.", analysis: "Cesser de juger son 'moi' du passé avec l'expérience de son 'moi' du présent." },
            { level: 5, action: "Souhaiter mentalement, et avec sincérité, du bonheur et de la paix à une personne que vous détestez.", analysis: "La maîtrise ultime de l'esprit : refuser de laisser l'animosité d'un autre coloniser votre âme." }
        ],
        social: [
            { level: 1, action: "Laisser glisser une micro-agression ou un ton sec sans y réagir ni y penser le reste du jour.", analysis: "Le Teflon émotionnel : choisir de ne pas donner de prise aux frustrations passagères des autres." },
            { level: 2, action: "Si quelqu'un s'excuse pour une petite faute, répondre un vrai 'Aucun problème, c'est oublié'.", analysis: "Ne pas faire payer l'autre ni le faire culpabiliser lorsqu'il est déjà vulnérable." },
            { level: 3, action: "Faire le premier pas vers quelqu'un avec qui vous êtes 'en froid' pour des broutilles.", analysis: "Briser l'impasse de l'ego. Le premier à pardonner est toujours le plus courageux." },
            { level: 4, action: "Défendre ou trouver une circonstance atténuante à quelqu'un qui a fait une erreur dans un groupe.", analysis: "Instaurer une culture de la clémence plutôt que du tribunal permanent." },
            { level: 5, action: "Dire explicitement 'Je te pardonne' à quelqu'un qui vous a fait du mal, pour clore le chapitre.", analysis: "Briser les chaînes du passé. Un acte d'une puissance libératrice colossale pour les deux parties." }
        ],
        rituals: [
            { level: 1, title: "L'Ardoise Magique", family: "REFLECTION", description: "Avant de dormir, imagine que tu effaces toutes les frustrations de la journée sur un tableau noir." },
            { level: 2, title: "Respiration de Purge", family: "BREATHING", durationMin: 3, description: "Inspire profondément (la paix), expire puissamment par la bouche en imaginant rejeter une fumée noire (la rancœur)." }
        ]
    },
    {
        themeId: 20, // Tolérance
        solo: [
            { level: 1, action: "Remarquer le moment précis où l'on juge mentalement l'apparence ou le choix de quelqu'un.", analysis: "Prendre le cerveau en flagrant délit de jugement automatique pour pouvoir le désactiver." },
            { level: 2, action: "S'exposer volontairement à un contenu (livre, vidéo) décrivant une culture très éloignée de la sienne.", analysis: "Élargir sa zone de confort culturel pour relativiser la notion de 'normalité'." },
            { level: 3, action: "Lire en entier un article ou une opinion politique radicalement opposée à la vôtre, sans vous énerver.", analysis: "Séparer l'information de l'émotion. Comprendre n'équivaut pas à approuver." },
            { level: 4, action: "Remettre en question un de ses propres principes éducatifs ou moraux : 'Et si j'avais tort ?'.", analysis: "Secouer ses propres fondations dogmatiques pour éviter la sclérose intellectuelle." },
            { level: 5, action: "Rechercher activement la beauté ou la logique dans un système de pensée que l'on méprisait jusqu'ici.", analysis: "La transcendance de l'esprit : trouver la lumière même dans ce qui nous est étranger." }
        ],
        social: [
            { level: 1, action: "Laisser une erreur de langage ou un faux fait bénin passer sans corriger la personne.", analysis: "Réprimer le besoin d'avoir raison à tout prix quand l'enjeu est nul." },
            { level: 2, action: "Poser la question 'Qu'est-ce qui t'amène à penser ça ?' avec une pure curiosité, sans attaque.", analysis: "Remplacer l'affrontement par l'exploration de la carte mentale de l'autre." },
            { level: 3, action: "Trouver et souligner un point d'accord avec quelqu'un lors d'un débat tendu.", analysis: "Créer un pont plutôt qu'un mur. La tolérance se construit sur les points communs." },
            { level: 4, action: "Défendre le droit d'une personne à exprimer une opinion que vous ne partagez pas du tout.", analysis: "L'esprit de Voltaire : protéger la liberté de l'autre avant de protéger ses propres idées." },
            { level: 5, action: "Passer un moment authentique avec une personne issue d'un milieu social ou générationnel très différent.", analysis: "La véritable tolérance s'éprouve dans la réalité du lien humain, pas dans la théorie." }
        ],
        rituals: [
            { level: 1, title: "Changement de Lunettes", family: "JOURNALING", description: "Écris une croyance de quelqu'un d'autre et essaie de la justifier avec ses arguments à lui." },
            { level: 2, title: "Méditation de l'Espace", family: "BREATHING", durationMin: 3, description: "Inspire en imaginant que ta cage thoracique s'élargit pour accueillir tout ce qui existe sans résister." }
        ]
    },
    {
        themeId: 21, // Intégration / Bilan
        solo: [
            { level: 1, action: "Relire ses notes et bilans des 20 derniers jours.", analysis: "Prendre conscience du chemin parcouru cristallise la progression dans l'esprit." },
            { level: 2, action: "Choisir UNE règle d'or ou UN mantra parmi les 20 jours pour en faire son credo de l'année.", analysis: "L'appropriation : vous n'êtes plus guidé, c'est à vous de choisir votre propre système de valeurs." },
            { level: 3, action: "Désencombrer entièrement un pan de sa vie (bureau physique, boîte mail, ou finances).", analysis: "Faire le vide massif pour accueillir le nouveau cycle avec clarté et légèreté." },
            { level: 4, action: "Planifier ses 3 prochains mois autour d'un seul objectif majeur, sans se disperser.", analysis: "Traduire la sagesse acquise en stratégie d'action concrète." },
            { level: 5, action: "Écrire une lettre à son 'Moi' dans 1 an, la sceller et mettre un rappel pour l'ouvrir.", analysis: "Fixer un cap émotionnel et spirituel pour l'avenir, un contrat d'évolution avec soi-même." }
        ],
        social: [
            { level: 1, action: "Remercier sincèrement quelqu'un qui a facilité ou soutenu votre parcours ces dernières semaines.", analysis: "La boucle est bouclée. La reconnaissance solidifie les alliances sociales." },
            { level: 2, action: "Partager sa plus grande prise de conscience des 20 derniers jours avec un proche.", analysis: "Formuler sa leçon à voix haute la valide socialement et l'ancre dans la réalité." },
            { level: 3, action: "Faire découvrir un des exercices qui vous a le plus marqué à quelqu'un qui en aurait besoin.", analysis: "Passer du statut d'élève à celui de transmetteur. Le savoir ne vaut que s'il est partagé." },
            { level: 4, action: "Célébrer la fin de ce cycle (restaurant, verre, appel) avec une personne qui vous inspire.", analysis: "Célébrer les victoires fixe les habitudes de réussite et d'effort dans l'inconscient." },
            { level: 5, action: "S'engager publiquement (devant un groupe ou sur les réseaux) à maintenir UNE nouvelle habitude.", analysis: "Utiliser le poids de l'engagement social pour garantir la pérennité de son évolution." }
        ],
        rituals: [
            { level: 1, title: "Le Dernier Bilan", family: "JOURNALING", description: "Note la plus grande chose que tu as apprise sur toi-même durant ce programme." },
            { level: 2, title: "Respiration du Nouveau Départ", family: "BREATHING", durationMin: 5, description: "Un cycle complet. Inspire profondément vers l'avenir, expire totalement les anciens fardeaux." }
        ]
    }
];