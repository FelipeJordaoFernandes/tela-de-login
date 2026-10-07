export const ACCOUNT_STORAGE_KEY = 'acesso.accounts.v1'
const ITERATIONS = 600_000
const storageMessage = 'Não foi possível acessar os cadastros locais. Confira se o armazenamento do navegador está disponível.'

export class LocalAuthError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'LocalAuthError'
    this.field = field
  }
}

const normalizeEmail = (email) => email.trim().toLowerCase()
const toHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

function readAccounts() {
  let raw
  try {
    raw = localStorage.getItem(ACCOUNT_STORAGE_KEY)
  } catch {
    throw new LocalAuthError(storageMessage)
  }
  if (raw === null) return []
  try {
    const data = JSON.parse(raw)
    if (data.version !== 1 || !Array.isArray(data.users) || !data.users.every((user) =>
      user && typeof user.id === 'string' && typeof user.name === 'string' &&
      typeof user.email === 'string' && /^[a-f0-9]{32}$/.test(user.salt) &&
      /^[a-f0-9]{64}$/.test(user.passwordHash) && user.iterations === ITERATIONS
    )) throw new Error('Invalid local account schema')
    return data.users
  } catch {
    throw new LocalAuthError('Os cadastros locais estão em um formato inválido. Seus dados foram preservados; confira o armazenamento deste site no navegador.')
  }
}

async function derivePassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new LocalAuthError('Este navegador precisa de HTTPS ou localhost para verificar a senha local.')
  }
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS,
  }, key, 256)
  return toHex(new Uint8Array(bits))
}

export async function registerLocalAccount({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email)
  if (readAccounts().some((user) => user.email === normalizedEmail)) {
    throw new LocalAuthError('Este e-mail já tem um cadastro neste navegador.', 'email')
  }
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const passwordHash = await derivePassword(password, salt)
  // Releitura após a operação assíncrona evita descartar outro cadastro recente.
  const users = readAccounts()
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new LocalAuthError('Este e-mail já tem um cadastro neste navegador.', 'email')
  }
  const account = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail,
    salt: toHex(salt), passwordHash, iterations: ITERATIONS }
  try {
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify({ version: 1, users: [...users, account] }))
  } catch {
    throw new LocalAuthError(storageMessage)
  }
  return { name: account.name, email: account.email }
}

export async function loginLocalAccount({ email, password }) {
  const user = readAccounts().find((account) => account.email === normalizeEmail(email))
  if (!user) throw new LocalAuthError('E-mail ou senha incorretos. Tente novamente.')
  const salt = Uint8Array.from(user.salt.match(/.{2}/g), (byte) => parseInt(byte, 16))
  const passwordHash = await derivePassword(password, salt)
  if (passwordHash !== user.passwordHash) {
    throw new LocalAuthError('E-mail ou senha incorretos. Tente novamente.')
  }
  // A interface recebe somente os dados de apresentação, sem material de senha.
  return { name: user.name, email: user.email }
}
