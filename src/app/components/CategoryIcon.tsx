import { Music, Trophy, Theater, Laugh, Sparkles, Users, Palette, Handshake } from 'lucide-react';

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className = "w-6 h-6" }: CategoryIconProps) {
  const iconMap: Record<string, typeof Music> = {
    Concerts: Music,
    Sports: Trophy,
    Theatre: Theater,
    Comedy: Laugh,
    Festivals: Sparkles,
    Family: Users,
    Arts: Palette,
    Networking: Handshake,
  };

  const Icon = iconMap[category] || Music;
  return <Icon className={className} />;
}
