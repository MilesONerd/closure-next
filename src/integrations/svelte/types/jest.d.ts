declare interface Window {
  _svelteCleanupFns?: Set<() => void>;
}
