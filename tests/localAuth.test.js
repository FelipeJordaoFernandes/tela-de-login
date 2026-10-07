import test, { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { ACCOUNT_STORAGE_KEY, LocalAuthError, loginLocalAccount, registerLocalAccount } from '../src/lib/localAuth.js'

let items
beforeEach(() => {
  items = new Map()
  globalThis.localStorage = {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, value),
  }
})

const account = { name: '  Pessoa Teste  ', email: ' Teste@Example.com ', password: 'Senha-ficticia-123' }

test('cadastro persiste e permite login normalizado sem armazenar senha em texto puro', async () => {
  assert.deepEqual(await registerLocalAccount(account), { name: 'Pessoa Teste', email: 'teste@example.com' })
  const stored = items.get(ACCOUNT_STORAGE_KEY)
  assert.equal(stored.includes(account.password), false)
  const record = JSON.parse(stored).users[0]
  assert.equal('password' in record, false)
  assert.match(record.passwordHash, /^[a-f0-9]{64}$/)
  assert.match(record.salt, /^[a-f0-9]{32}$/)
  assert.deepEqual(await loginLocalAccount({ email: 'TESTE@example.com', password: account.password }),
    { name: 'Pessoa Teste', email: 'teste@example.com' })
})

test('e-mail desconhecido e senha incorreta recebem a mesma mensagem', async () => {
  await registerLocalAccount(account)
  const invalid = { name: 'LocalAuthError', message: 'E-mail ou senha incorretos. Tente novamente.' }
  await assert.rejects(loginLocalAccount({ email: account.email, password: 'Outra-senha-123' }), invalid)
  await assert.rejects(loginLocalAccount({ email: 'outro@example.com', password: account.password }), invalid)
})

test('cadastro duplicado não sobrescreve a conta existente', async () => {
  await registerLocalAccount(account)
  const before = items.get(ACCOUNT_STORAGE_KEY)
  await assert.rejects(registerLocalAccount({ ...account, name: 'Outro nome', email: 'TESTE@EXAMPLE.COM' }),
    (error) => error instanceof LocalAuthError && error.field === 'email')
  assert.equal(items.get(ACCOUNT_STORAGE_KEY), before)
})

test('contas distintas são preservadas e recebem salts diferentes', async () => {
  await registerLocalAccount(account)
  await registerLocalAccount({ ...account, name: 'Segunda Pessoa', email: 'segunda@example.com' })
  const records = JSON.parse(items.get(ACCOUNT_STORAGE_KEY)).users
  assert.equal(records.length, 2)
  assert.notEqual(records[0].salt, records[1].salt)
  assert.notEqual(records[0].passwordHash, records[1].passwordHash)
  assert.equal((await loginLocalAccount({ email: account.email, password: account.password })).name, 'Pessoa Teste')
})

test('JSON ou schema corrompido é preservado e não permite novo cadastro', async () => {
  for (const raw of ['{corrompido', 'null', '{"version":1,"users":[{"name":"incompleto"}]}']) {
    items.set(ACCOUNT_STORAGE_KEY, raw)
    await assert.rejects(registerLocalAccount(account), /formato inválido/)
    assert.equal(items.get(ACCOUNT_STORAGE_KEY), raw)
  }
})

test('falha de leitura ou escrita no armazenamento produz erro tratável', async () => {
  globalThis.localStorage.getItem = () => { throw new Error('Blocked storage') }
  await assert.rejects(loginLocalAccount(account), LocalAuthError)
  globalThis.localStorage.getItem = () => null
  globalThis.localStorage.setItem = () => { throw new Error('Quota exceeded') }
  await assert.rejects(registerLocalAccount(account), LocalAuthError)
})
