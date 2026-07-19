import { cn } from '../../lib/utils';
import chungImg from '../../assets/images/Chung.png';
import trangImg from '../../assets/images/Trang.png';

interface ProfileAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-24 h-24 text-5xl',
};

const avatars: Record<string, string> = {
  'chung': chungImg,
  'trang': trangImg,
  'thành chung': chungImg,
  'thùy trang': trangImg,
};

// Curated gradient pairs — warm, romantic tones for a dating app
const gradients = [
  'from-rose-400 to-pink-500',
  'from-violet-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-emerald-500',
  'from-sky-400 to-blue-500',
  'from-fuchsia-400 to-pink-600',
];

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export default function ProfileAvatar({ name, size = 'md', className }: ProfileAvatarProps) {
  const initial = name?.charAt(0)?.toUpperCase() || '?';
  const gradient = getGradient(name || '');
  const imageSrc = name ? avatars[name.toLowerCase()] : null;

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white shadow-md select-none shrink-0 overflow-hidden',
        !imageSrc && 'bg-gradient-to-br',
        !imageSrc && gradient,
        sizeClasses[size],
        className
      )}
    >
      {imageSrc ? (
        <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}
