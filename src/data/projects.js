/**
 * Curated layer for the index.
 *
 * The ledger is driven by GitHub. Anything in your public repos shows up
 * automatically, and anything you delete disappears, with no edits here.
 * This file only ENRICHES repos you want to feature: a nicer title, a tighter
 * description, tech pills, and the drawer copy.
 *
 * Rules:
 *  - `repo` must match the GitHub repository name (case-insensitive).
 *  - A curated entry whose repo no longer exists (deleted, renamed, private)
 *    is dropped automatically, so there are never dead links.
 *  - `repo: null` pins an entry that is not on GitHub; it always shows.
 *  - `live` is optional. When omitted, the repo's GitHub "Website" field is used.
 *  - `color`: accent hex for the row (optional; falls back to the category colour)
 *  - `category`: 'systems' (SYSTEMS & WASM) | 'web' (WEB APPS) | 'tools' (TOOLS)
 */

export const GITHUB_USER = 'HimanshuSinghdev'

// Repos that should never appear in the ledger. Forks and archived repos are
// already skipped. Names are matched case-insensitively.
export const EXCLUDED_REPOS = ['HimanshuSinghdev.github.io', 'HimanshuSinghdev']

export const CURATED = [
  {
    repo: 'C-Slayer',
    color: '#FF5A3C',
    title: 'C-Slayer',
    description: 'In-browser C compiler and automated test-case grading platform.',
    category: 'systems',
    stack: ['C', 'WebAssembly', 'JavaScript'],
    highlights: [
      'Write, compile and run C in the browser, with nothing to install.',
      'Submissions are checked against test cases and scored from 1 to 10.',
      'Editor and runner follow the same workflow as PySlate.',
    ],
    features: ['In-browser C editor and runner', 'Automated test-case grading', '1 to 10 code scoring'],
  },
  {
    repo: 'the-pyslate-app',
    color: '#FFC53D',
    title: 'PySlate',
    description: 'Client-side Python runner powered by Pyodide and WebAssembly.',
    category: 'systems',
    stack: ['Pyodide', 'WebAssembly', 'PWA', 'JavaScript'],
    highlights: [
      'Python runs in the browser through Pyodide, compiled to WebAssembly.',
      'Programs can read live input from a built-in terminal while they run.',
      'Projects are stored locally in the browser, so nothing leaves the device.',
    ],
    features: ['Live terminal input', 'Offline PWA support', 'Local project storage'],
  },
  {
    repo: 'tinyhop',
    color: '#3BB6FF',
    title: 'Tinyhop',
    description: 'Edge URL shortener built on Cloudflare Workers and D1.',
    category: 'tools',
    stack: ['Cloudflare Workers', 'D1', 'JavaScript'],
    highlights: [
      'Redirects are served from the edge by a Cloudflare Worker.',
      "Link records live in D1, Cloudflare's SQLite database.",
      'Open source, with no origin server to run.',
    ],
    features: ['Fast edge redirects', 'D1-backed link storage', 'Open source'],
  },
  {
    repo: 'workout-tracker',
    color: '#FF4D8D',
    title: 'IronLog',
    description: 'Progressive overload and hypertrophy tracker that works offline.',
    category: 'web',
    stack: ['React', 'Vite', 'PWA'],
    highlights: [
      'Offline-first React app: logs stay on the device.',
      'Daily weight and progress photos live in the same timeline.',
      'Builds to a native Android APK as well as an installable PWA.',
    ],
    features: ['Daily weight log', 'Progress photos', 'Charts for visualizing gains', 'Installable on Android'],
  },
  {
    repo: 'anon-chat',
    color: '#B77CFF',
    title: 'Anon-Chat',
    description: 'Real-time ephemeral messaging app with Next.js and Supabase.',
    category: 'web',
    stack: ['Next.js', 'Supabase', 'Realtime'],
    highlights: [
      'Messages arrive in real time and are not kept.',
      'Supabase handles realtime channels and storage.',
    ],
    features: ['Real-time messaging', 'Ephemeral messages', 'No sign-up'],
  },
  {
    repo: 'attendance-planner',
    color: '#B6F03C',
    title: '75% Attendance Planner',
    description: 'Offline-first PWA for calculating academic attendance thresholds.',
    category: 'tools',
    stack: ['PWA', 'JavaScript', 'Offline-first'],
    highlights: [
      'Shows how many classes you can miss, or must attend, to stay above 75%.',
      'Installable and fully usable without a connection.',
    ],
    features: ['Threshold calculator', 'Offline PWA'],
  },
  {
    repo: 'Cgameo',
    color: '#B77CFF',
    title: 'Cgameo',
    description: 'Multiplayer C code duels in the browser.',
    category: 'web',
    stack: ['C', 'JavaScript', 'Multiplayer'],
    highlights: [
      'Players compete head to head on C code.',
      'Companion game to C-Slayer, with a game-themed interface.',
    ],
    features: ['Multiplayer duels', 'Game-themed interface'],
  },
  {
    repo: 'UnChessable',
    color: '#B6F03C',
    title: 'UnChessable',
    description: 'Offline chess against Stockfish, installable as a PWA.',
    category: 'web',
    stack: ['Stockfish', 'PWA', 'JavaScript'],
    highlights: [
      'The Stockfish engine runs on the device, so no server is needed.',
      'Installs to the home screen and plays offline.',
    ],
    features: ['Offline play', 'Stockfish engine', 'Installable PWA'],
  },
  {
    repo: 'the-list-app',
    color: '#FF5A3C',
    title: 'The List',
    description: 'Receipt-themed shopping tracker PWA with offline support and optional Gemini AI.',
    category: 'web',
    stack: ['Vanilla JS', 'PWA', 'Gemini API'],
    highlights: [
      'Receipt-styled interface for tracking what you buy.',
      'Items are categorized automatically.',
      'Gemini AI integration is optional.',
    ],
    features: ['Offline support', 'Auto-categorization', 'Optional Gemini integration'],
  },
]
