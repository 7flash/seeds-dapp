import * as R from "ramda"
import effects from '../effects';

const merge = R.mergeDeepRight

const addNotification = (notifications, message) =>
    [...notifications, `${new Date().toLocaleTimeString()}: ${message}`]

const timeUntil = (timestamp) =>
  R.compose(
    (t) => `${t[0]}:${t[1]}:${t[2]}`,
    (t) => [t.getHours(), t.getMinutes(), t.getSeconds()],
    (t) => new Date(t - new Date())
  )(timestamp)

const wallet = {
  loaded: (state, { privateKey, publicKey, accountName }) =>
    merge(state, {
      wallet: { privateKey, publicKey, accountName, status: 'created' }
    }),
  generated: (state, { privateKey, publicKey }) =>
    merge(state, {
      wallet: { privateKey, publicKey, status: 'generated' }
    }),
  requested: (state, accountName) => [
    merge(state, {
      wallet: { accountName, status: 'requested' }
    }),
    effects.addRequest({
      action: transactions.broadcasted('Request account'),
      accountName,
      publicKey: state.wallet.publicKey
    })
  ],
  created: (state, accountName) =>
    merge(state, {
      notifications: addNotification(state.notifications, `Request fulfilled, ${accountName} has been created on blockchain`),
      wallet: { status: 'created' }
    }),
  refreshed: (state, { balance, harvest, subscription }) =>
    merge(state, {
      wallet: { balance, harvest, subscription }
    })
}

const transactions = {
  transferSeeds: (state, { account, amount }) => [
    merge(state, {
      notifications: addNotification(state.notifications, `Transfer of ${amount} seeds to ${account} requested`)
    }),
    effects.transferSeeds({
      action: transactions.broadcasted('Transfer seeds'),
      account, amount
    })
  ],
  plantSeeds: (state, amount) => [
    merge(state, {
      notifications: addNotification(state.notifications, `Planting of ${amount} seeds requested`)
    }),
    effects.plantSeeds({
      action: transactions.broadcasted('Plant seeds'),
      amount
    })
  ],
  unplantSeeds: (state, amount) => [
    merge(state, {
      notifications: addNotification(state.notifications, `Unplanting of ${amount} seeds requested`)
    }),
    effects.unplantSeeds({
      action: transactions.broadcasted('Unplant seeds'),
      amount
    })
  ],
  claimReward: (state, amount) => [
    merge(state, {
      notifications: addNotification(state.notifications, 'Reward of ${amount} seeds from harvest requested')
    }),
    effects.claimReward({
      action: transactions.broadcasted('Claim reward'),
      amount
    })
  ],
  increaseSubscription: (state, amount) => [
    merge(state, {
      notifications: addNotification(state.notifications, `Increasing subscription for ${amount} seeds requested`)
    }),
    effects.increaseSubscription({
      action: transactions.broadcasted('Increase subscription'),
      amount
    })
  ],
  broadcasted: (type) => (state, { transaction_id }) =>
    merge(state, {
      notifications: addNotification(state.notifications, `${type} transaction broadcasted: ${transaction_id}`)
    })
}

const stats = {
  ready: (state, payload) => [
    merge(state, {
      stats: { ready: true }
    }),
    effects.refreshStats({
      action: stats.refreshed
    })
  ],
  refreshed: (state, { totalSupply, totalStake, totalReward, users }) =>
    merge(state, {
      stats: { totalSupply, totalStake, totalReward, users }
    })
}

const onblock = {
  harvest: (state, payload) => merge(state, {
    stats: {
      untilNextHarvest: timeUntil(state.stats.nextHarvestTime)
    }
  }),
  stats: (state, payload) => [
    state,
    effects.refreshStats({ action: stats.refreshed })
  ],
  account: (state, payload) => [
    state,
    state.wallet.status == 'requested' && effects.checkWalletExists({
      action: wallet.created, accountName: state.wallet.accountName
    }),
    state.wallet.status == 'created' && effects.refreshWallet({
      action: wallet.refreshed, accountName: state.wallet.accountName
    })
  ]
}

const updateFormField = (field) => (state, event) =>
  merge(state, {
    formFields: {
      [field]: event.target.value
    }
  })

export default {
  wallet,
  stats,
  transactions,
  onblock,
  updateFormField
}
