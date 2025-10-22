"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './SpeedlifyStats.module.css';
import { translations } from '../../i18n/translations';

interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  speedIndex?: number;
  totalBlockingTime?: number;
  timeToInteractive?: number;
}

interface SpeedlifyPageData {
  url: string;
  lighthouse: LighthouseScore;
  timestamp: number;
}

interface SpeedlifyStatsProps {
  className?: string;
  hidePerformance?: boolean;
  hideAccessibility?: boolean;
  currentUrl?: string;
  lang?: 'es' | 'en';
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return '#d0df00'; // Aurin green
  if (score >= 50) return '#fffdc5'; // Aurin cream
  return '#ef4444'; // Red
};

const getScoreGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

const ScoreCard: React.FC<{
  label: string;
  score: number;
}> = ({ label, score }) => (
  <div className={styles.scoreCard}>
    <div
      className={styles.scoreBadge}
      style={{ backgroundColor: getScoreColor(score) }}
    >
      {getScoreGrade(score)}
    </div>
    <div className={styles.scoreInfo}>
      <span className={styles.scoreLabel}>{label}</span>
      <span className={styles.scoreValue}>{score}/100</span>
    </div>
  </div>
);

const VitalCard: React.FC<{
  label: string;
  value: number;
  unit: string;
  threshold: number;
}> = ({ label, value, unit, threshold }) => (
  <div className={styles.vitalCard}>
    <span className={styles.vitalLabel}>{label}</span>
    <span
      className={styles.vitalValue}
      style={{ color: value <= threshold ? '#d0df00' : '#fffdc5' }}
    >
      {value}{unit}
    </span>
  </div>
);

