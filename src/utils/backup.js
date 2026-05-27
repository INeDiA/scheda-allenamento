/** Ritorna true se l'utente non ha mai fatto backup o l'ultimo è > 30 giorni fa. */
export function backupNecessario() {
  const ultimo = localStorage.getItem('sm_ultimo_backup')
  if (!ultimo) return true
  const giorniPassati = (Date.now() - new Date(ultimo).getTime()) / (1000 * 60 * 60 * 24)
  return giorniPassati > 30
}
