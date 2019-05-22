require("sucrase/register")

const { describe } = require('riteway')
const R = require('ramda')
const blockchain = require('../src/modules/blockchain').default

const hasMethods = (methods) => R.compose(
  R.all(fn => typeof fn === 'function'),
  R.values,
  R.pick(methods)
)

describe('blockchain', async assert => {
  const account = 'sevenflash42'

  const keys = await blockchain.generateWallet()
  assert({
    given: 'generate wallet',
    should: 'return keys',
    actual: {
      privateKey: typeof keys.privateKey,
      publicKey: typeof keys.publicKey
    },
    expected: {
      privateKey: 'string',
      publicKey: 'string'
    }
  })

  await blockchain.wallet.setKeys(keys)
  assert({
    given: 'initialized wallet',
    should: 'return keys',
    actual: await blockchain.wallet.getKeys(),
    expected: keys
  })

  await blockchain.wallet.setAccount(account)
  assert({
    given: 'initialized account',
    should: 'return name',
    actual: await blockchain.wallet.getAccount(),
    expected: account
  })

  await blockchain.contracts.setup({})

  assert({
    given: 'initialized contracts',
    should: 'send transactions',
    actual: hasMethods([
        'addRequest',
        'transferSeeds',
        'plantSeeds',
        'unplantSeeds',
        'increaseSubscription',
        'claimReward'
    ])(blockchain.contracts),
    expected: true
  })

  assert({
    given: 'initialized contracts',
    should: 'fetch tables',
    actual: hasMethods([
      'checkUserExists',
      'fetchUsers',
      'fetchTokenStats',
      'fetchAccountBalance',
      'fetchAccountHarvest',
      'fetchAccountSubscription',
    ])(blockchain.contracts),
    expected: true
  })

  assert({
    given: 'initialized contracts',
    should: 'fetch stats',
    actual: hasMethods([
      'fetchTotalStats', 'fetchWalletStats'
    ])(blockchain),
    expected: true
  })
})
