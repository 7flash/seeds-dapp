import { h, app } from "hyperapp"
import * as R from 'ramda'

import effects from './effects'
import state from './state'
import actions from './actions'

import { Loader, Wallet, Controls, Notifications, Stats } from './components'

app({
  init: () => ([
    state,
    effects.initWallet({ action: actions.initWallet.done }),
    effects.updateStats({ action: actions.updateStats.done })
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
  subscriptions: () => [
    effects.everySecond({ action: actions.updateHarvestTime }),
    effects.everyMinute({ action: actions.updateAccountInfo.request })
  ],
  node: document.getElementById("app")
})
