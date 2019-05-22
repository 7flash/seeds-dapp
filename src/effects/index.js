import { mapObjIndexed } from 'ramda';
import blockchain from '../modules/blockchain';

const effects = mapObjIndexed(handler => props => [handler, props])

const localStorageWallet = () =>
  Promise.resolve({
    privateKey: localStorage.getItem('privateKey'),
    publicKey: localStorage.getItem('publicKey'),
    accountName: localStorage.getItem('accountName')
  })

const setupContracts = (dispatch, { action }) =>
  blockchain.contracts.setup()
    .then(() => {
      dispatch(action)
    })

const setupWallet = (dispatch, { loaded, generated }) =>
  localStorageWallet()
    .then(({ privateKey, publicKey, accountName }) => {
      const isExistingWallet = (privateKey && privateKey !== 'null') && (accountName && accountName !== 'null')

      return isExistingWallet ?
        Promise.resolve()
          .then(() => blockchain.wallet.loadWallet({ privateKey, publicKey, accountName }))
          .then(() => dispatch(loaded, { privateKey, publicKey, accountName })) :
        blockchain.generateWallet()
          .then(blockchain.wallet.setKeys)
          .then(blockchain.wallet.getKeys)
          .then(({ privateKey, publicKey }) => {
            localStorage.setItem('privateKey', privateKey)
            localStorage.setItem('publicKey', publicKey)
            dispatch(generated, { privateKey, publicKey })
          })
    })

const checkWalletExists = (dispatch, { action, accountName }) =>
  blockchain.contracts.checkUserExists(accountName)
    .then(result => {
      if (result.exists === true) {
        blockchain.wallet.setAccount(accountName)
        dispatch(action, accountName)
      }
    })

const refreshWallet = (dispatch, { action, accountName }) =>
  blockchain.fetchWalletStats(accountName)
    .then(result => dispatch(action, result))

const refreshStats = (dispatch, { action }) =>
  blockchain.fetchTotalStats()
    .then((result) => dispatch(action, result))

const addRequest = (dispatch, { accountName, publicKey, action }) => {
  return Promise.resolve()
    .then(() => blockchain.contracts.addRequest({ accountName, publicKey }))
    .then(({ transaction_id }) => {
      localStorage.setItem('accountName', accountName)
      dispatch(action, { transaction_id })
    })
}

const transferSeeds = (dispatch, { account, amount, action }) =>
  blockchain.contracts.transferSeeds({ account, amount })
    .then(({ transaction_id }) => dispatch(action, { transaction_id }))

const plantSeeds = (dispatch, { amount, action }) =>
  blockchain.contracts.plantSeeds(amount)
    .then(({ transaction_id }) => dispatch(action, { transaction_id }))

const unplantSeeds = (dispatch, { amount, action }) =>
  blockchain.contracts.unplantSeeds(amount)
    .then(({ transaction_id }) => dispatch(action, { transaction_id }))

const increaseSubscription = (dispatch, { amount, action }) =>
  blockchain.contracts.increaseSubscription(amount)
    .then(({ transaction_id }) => dispatch(action, { transaction_id }))

const claimReward = (dispatch, { amount, action }) =>
  blockchain.contracts.claimReward(amount)
    .then(({ transaction_id }) => dispatch(action, { transaction_id }))

const everyBlocks = (dispatch, { blocksNumber, actions }) => {
  const blockInterval = 500

  const onBlock = () => {
    actions.forEach(action => dispatch(action))
  }

  const id = setInterval(onBlock, blocksNumber * blockInterval)

  onBlock()

  return () => {
    clearInterval(id)
  }
}

export default effects({
  setupContracts,
  setupWallet,
  checkWalletExists,
  refreshWallet,
  refreshStats,
  addRequest,
  transferSeeds,
  plantSeeds,
  unplantSeeds,
  increaseSubscription,
  claimReward,
  everyBlocks
})
