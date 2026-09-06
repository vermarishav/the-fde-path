export function triggerHaptic(
  type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light'
) {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'light') {
        navigator.vibrate(8);
      } else if (type === 'medium') {
        navigator.vibrate(18);
      } else if (type === 'heavy') {
        navigator.vibrate([15, 40, 20]);
      } else if (type === 'success') {
        navigator.vibrate([10, 30, 20]);
      } else if (type === 'error') {
        navigator.vibrate([30, 40, 30, 40, 30]);
      }
    } catch {
      // Silent catch if vibrate is blocked
    }
  }
}

