import React from 'react';

interface VotingCardProps {
  value: string;
  isSelected: boolean;
  onClick: () => void;
}

const VotingCard: React.FC<VotingCardProps> = ({ value, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        aspect-[2/3] rounded-xl border-3 font-bold text-2xl
        transition-all duration-200 transform relative overflow-hidden
        ${isSelected
          ? 'bg-gradient-to-br from-brand-yellow to-brand-yellow-dark text-brand-black border-brand-yellow-dark scale-105 shadow-2xl ring-4 ring-brand-yellow/30'
          : 'bg-white dark:bg-gray-700 text-brand-black dark:text-gray-200 border-brand-gray-300 dark:border-gray-600 hover:scale-105 hover:shadow-xl hover:border-brand-yellow/50 hover:bg-brand-yellow/5'
        }
      `}
    >
      <div className={`absolute inset-0 flex items-center justify-center ${isSelected ? 'font-extrabold' : ''}`}>
        {value}
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-brand-black rounded-full"></div>
        </div>
      )}
    </button>
  );
};

export default VotingCard;
