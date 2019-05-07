import * as R from 'ramda';

const random = (n) => Number(n * Math.random()).toFixed(4)

export default (function blockchain() {
  let wallet = {}

  const getStats = () => ({
    totalSupply: random(10000),
    totalStake: random(1000),
    users: R.times((n) => ({
      accountName: `sevenflash${n}`,
      balance: random(1000)
    }), 5),
    nextHarvestTime: +new Date() + 3600 * 1000
  })

  const getAccountInfo = () => ({
    balance: random(1000),
    stake: random(100),
    subscription: random(10)
  })

  const initFromPrivateKey = (privateKey) => {
    wallet = {
      privateKey
    }
  }

  const generateWallet = () => {
    wallet = {
      privateKey: '0x777'
    }

    return wallet
  }

  return Object.freeze({
    generateWallet,
    initFromPrivateKey,
    getStats,
    getAccountInfo
  })
})()
