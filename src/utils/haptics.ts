export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'light') {
        navigator.vibrate(8);
      } else if (type === 'medium') {
        navigator.vibrate(18);
      } else if (type === 'heavy') {
        navigator.vibrate([15, 40, 20]);
      }
    } catch {
      // Silent catch if vibrate is blocked
    }
  }
}
