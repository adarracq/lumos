import { Colors } from '@/src/constants/Colors';
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

interface RadarData {
    label: string;
    value: number; // Valeur actuelle (ex: 15)
    max: number;   // Valeur maximale possible (ex: 40)
}

interface RadarChartProps {
    data: RadarData[];
    size?: number;
}

export const RadarChart = ({ data, size = 250 }: RadarChartProps) => {
    const center = size / 2;

    // 💡 MODIFICATION : On passe la marge de 40 à 58 pour donner une vraie zone de sécurité aux textes longs
    const radius = center - 58;

    const angleStep = (Math.PI * 2) / data.length;

    // Fonction pour calculer les coordonnées X et Y
    const getCoordinates = (val: number, max: number, angle: number) => {
        const ratio = val / max;
        const r = radius * ratio;
        // -Math.PI / 2 pour commencer en haut (à 12h)
        const x = center + r * Math.cos(angle - Math.PI / 2);
        const y = center + r * Math.sin(angle - Math.PI / 2);
        return { x, y };
    };

    // 1. Calcul des points du polygone de l'utilisateur
    const userPolygonPoints = data.map((d, i) => {
        const { x, y } = getCoordinates(d.value, d.max, i * angleStep);
        return `${x},${y}`;
    }).join(' ');

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            {/* 💡 AJOUT : overflow: 'visible' sur le style du Svg pour autoriser les lettres à dépasser au pixel près si besoin */}
            <Svg width={size} height={size} style={{ overflow: 'visible' }}>
                {/* Toile d'araignée (Grille de fond) */}
                {[0.25, 0.5, 0.75, 1].map((level) => (
                    <Polygon
                        key={`grid-${level}`}
                        points={data.map((_, i) => {
                            const { x, y } = getCoordinates(level, 1, i * angleStep);
                            return `${x},${y}`;
                        }).join(' ')}
                        fill="none"
                        stroke={Colors.surfaceLight}
                        strokeWidth="1"
                    />
                ))}

                {/* Lignes reliant le centre aux bords */}
                {data.map((_, i) => {
                    const { x, y } = getCoordinates(1, 1, i * angleStep);
                    return (
                        <Line
                            key={`axis-${i}`}
                            x1={center} y1={center}
                            x2={x} y2={y}
                            stroke={Colors.surfaceLight}
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Polygone coloré des statistiques utilisateur */}
                <Polygon
                    points={userPolygonPoints}
                    fill="rgba(212, 175, 55, 0.35)" // Or transparent
                    stroke={Colors.primary}
                    strokeWidth="2"
                />

                {/* Points sur les sommets */}
                {data.map((d, i) => {
                    const { x, y } = getCoordinates(d.value, d.max, i * angleStep);
                    return <Circle key={`dot-${i}`} cx={x} cy={y} r="4" fill={Colors.primary} />;
                })}

                {/* Textes / Labels des Axes */}
                {data.map((d, i) => {
                    // 💡 MODIFICATION : On rapproche un peu le texte (1.18 au lieu de 1.25) pour rester dans la zone de sécurité
                    const { x, y } = getCoordinates(1.18, 1, i * angleStep);

                    // Ajustements fins de l'ancrage du texte
                    let textAnchor: "middle" | "end" | "start" = "middle";
                    if (x < center - 10) textAnchor = "end";
                    if (x > center + 10) textAnchor = "start";

                    // Calcul de décalage vertical fin pour les labels du haut et du bas
                    let yOffset = 5;
                    if (y < center - radius + 5) yOffset = -5; // Légèrement plus haut pour le sommet du haut
                    if (y > center + radius - 5) yOffset = 12; // Légèrement plus bas pour les sommets du bas

                    return (
                        <SvgText
                            key={`label-${i}`}
                            x={x}
                            y={y + yOffset}
                            fill={Colors.text}
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor={textAnchor}
                        >
                            {d.label}
                        </SvgText>
                    );
                })}
            </Svg>
        </View>
    );
};