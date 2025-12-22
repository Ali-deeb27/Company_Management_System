import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'gold' | 'blue' | 'green' | 'purple' | 'orange' | 'cyan';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'gold'
}) => {
  const colorClasses = {
    gold: {
      bg: 'bg-[#D4AF37]/10',
      icon: 'text-[#D4AF37]',
      border: 'border-[#D4AF37]/20'
    },
    blue: {
      bg: 'bg-blue-500/10',
      icon: 'text-blue-400',
      border: 'border-blue-500/20'
    },
    green: {
      bg: 'bg-green-500/10',
      icon: 'text-green-400',
      border: 'border-green-500/20'
    },
    purple: {
      bg: 'bg-purple-500/10',
      icon: 'text-purple-400',
      border: 'border-purple-500/20'
    },
    orange: {
      bg: 'bg-orange-500/10',
      icon: 'text-orange-400',
      border: 'border-orange-500/20'
    },
    cyan: {
      bg: 'bg-cyan-500/10',
      icon: 'text-cyan-400',
      border: 'border-cyan-500/20'
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp size={14} className="text-green-400" />;
    if (trend.value < 0) return <TrendingDown size={14} className="text-red-400" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.value > 0) return 'text-green-400';
    if (trend.value < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className={`bg-[#0F2744] border ${colorClasses[color].border} rounded-xl p-5 hover:border-[#D4AF37]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/5`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon()}
              <span className={`text-sm ${getTrendColor()}`}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color].bg}`}>
          <span className={colorClasses[color].icon}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
