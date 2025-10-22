"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

interface SpeedlifyData {
  url: string;
  lighthouse: LighthouseScore;
  timestamp: number;
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return '#d0df00'; // Aurin green
  if (score >= 50) return '#fbbf24'; // Orange
  return '#ef4444'; // Red
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excelente';
  if (score >= 50) return 'Bueno';
  return 'Necesita mejora';
};

const CircularProgress: React.FC<{ score: number; size?: number }> = ({ 
  score, 
  size = 60 
}) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="4"
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth="4"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-white">
          {score}
        </span>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  score: number;
  description: string;
}> = ({ title, score, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors"
  >
    <div className="flex items-center space-x-3">
      <CircularProgress score={score} size={50} />
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white">{title}</h4>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
        <span 
          className="text-xs font-medium mt-1 inline-block"
          style={{ color: getScoreColor(score) }}
        >
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  </motion.div>
);

export const SpeedlifyStats: React.FC = () => {
  const [data, setData] = useState<SpeedlifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpeedlifyData = async () => {
      try {
        // URL de tu instancia de Speedlify desplegada
        const SPEEDLIFY_API = 'https://aurinwebsitestats.netlify.app/api/urls.json';
        
        const response = await fetch(SPEEDLIFY_API);
        if (!response.ok) {
          throw new Error('Failed to fetch Speedlify data');
        }
        
        const urls: SpeedlifyData[] = await response.json();
        
        // Buscar la página principal
        const homepage = urls.find(item => 
          item.url === 'https://aurin.mx/' || 
          item.url === 'https://aurin.mx'
        );
        
        if (homepage && homepage.lighthouse) {
          setData(homepage);
        } else {
          // Si no encuentra la homepage, usar la primera URL disponible
          setData(urls[0] || null);
        }
      } catch (err) {
        console.error('Error fetching Speedlify data:', err);
        setError('No se pudieron cargar las métricas');
        
        // Datos de fallback para desarrollo
        setData({
          url: 'https://aurin.mx/',
          lighthouse: {
            performance: 96,
            accessibility: 96,
            bestPractices: 92,
            seo: 92
          },
          timestamp: Date.now()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSpeedlifyData();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d0df00]"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full">
        <p className="text-sm text-gray-400 text-center py-4">
          {error || 'No hay datos disponibles'}
        </p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Performance',
      score: data.lighthouse.performance,
      description: 'Velocidad de carga'
    },
    {
      title: 'Accessibility',
      score: data.lighthouse.accessibility,
      description: 'Accesibilidad web'
    },
    {
      title: 'Best Practices',
      score: data.lighthouse.bestPractices,
      description: 'Mejores prácticas'
    },
    {
      title: 'SEO',
      score: data.lighthouse.seo,
      description: 'Optimización SEO'
    }
  ];

  const lastUpdate = new Date(data.timestamp).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          Métricas de Rendimiento
        </h3>
        <p className="text-sm text-gray-400">
          Última auditoría: {lastUpdate} • 
          <a 
            href="https://aurinwebsitestats.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 text-[#d0df00] hover:underline"
          >
            Ver detalles completos
          </a>
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpeedlifyStats;
