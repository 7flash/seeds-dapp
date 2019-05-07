import * as R from "ramda"
import effects from '../effects';

const merge = R.mergeDeepRight

const addNotification = (notifications, message) =>
    [...notifications, `${new Date().toLocaleTimeString()}: ${message}`]

const updateAccountInfo = {
  request: (state, payload) => {
    return [
      state,
      effects.updateAccountInfo({
        action: updateAccountInfo.done,
        accountName: state.wallet.accountName
      })
    ]
  },
  done: (state, { balance, stake, subscription }) =>
    merge(state, {
      wallet: { balance, stake, subscription }
    })
}

const initWallet = {
  request: (state, payload) => {
    return [
      state,
      effects.loadWallet({
        action: createAccount.done,
        accountName: state.wallet.accountName
      })
    ]
  },
  done: (state, { address, privateKey, accountName }) => {
    return [
      merge(state, {
        wallet: {
          address, privateKey, accountName
        }
      }),
      effects.updateAccountInfo({
        action: updateAccountInfo.done,
        accountName
      })
    ]
  }
}

const createAccount = {
  request: (state, accountName) => {
    return [
      merge(state, {
        notifications: addNotification(state.notifications, `Creation of account ${accountName} requested`)
      }),
      effects.createAccount({
        action: createAccount.done,
        accountName
      })
    ]
  },
  done: (state, { accountName, transactionId }) => {
    return [
      merge(state, {
        wallet: { accountName },
        notifications: addNotification(state.notifications, `Account created at transaction: ${transactionId}`)
      }),
      effects.updateAccountInfo({
        action: updateAccountInfo.done,
        accountName
      })
    ]
  }
}

const transferSeeds = {
  request: (state, { account, amount }) => {
    return [
      merge(state, {
        notifications: addNotification(state.notifications, `Transfer of ${amount} seeds to ${account} requested`)
      }),
      effects.transferSeeds({
        action: transferSeeds.done,
        account, amount
      })
    ]
  },
  done: (state, { transactionId }) => {
    return [
      merge(state, {
       notifications: addNotification(state.notifications, `Transfer transaction broadcasted: ${transactionId}`)
      }),
      effects.updateAccountInfo({
        action: updateAccountInfo.done,
        accountName: state.wallet.accountName
      })
    ]
  }
}

const plantSeeds = {
  request: (state, amount) => {
    return [
      merge(state, {
        notifications: addNotification(state.notifications, `Planting of ${amount} seeds requested`)
      }),
      effects.plantSeeds({
        action: plantSeeds.done,
        amount
      })
    ]
  },
  done: (state, { transactionId }) => {
    return [
      merge(state, {
        notifications: addNotification(state.notifications, `Planting transaction broadcasted: ${transactionId}`)
      }),
      effects.updateAccountInfo({
        action: updateAccountInfo.done,
        accountName: state.wallet.accountName
      })
    ]
  }
}

const increaseSubscription = {
  request: (state, amount) => {
    return [
      merge(state, {
        notifications: addNotification(state.notifications, `Increasing subscription for ${amount} seeds requested`)
      }),
      effects.increaseSubscription({
        action: increaseSubscription.done,
        amount
      })
    ]
  },
  done: (state, { transactionId }) => {
    return [
      merge(state, {
        notifications: addNotification(state.notifications, `Subscription transaction broadcasted: ${transactionId}`)
      }),
      effects.updateAccountInfo({
        action: updateAccountInfo.done,
        accountName: state.wallet.accountName
      })
    ]
  }
}

const updateStats = {
  request: (state, payload) => {
    return [
      state,
      effects.updateStats({
        action: updateStats.done
      })
    ]
  },
  done: (state, payload) => {
    return merge(state, {
      stats: {
        ...payload
      }
    })
  }
}

const updateHarvestTime = (state, payload) =>
  merge(state, {
    stats: {
      untilNextHarvest: R.compose(
        (t) => `${t[0]}:${t[1]}:${t[2]}`,
        (t) => [t.getHours(), t.getMinutes(), t.getSeconds()],
        (t) => new Date(t - new Date())
      )(state.stats.nextHarvestTime)
    }
  })

const updateFormField = (field) => (state, event) =>
  merge(state, {
    formFields: {
      [field]: event.target.value
    }
  })

export default {
  initWallet,
  createAccount,
  transferSeeds,
  plantSeeds,
  increaseSubscription,
  updateAccountInfo,
  updateHarvestTime,
  updateStats,
  updateFormField,
}