export const SpeedlifyStats: React.FC<SpeedlifyStatsProps> = ({
  className = '',
  hidePerformance = false,
  hideAccessibility = false,
  currentUrl,
  lang = 'es'
}) => {
  const t = translations[lang].speedlify;
  const [data, setData] = useState<SpeedlifyPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const fetchSpeedlifyData = async () => {
      try {
        const LIGHTHOUSE_API = '/api/lighthouse.json';

        const response = await fetch(LIGHTHOUSE_API);
        if (!response.ok) {
          throw new Error('Failed to fetch Lighthouse data');
        }

        const lighthouseData = await response.json();

        // Determine target URL
        let targetUrl = currentUrl;
        if (!targetUrl && typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const baseUrl = 'https://aurin.mx';

          if (currentPath === '/' || currentPath === '') {
            targetUrl = baseUrl + '/';
          } else {
            targetUrl = baseUrl + currentPath.replace(/\/$/, '');
          }
        }

        // Fallback to homepage
        if (!targetUrl) {
          targetUrl = 'https://aurin.mx/';
        }

        // Build possible URL variations
        const possibleUrls = [
          targetUrl,
          targetUrl.replace('https://aurin.mx', 'https://www.aurin.mx'),
          targetUrl.replace('https://www.aurin.mx', 'https://aurin.mx'),
          targetUrl.replace(/\/$/, ''),
          targetUrl + '/',
        ];

        // Find matching data
        let currentPageData = null;
        for (const url of possibleUrls) {
          currentPageData = lighthouseData[url];
          if (currentPageData) {
            console.log('Found data for:', url);
            break;
          }
        }

        // Fallback to homepage if no match
        if (!currentPageData) {
          console.log('No exact match, using homepage as fallback');
          currentPageData = lighthouseData['https://aurin.mx/'] ||
                           lighthouseData['https://www.aurin.mx/'] ||
                           Object.values(lighthouseData)[0];
        }

        if (currentPageData && currentPageData.lighthouse) {
          setData({
            url: currentPageData.url || currentPageData.requestedUrl,
            lighthouse: {
              performance: currentPageData.lighthouse.performance || 0,
              accessibility: currentPageData.lighthouse.accessibility || 0,
              bestPractices: currentPageData.lighthouse.bestPractices || 0,
              seo: currentPageData.lighthouse.seo || 0,
              firstContentfulPaint: currentPageData.lighthouse.firstContentfulPaint,
              largestContentfulPaint: currentPageData.lighthouse.largestContentfulPaint,
              cumulativeLayoutShift: currentPageData.lighthouse.cumulativeLayoutShift,
              totalBlockingTime: currentPageData.lighthouse.totalBlockingTime,
              speedIndex: currentPageData.lighthouse.speedIndex,
              timeToInteractive: currentPageData.lighthouse.timeToInteractive,
            },
            timestamp: currentPageData.timestamp || Date.now()
          });
          setError(null);
          setIsRealData(true);
        } else {
          console.warn('Available URLs in Speedlify data:', Object.keys(lighthouseData));
          throw new Error('No Lighthouse data available for this page');
        }
      } catch (err) {
        console.error('Error fetching Speedlify data:', err);
        setError('No se pudieron cargar las métricas de esta página');

        // Fallback data
        setData({
          url: 'https://aurin.mx/',
          lighthouse: {
            performance: hidePerformance ? 0 : 90,
            accessibility: hideAccessibility ? 0 : 99,
            bestPractices: 100,
            seo: 100,
            firstContentfulPaint: 2.6,
            largestContentfulPaint: 2.7,
            cumulativeLayoutShift: 0.18,
            totalBlockingTime: 0,
            speedIndex: 5.4,
          },
          timestamp: Date.now()
        });
        setIsRealData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeedlifyData();
  }, [currentUrl, hidePerformance, hideAccessibility]);

  if (loading) {
    return (
      <div className={`${styles.loading} ${className}`}>
        <div className={styles.spinner}></div>
        <span className={styles.loadingText}>{t.loading}</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className={`${styles.error} ${className}`}>
        {t.unavailable}
      </div>
    );
  }

  if (!data) return null;

  // Convert milliseconds to seconds for vitals
  const fcpSeconds = data.lighthouse.firstContentfulPaint
    ? parseFloat((data.lighthouse.firstContentfulPaint / 1000).toFixed(1))
    : 0;
  const lcpSeconds = data.lighthouse.largestContentfulPaint
    ? parseFloat((data.lighthouse.largestContentfulPaint / 1000).toFixed(1))
    : 0;
  const clsValue = data.lighthouse.cumulativeLayoutShift
    ? parseFloat(data.lighthouse.cumulativeLayoutShift.toFixed(3))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${styles.container} ${className}`}
    >
      {/* Performance Score */}
      {!hidePerformance && data.lighthouse.performance > 0 && (
        <ScoreCard
          label={t.labels.performance}
          score={data.lighthouse.performance}
          tooltip={t.tooltips.performance}
        />
      )}

      {/* Accessibility Score */}
      {!hideAccessibility && data.lighthouse.accessibility > 0 && (
        <ScoreCard
          label={t.labels.accessibility}
          score={data.lighthouse.accessibility}
          tooltip={t.tooltips.accessibility}
        />
      )}

      {/* Best Practices Score */}
      <ScoreCard
        label={t.labels.bestPractices}
        score={data.lighthouse.bestPractices}
        tooltip={t.tooltips.bestPractices}
      />

      {/* SEO Score */}
      <ScoreCard
        label={t.labels.seo}
        score={data.lighthouse.seo}
        tooltip={t.tooltips.seo}
      />

      {/* Core Web Vitals */}
      {(lcpSeconds > 0 || fcpSeconds > 0 || clsValue > 0) && (
        <div className={styles.vitalsSection}>
          {lcpSeconds > 0 && (
            <VitalCard
              label="LCP"
              value={lcpSeconds}
              unit="s"
              threshold={2.5}
              tooltip={t.tooltips.lcp}
            />
          )}
          {fcpSeconds > 0 && (
            <VitalCard
              label="FCP"
              value={fcpSeconds}
              unit="s"
              threshold={1.8}
              tooltip={t.tooltips.fcp}
            />
          )}
          {clsValue > 0 && (
            <VitalCard
              label="CLS"
              value={clsValue}
              unit=""
              threshold={0.1}
              tooltip={t.tooltips.cls}
            />
          )}
        </div>
      )}

      {/* Meta Section */}
      <div className={styles.metaSection}>
        {/* Status Indicator */}
        <div className={styles.statusIndicator}>
          <div className={`${styles.statusDot} ${isRealData ? styles.live : styles.demo}`}></div>
          <span className={`${styles.statusText} ${isRealData ? styles.live : styles.demo}`}>
            {isRealData ? t.status.liveData : t.status.demoData}
          </span>
        </div>

        {/* Filtered Indicator */}
        {(hidePerformance || hideAccessibility) && (
          <div className={styles.statusIndicator}>
            <div className={`${styles.statusDot} ${styles.filtered}`}></div>
            <span className={`${styles.statusText} ${styles.filtered}`}>
              {t.status.filtered}
            </span>
          </div>
        )}

        {/* Timestamp */}
        <span className={styles.timestamp}>
          {new Date(data.timestamp).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
            day: 'numeric',
            month: 'short'
          })}
        </span>

        {/* Powered By */}
        <a
          href="https://github.com/zachleat/speedlify"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.poweredBy}
        >
          {t.poweredBy}
        </a>
      </div>
    </motion.div>
  );
};

export default SpeedlifyStats;
