import * as R from 'ramda';
import blockchain from '../modules/blockchain';

const initWallet = (dispatch, { action }) => {
  let privateKey = localStorage.getItem('privateKey')
  let accountName = localStorage.getItem('accountName')

  if (privateKey) {
    blockchain.initFromPrivateKey(privateKey)
  } else {
    const wallet = blockchain.generateWallet()
    privateKey = wallet.privateKey
    localStorage.setItem('privateKey', privateKey)
  }

  dispatch(action, { privateKey, accountName })
}

const updateAccountInfo = (dispatch, { accountName, action }) => {
  const result = blockchain.getAccountInfo(accountName)

  dispatch(action, result)
}

const updateStats = (dispatch, { action }) => {
  const result = blockchain.getStats()

  dispatch(action, result)
}

const createAccount = (dispatch, { accountName, action }) => {
  localStorage.setItem('accountName', accountName)
  dispatch(action, { accountName, transactionId: 'create-account-transaction' })
}

const transferSeeds = (dispatch, { account, amount, action }) => {
  dispatch(action, {
    transactionId: 'transfer-seeds-transaction'
  })
}

const plantSeeds = (dispatch, { amount, action }) => {
  dispatch(action, {
    transactionId: 'plant-seeds-transaction'
  })
}

const increaseSubscription = (dispatch, { amount, action }) => {
  dispatch(action, {
    transactionId: 'increase-subscription-transaction'
  })
}

const everySecond = (dispatch, { action }) => {
  const id = setInterval(() => {
    dispatch(action)
  }, 1000)

  return () => {
    clearInterval(id)
  }
}

const everyMinute = (dispatch, { action }) => {
  const id = setInterval(() => {
    dispatch(action)
  }, 60 * 1000)

  return () => {
    clearInterval(id)
  }
}

export default R.mapObjIndexed(
  (handler) => (props) => [handler, props]
)({
  initWallet,
  createAccount,
  updateAccountInfo,
  transferSeeds,
  plantSeeds,
  increaseSubscription,
  updateStats,
  everySecond,
  everyMinute
})
