import { BACKUP_FILE_NAME } from './backupData'

function authHeader(username, password) {
  return `Basic ${btoa(`${username}:${password}`)}`
}

function fileUrl(url) {
  return url.replace(/\/$/, '') + '/' + BACKUP_FILE_NAME
}

export const webdavProvider = {
  id: 'webdav',
  name: 'WebDAV / Nextcloud',

  /** Testa la connessione con PROPFIND sulla cartella radice. */
  async test(config) {
    try {
      const res = await fetch(config.url, {
        method: 'PROPFIND',
        headers: {
          Authorization: authHeader(config.username, config.password),
          Depth: '0',
        },
      })
      if (res.status === 401) return { ok: false, error: 'Credenziali non valide.' }
      if (res.status === 403) return { ok: false, error: 'Accesso negato. Controlla i permessi.' }
      if (!res.ok && res.status !== 207) return { ok: false, error: `Errore del server (${res.status}).` }
      return { ok: true }
    } catch {
      return {
        ok: false,
        error: 'Connessione non riuscita. Verifica l\'URL e che il server abbia CORS abilitato per questo dominio.',
      }
    }
  },

  /** Carica il backup con PUT. */
  async upload(config, json) {
    const res = await fetch(fileUrl(config.url), {
      method: 'PUT',
      headers: {
        Authorization: authHeader(config.username, config.password),
        'Content-Type': 'application/json',
      },
      body: json,
    })
    if (!res.ok) throw new Error(`WebDAV PUT fallito (${res.status})`)
  },

  /** Scarica il backup con GET. */
  async download(config) {
    const res = await fetch(fileUrl(config.url), {
      headers: { Authorization: authHeader(config.username, config.password) },
    })
    if (res.status === 404) throw new Error('Nessun backup trovato sul server WebDAV.')
    if (!res.ok) throw new Error(`WebDAV GET fallito (${res.status})`)
    return res.json()
  },
}
