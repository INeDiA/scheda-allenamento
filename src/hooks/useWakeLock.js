import { useEffect, useRef } from 'react'

/**
 * Mantiene lo schermo acceso finché `enabled` è true.
 * Riacquisisce il lock automaticamente quando la pagina
 * torna visibile (il sistema rilascia il lock in background).
 */
export function useWakeLock(enabled = true) {
  const lockRef = useRef(null)

  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return

    let mounted = true

    async function acquire() {
      try {
        lockRef.current = await navigator.wakeLock.request('screen')
      } catch {
        // Modalità risparmio energetico attiva o API non disponibile
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible' && mounted) {
        acquire()
      }
    }

    acquire()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      lockRef.current?.release()
      lockRef.current = null
    }
  }, [enabled])
}
