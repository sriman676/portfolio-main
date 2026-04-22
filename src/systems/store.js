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
  recruiterMode: typeof window !== 'undefined' ? localStorage.getItem('sentinel_recruiter_mode') === 'true' : false,
  isAutoScanning: false,
  isStoryMode: false,
  currentTheme: 'wayne', // 'stark' or 'wayne'

  // 3D Scene
  nodes: INITIAL_NODES,

  // HUD & Navigation
  isMuted: true,
  isTerminalOpen: false,
  isSearchOpen: false,
  searchQuery: '',

  // Section tracking
  currentSection: 'hero',
  zOffset: 0,           // 3D Depth parameter
  scrollVelocity: 0,    // For Warp Speed effect
  isSingularity: false, // Black hole / Singularity state

  // Telemetry
  threatsBlocked: 4021,
  nodesSecured: 153,
  activeIntrusions: 0,
  sysLogMessage: 'SYSTEM_INITIALIZED: OPERATOR_ONLINE',

  // Terminal
  terminalLogs: [
    { id: newLogId(), text: 'SENTINEL_v3.0_EXECUTIVE INITIALIZED', ts: new Date().toLocaleTimeString() },
    { id: newLogId(), text: 'ALL_SYSTEMS_NOMINAL. TYPE "HELP" FOR COMMANDS.', ts: new Date().toLocaleTimeString() },
  ],

  // Actions ─────────────────────────────────────────────────
  toggleRecruiterMode: () => {
    const next = !get().recruiterMode;
    localStorage.setItem('sentinel_recruiter_mode', next);
    set({ recruiterMode: next });
    
    // Disable terminal and search when entering recruiter mode
    if (next) set({ isTerminalOpen: false, isSearchOpen: false });
  },

  setRecruiterMode: (val) => {
    if (typeof window !== 'undefined') localStorage.setItem('sentinel_recruiter_mode', val);
    set({ recruiterMode: val });
    if (val) set({ isTerminalOpen: false, isSearchOpen: false });
  },

  toggleStoryMode: () => set((state) => ({ isStoryMode: !state.isStoryMode })),

  setStarted: () => set({ isStarted: true }),
  setBootComplete: () => set({ bootComplete: true }),
  setPerfTier: (tier) => set({ perfTier: tier }),
  setAnimationState: (s) => set({ animationState: s }),

  toggleMute: () => {
    // Import audio lazily to avoid SSR issues
    import('../systems/audio').then(({ audio }) => {
      const next = !get().isMuted;
      audio.init();          // Unlock AudioContext on first interaction
      audio.setMute(next);   // Sync audio engine
      set({ isMuted: next });
    });
  },

  toggleTerminal: () =>
    set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  setSearchQuery: (q) => set({ searchQuery: q }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),

  setCurrentSection: (section) => set({ currentSection: section }),
  setZOffset: (val) => set((state) => ({ 
    zOffset: typeof val === 'function' ? val(state.zOffset) : val 
  })),
  setScrollVelocity: (val) => set((state) => ({ 
    scrollVelocity: typeof val === 'function' ? val(state.scrollVelocity) : val 
  })),
  enterSingularity: () => set({ isSingularity: true, sysLogMessage: 'FATAL_ERROR: EVENT_HORIZON_BREACHED' }),
  resetSingularity: () => set({ isSingularity: false, zOffset: 0, sysLogMessage: 'SYSTEM_RESTORED: SINGULARITY_NORMALIZED' }),
  setAutoScanning: (val) => set({ isAutoScanning: val }),
  setTheme: (theme) => set({ currentTheme: theme }),

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
