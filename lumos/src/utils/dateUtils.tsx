import { format, subHours } from 'date-fns';

export const getLogicalTodayKey = () => {
    // On soustrait 3 heures à l'heure actuelle.
    // Ainsi, à 02h59, la date calculée correspondra encore à la veille.
    // À 03h00, la date basculera sur aujourd'hui.
    return format(subHours(new Date(), 3), 'yyyy-MM-dd');
};