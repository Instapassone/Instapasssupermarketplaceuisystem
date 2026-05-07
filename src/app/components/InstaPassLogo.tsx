import logoImg from 'figma:asset/b79da78b72385436bcf360aff03e8cefee22dbb9.png';

interface InstaPassLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function InstaPassLogo({ size = 'md', className = '' }: InstaPassLogoProps) {
  const sizeMap = {
    sm: 'h-5',
    md: 'h-7',
    lg: 'h-9',
    xl: 'h-14',
  };

  const heightClass = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={logoImg}
        alt="InstaPass"
        className={`${heightClass} w-auto object-contain`}
      />
    </div>
  );
}
