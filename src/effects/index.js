import * as R from 'ramda';
import blockchain from '../modules/blockchain';

const initWallet = ({ action }, dispatch) => {
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

const updateAccountInfo = ({ accountName, action }, dispatch) => {
  const result = blockchain.getAccountInfo(accountName)

  dispatch(action, result)
}

const updateStats = ({ action }, dispatch) => {
  const result = blockchain.getStats()

  dispatch(action, result)
}

const createAccount = ({ accountName, action }, dispatch) => {
  localStorage.setItem('accountName', accountName)
  dispatch(action, { accountName, transactionId: 'create-account-transaction' })
}

const transferSeeds = ({ account, amount, action }, dispatch) => {
  dispatch(action, {
    transactionId: 'transfer-seeds-transaction'
  })
}

const plantSeeds = ({ amount, action }, dispatch) => {
  dispatch(action, {
    transactionId: 'plant-seeds-transaction'
  })
}

const increaseSubscription = ({ amount, action }, dispatch) => {
  dispatch(action, {
    transactionId: 'increase-subscription-transaction'
  })
}

const everySecond = ({ action }, dispatch) => {
  const id = setInterval(() => {
    dispatch(action)
  }, 1000)

  return () => {
    clearInterval(id)
  }
}

const everyMinute = ({ action }, dispatch) => {
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
