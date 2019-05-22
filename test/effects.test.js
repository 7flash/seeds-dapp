require("sucrase/register")

const { describe } = require('riteway')
const R = require('ramda')
const effects = require('../src/effects').default

describe('effects', async assert => {
  assert({
    given: 'effects',
    should: 'return effect tuples',
    actual: R.compose(
      R.all(effect => typeof effect[0] == 'function' && typeof effect[1] == 'object'),
      R.mapObjIndexed(method => method({})),
      R.take([
        'setupContracts',
        'setupWallet',
        'checkWalletExists',
        'refreshWallet',
        'refreshStats',
        'addRequest',
        'transferSeeds',
        'plantSeeds',
        'unplantSeeds',
        'increaseSubscription',
        'claimReward',
        'everyBlocks'
      ])
    )(effects),
    expected: true
  })
})
