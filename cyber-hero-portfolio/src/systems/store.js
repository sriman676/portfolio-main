import { create } from 'zustand';

// ── Unique ID helper ──────────────────────────────────────
let _logId = 0;
const newLogId = () => ++_logId;

// ── Initial node positions (static, not regenerated) ─────
const INITIAL_NODES = [
  { id: 'n1', position: [-8, 4, -5] },
  { id: 'n2', position: [8, 6, -8]  },
  { id: 'n3', position: [-6, -4, -6]},
  { id: 'n4', position: [10, -2, -4]},
  { id: 'n5', position: [0,  8, -10]},
  { id: 'n6', position: [-12, 2, -7]},
];

// ── Zustand Store ─────────────────────────────────────────
export const useStore = create((set, get) => ({
  // Core
  animationState: 'SCENE_ACTIVE',
  perfTier: 'high',
  isStarted: true,
  bootComplete: false,

  // 3D Scene
  nodes: INITIAL_NODES,

  // HUD & Navigation
  isMuted: true,
  isTerminalOpen: false,
  isSearchOpen: false,
  searchQuery: '',

  // Narration & Captions
  narrationPromptShown: false,
  narrationEnabled: false,
  currentSection: 'hero',

  // Telemetry
  threatsBlocked: 4021,
  nodesSecured: 153,
  activeIntrusions: 0,
  sysLogMessage: 'SYSTEM_INITIALIZED: OPERATOR_ONLINE',

  // Terminal
  terminalLogs: [
    { id: newLogId(), text: 'SENTINEL_v2.0 INITIALIZED', ts: new Date().toLocaleTimeString() },
    { id: newLogId(), text: 'ALL_SYSTEMS_NOMINAL. TYPE "HELP" FOR COMMANDS.', ts: new Date().toLocaleTimeString() },
  ],

  // Actions ─────────────────────────────────────────────────
  setStarted: () => set({ isStarted: true }),
  setBootComplete: () => set({ bootComplete: true }),
  setPerfTier: (tier) => set({ perfTier: tier }),
  setAnimationState: (s) => set({ animationState: s }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  toggleTerminal: () =>
    set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  setSearchQuery: (q) => set({ searchQuery: q }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),

  // Narration
  setNarrationPromptShown: () => set({ narrationPromptShown: true }),
  enableNarration: () => set({ narrationEnabled: true, isMuted: false }),
  disableNarration: () => set({ narrationEnabled: false }),
  setCurrentSection: (section) => set({ currentSection: section }),

  // Terminal logs
  addTerminalLog: (text) =>
    set((state) => ({
      terminalLogs: [
        ...state.terminalLogs.slice(-49),
        { id: newLogId(), text, ts: new Date().toLocaleTimeString() },
      ],
    })),

  clearTerminalLogs: () =>
    set({
      terminalLogs: [
        { id: newLogId(), text: 'TERMINAL_CLEARED.', ts: new Date().toLocaleTimeString() },
      ],
    }),

  // Attack simulation
  simulateAttack: () => {
    const { activeIntrusions } = get();
    if (activeIntrusions >= 3) return;

    set((state) => ({
      activeIntrusions: state.activeIntrusions + 1,
      sysLogMessage: 'SECURITY_ALERT: UNKNOWN_PACKETS_DETECTED',
    }));

    setTimeout(() => {
      set((state) => ({
        activeIntrusions: Math.max(0, state.activeIntrusions - 1),
        threatsBlocked: state.threatsBlocked + 1,
        sysLogMessage: 'THREAT_AUTO_NEUTRALIZED: BASELINE_RESTORED',
      }));
    }, 8000);
  },

  neutralizeThreat: () =>
    set((state) => ({
      threatsBlocked: state.threatsBlocked + 1,
      nodesSecured: Math.min(200, state.nodesSecured + 1),
      activeIntrusions: Math.max(0, state.activeIntrusions - 1),
      sysLogMessage: 'OPERATOR_LOG: THREAT_NEUTRALIZED',
    })),

  logEvent: (msg) => set({ sysLogMessage: msg }),
}));
