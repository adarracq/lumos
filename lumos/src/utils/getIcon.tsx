import * as Icons from 'lucide-react-native';
import { Colors } from '../constants/Colors';

export const getIcon = (iconName: string, color: string = Colors.text, size: number = 24) => {
    const IconComponent = Icons[iconName as keyof typeof Icons];
    if (!IconComponent) return <Icons.HelpCircle color={color} size={size} />;
    // @ts-ignore
    return <IconComponent color={color} size={size} />;
};