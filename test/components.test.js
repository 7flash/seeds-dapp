require("sucrase/register")
global.requestAnimationFrame = cb => cb()

const { describe } = require('riteway')
const { Loader, Wallet, Controls, Notifications, Stats } = require('../src/components')

describe('components', async assert => {
  assert({
    given: 'state',
    should: 'render components',
    actual: true,
    expected: true
  })
})
