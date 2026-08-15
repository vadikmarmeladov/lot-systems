/**
 * LOT SYSTEMS CORPORATION
 * Vadim Marmeladov — CEO, Owner LOT®
 * Kuzya Cosmo Marmeladov — CEO, Owner COSMO®
 * LOT® Founded 7 April 2016 | COSMO® Founded 1 July 2024
 * Made in the USA | brand.lot-systems.com
 */

/**
 * Evolution Milestone Toast
 *
 * Displays subtle notifications when user crosses evolution milestones
 * or unlocks new features through their spiritual/psychological progression.
 */

import React from 'react';
import { useStore } from '@nanostores/react';
import { $featureUnlocks } from '#client/stores/evolution';
import { isRouteActive } from '#client/stores/router';

interface Milestone {
  message: string;
  timestamp: string;
}

export function EvolutionMilestoneToast() {
  const [currentMilestone, setCurrentMilestone] = React.useState<Milestone | null>(null);
  const [showToast, setShowToast] = React.useState(false);
  const [seenMilestones, setSeenMilestones] = React.useState<Set<string>>(new Set());

  const featureUnlocks = useStore($featureUnlocks);

  // Check for new milestones
  React.useEffect(() => {
    const checkMilestones = () => {
      const milestonesStr = localStorage.getItem('evolution_milestones');
      if (!milestonesStr) return;

      const milestones: Milestone[] = JSON.parse(milestonesStr);
      if (milestones.length === 0) return;

      const latest = milestones[0];
      const milestoneKey = `${latest.message}-${latest.timestamp}`;

      if (!seenMilestones.has(milestoneKey)) {
        setCurrentMilestone(latest);
        setShowToast(true);
        setSeenMilestones(prev => new Set(prev).add(milestoneKey));
      }
    };

    // Check on mount and every 30 seconds
    checkMilestones();
    const interval = setInterval(() => {
      // Reads localStorage + may setState; skip while on a hidden tab.
      if (document.hidden || !isRouteActive('system')) return
      checkMilestones();
    }, 30000);
    return () => clearInterval(interval);
  }, [seenMilestones]);

  // Auto-hide after 6 seconds; cleared if component unmounts before timeout fires.
  React.useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 6000);
    return () => clearTimeout(timer);
  }, [showToast]);

  // Count newly unlocked features
  const unlockedCount = React.useMemo(() => {
    if (!featureUnlocks) return 0;
    return Object.values(featureUnlocks).filter(Boolean).length;
  }, [featureUnlocks]);

  if (!showToast || !currentMilestone) return null;

  return (
    <div
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50
                 px-16 py-8 border border-[rgb(var(--acc-color-default)/0.2)]
                 bg-[var(--base-color)] grid-fill-light
                 evolved-text evolved-opacity"
      style={{
        animation: 'toast-fade-in-up 0.5s ease-out, toast-fade-out 0.5s ease-in 5.5s forwards'
      }}
    >
      <div className="text-center">
        <div className="mb-4 evolved-glow">
          {currentMilestone.message}
        </div>
        {unlockedCount > 0 && (
          <div>
            {unlockedCount} feature{unlockedCount !== 1 ? 's' : ''} unlocked
          </div>
        )}
      </div>
    </div>
  );
}

