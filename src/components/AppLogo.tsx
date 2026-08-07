import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}>
      <span className="text-brand-black dark:text-white">SP</span>
    </div>
  );
};

export default AppLogo;
