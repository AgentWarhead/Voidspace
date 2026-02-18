/* ─── XPEventContext — XP Gain & Level-Up Events ──────────────
 * Provides emitXP / triggerLevelUp to any component.
 * XPPopupLayer and LevelUpCelebration consume this context.
 * ────────────────────────────────────────────────────────────── */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────

export interface XPGain {
  id: string;
  amount: number;
  label: string;
  timestamp: number;
}

export interface LevelUpEvent {
  fromLevel: number;
  toLevel: number;
  title: string;
}

interface XPEventContextValue {
  /** Fire a floating "+XP" popup */
  emitXP: (amount: number, label: string) => void;
  /** Current pending popups */
  pendingGains: XPGain[];
  /** Remove a popup by ID */
  dismissGain: (id: string) => void;
  /** Trigger the level-up celebration modal */
  triggerLevelUp: (fromLevel: number, toLevel: number, title: string) => void;
  /** Active level-up event (null when idle) */
  levelUpEvent: LevelUpEvent | null;
  /** Dismiss the level-up celebration */
  dismissLevelUp: () => void;
}

// ─── Context ──────────────────────────────────────────────────

const XPEventContext = createContext<XPEventContextValue>({
  emitXP: () => {},
  pendingGains: [],
  dismissGain: () => {},
  triggerLevelUp: () => {},
  levelUpEvent: null,
  dismissLevelUp: () => {},
});

// ─── Provider ─────────────────────────────────────────────────

export function XPEventProvider({ children }: { children: ReactNode }) {
  const [pendingGains, setPendingGains] = useState<XPGain[]>([]);
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);
  const idRef = useRef(0);

  const emitXP = useCallback((amount: number, label: string) => {
    const id = `xpgain-${Date.now()}-${++idRef.current}`;
    setPendingGains(prev => [...prev, { id, amount, label, timestamp: Date.now() }]);

    // Auto-clear after 3s to prevent memory buildup
    setTimeout(() => {
      setPendingGains(prev => prev.filter(g => g.id !== id));
    }, 3000);
  }, []);

  const dismissGain = useCallback((id: string) => {
    setPendingGains(prev => prev.filter(g => g.id !== id));
  }, []);

  const triggerLevelUp = useCallback((fromLevel: number, toLevel: number, title: string) => {
    setLevelUpEvent({ fromLevel, toLevel, title });
  }, []);

  const dismissLevelUp = useCallback(() => {
    setLevelUpEvent(null);
  }, []);

  return (
    <XPEventContext.Provider
      value={{ emitXP, pendingGains, dismissGain, triggerLevelUp, levelUpEvent, dismissLevelUp }}
    >
      {children}
    </XPEventContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────

export function useXPEvents(): XPEventContextValue {
  return useContext(XPEventContext);
}
