require("sucrase/register")

const { describe } = require('riteway')
const R = require('ramda')
const actions = require('../src/actions').default
const state = require('../src/state').default

describe('actions', async assert => {
  assert({
    given: 'update form field',
    should: 'return new state',
    actual: R.compose(
      R.path(['formFields', 'accountNameField']),
      R.apply(R.__, [state, { target: { value: 'newaccount' }}]),
      R.apply(R.__, ['accountNameField'])
    )(actions.updateFormField),
    expected: 'newaccount'
  })

  assert({
    given: 'every second',
    should: 'decrease harvest time',
    actual: R.compose(
      t => typeof t,
      R.path(['stats', 'untilNextHarvest']),
      R.apply(R.__, [state])
    )(actions.onblock.harvest),
    expected: 'string'
  })
})
