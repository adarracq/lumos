import { FC } from 'react';

import S1 from '../../assets/images/stretches/s1.svg';
import S10 from '../../assets/images/stretches/s10.svg';
import S11 from '../../assets/images/stretches/s11.svg';
import S12 from '../../assets/images/stretches/s12.svg';
import S13 from '../../assets/images/stretches/s13.svg';
import S14 from '../../assets/images/stretches/s14.svg';
import S15 from '../../assets/images/stretches/s15.svg';
import S16 from '../../assets/images/stretches/s16.svg';
import S17 from '../../assets/images/stretches/s17.svg';
import S18 from '../../assets/images/stretches/s18.svg';
import S19 from '../../assets/images/stretches/s19.svg';
import S2 from '../../assets/images/stretches/s2.svg';
import S20 from '../../assets/images/stretches/s20.svg';
import S21 from '../../assets/images/stretches/s21.svg';
import S22 from '../../assets/images/stretches/s22.svg';
import S3 from '../../assets/images/stretches/s3.svg';
import S4 from '../../assets/images/stretches/s4.svg';
import S5 from '../../assets/images/stretches/s5.svg';
import S6 from '../../assets/images/stretches/s6.svg';
import S7 from '../../assets/images/stretches/s7.svg';
import S8 from '../../assets/images/stretches/s8.svg';
import S9 from '../../assets/images/stretches/s9.svg';

export interface StretchDef {
    id: number;
    name: string;
    description: string;
    duration: number;
    image: FC;
}

export const ALL_STRETCHES: StretchDef[] = [
    { id: 1, name: "Flexion avant", description: "Pliage du buste vers les jambes tendues.", duration: 45, image: S1 },
    { id: 2, name: "Dos creusé", description: "Étirement profond du dos en extension.", duration: 30, image: S2 },
    { id: 3, name: "Triangle étendu", description: "Étirement latéral debout, bras vers le ciel.", duration: 40, image: S3 },
    { id: 4, name: "Bateau partiel", description: "Renforcement et équilibre en position assise.", duration: 30, image: S4 },
    { id: 5, name: "Dos arrondi", description: "Flexion du buste vers les genoux.", duration: 30, image: S5 },
    { id: 6, name: "Triangle latéral", description: "Étirement profond du flanc debout.", duration: 40, image: S6 },
    { id: 7, name: "Genoux poitrine", description: "Relâchement des lombaires au sol.", duration: 45, image: S7 },
    { id: 8, name: "Position de l'enfant", description: "Étirement complet de la colonne vertébrale.", duration: 60, image: S8 },
    { id: 9, name: "Étirement fessier", description: "Assis, étirement du bassin.", duration: 40, image: S9 },
    { id: 10, name: "Chat à quatre pattes", description: "Mobilité de la colonne vertébrale.", duration: 30, image: S10 },
    { id: 11, name: "Triangle inversé", description: "Équilibre et torsion debout.", duration: 40, image: S11 },
    { id: 12, name: "Fente basse", description: "Étirement des fléchisseurs de la hanche.", duration: 45, image: S12 },
    { id: 13, name: "Étirement du psoas", description: "Ouverture des hanches en fente.", duration: 45, image: S13 },
    { id: 14, name: "Papillon", description: "Ouverture des adducteurs en position assise.", duration: 60, image: S14 },
    { id: 15, name: "Étirement fessier avancé", description: "Étirement profond en équilibre.", duration: 40, image: S15 },
    { id: 16, name: "Pigeon pose", description: "Étirement intense des fessiers et hanches.", duration: 60, image: S16 },
    { id: 17, name: "Torsion assise", description: "Rotation complète de la colonne.", duration: 45, image: S17 },
    { id: 18, name: "Flexion assise", description: "Étirement des ischio-jambiers au sol.", duration: 45, image: S18 },
    { id: 19, name: "Pigeon latéral", description: "Ouverture profonde de la hanche.", duration: 50, image: S19 },
    { id: 20, name: "Bateau complet", description: "Gainage et équilibre total.", duration: 30, image: S20 },
    { id: 21, name: "Cobra", description: "Ouverture du buste et étirement abdominal.", duration: 30, image: S21 },
    { id: 22, name: "Danseur", description: "Étirement quadriceps avec équilibre.", duration: 40, image: S22 }
];
