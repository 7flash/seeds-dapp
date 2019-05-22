import { h, app } from "hyperapp"
import * as R from 'ramda'

import effects from './effects'
import state from './state'
import actions from './actions'

import { Loader, Wallet, Controls, Notifications, Stats } from './components'

app({
  init: () => ([
    state,
    effects.setupContracts({ action: actions.stats.ready }),
    effects.setupWallet({ loaded: actions.wallet.loaded, generated: actions.wallet.generated })
  ]),
  view: state =>
    h('section', {}, [
      h('h2', {}, 'Seeds Proof of Concept'),
      h('hr'),
      h('div', {},
        state.wallet.privateKey ?
          [
            Wallet(state),
            Notifications(state),
            Controls(state, actions),
            Stats(state)
          ] : Loader('Generating wallet')
      )
    ]),
  subscriptions: (state) => [
    state.stats.ready &&
    effects.everyBlocks({ blocksNumber: 10, actions: [ actions.onblock.stats, actions.onblock.account ] }) &&
    effects.everyBlocks({ blockNumber: 2, actions: [ actions.onblock.harvest ] })
  ],
  node: document.getElementById("app")
})
