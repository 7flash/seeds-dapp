import * as R from 'ramda';
import Eos from 'eosjs'
import { Keygen } from 'eosjs-keygen'
import { BigNumber } from 'bignumber.js'

const { encodeName, decodeName } = Eos.modules.format

const quantity = (amount) => `${Number(amount).toFixed(4)} SEEDS`

export default (function blockchain() {
  const config = (keyProvider) => ({
    keyProvider,
    httpEndpoint: 'http://kylin.fn.eosbixin.com',
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'
  })

  const names = Object.freeze({
    token: 'seedstoken12',
    harvest: 'seedshrvst11',
    accounts: 'seedsaccnts3',
    subscription: 'seedssubs222'
  })

  const tables = Object.freeze({
    token: {
      code: names.token,
      scope: names.token,
      table: 'stat',
      json: true
    },
    harvest: {
      code: names.harvest,
      scope: names.harvest,
      table: 'balances',
      json: true
    },
    accounts: {
      code: names.accounts,
      scope: names.accounts,
      table: 'users',
      json: true
    },
    subscription: {
      code: names.subscription,
      scope: names.subscription,
      table: 'subs',
      json: true
    }
  })

  const keyProvider = ({ pubkeys }) => {
    const isExistingWallet = !!wallet.getAccount()
    const isPrivateKeyRequired = !!pubkeys

    return isExistingWallet ?
      (isPrivateKeyRequired ? [wallet.getPrivateKey()] : [wallet.getPublicKey()]) :
      (isPrivateKeyRequired ? [application.getPrivateKey()] : [application.getPublicKey()])
  }

  const application = (() => {
    const privateKey = '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
    const publicKey = 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'
    const accountName = 'seedsapp2222'

    const getPrivateKey = () => privateKey
    const getPublicKey = () => publicKey
    const getAccount = () => accountName

    return Object.freeze({
      getPrivateKey, getPublicKey, getAccount
    })
  })()

  const wallet = (() => {
    let privateKey = null
    let publicKey = null
    let account = ''

    const setAccount = (value) => account = value
    const setKeys = (keys) => {
      privateKey = keys.privateKey
      publicKey = keys.publicKey
    }
    const loadWallet = (keys) => {
      setKeys(keys)
      account = keys.accountName
    }
    const getAccount = () => account
    const getKeys = () => ({ privateKey, publicKey })
    const getPublicKey = () => publicKey
    const getPrivateKey = () => privateKey

    return Object.freeze({
      setKeys, getKeys, setAccount, getAccount, loadWallet, getPublicKey, getPrivateKey
    })
  })()

  const contracts = (() => {
    let eos = null
    let accounts = null
    let harvest = null
    let token = null
    let subscription = null

    const setup = (args) => {
      eos = Eos({ ...config(keyProvider), ...args })

      return Promise.all([
        eos.contract(names.token),
        eos.contract(names.accounts),
        eos.contract(names.harvest),
        eos.contract(names.subscription)
      ]).then((contracts) => {
        token = contracts[0]
        accounts = contracts[1]
        harvest = contracts[2]
        subscription = contracts[3]
      })
    }

    const addRequest = ({ accountName, publicKey }) =>
      accounts.addrequest(application.getAccount(), accountName, publicKey, publicKey, { authorization: `${application.getAccount()}@active` })

    const transferSeeds = ({ account, amount }) =>
      token.transfer(wallet.getAccount(), account, quantity(amount), '', { authorization: `${wallet.getAccount()}@active` })

    const plantSeeds = (amount) =>
      token.transfer(wallet.getAccount(), names.harvest, quantity(amount), '', { authorization: `${wallet.getAccount()}@active` })

    const unplantSeeds = (amount) =>
      harvest.unplant(wallet.getAccount(), quantity(amount), { authorization: `${wallet.getAccount()}@active` })

    const increaseSubscription = (amount) =>
      token.transfer(wallet.getAccount(), names.subscription, quantity(amount), application.getAccount(), { authorization: `${wallet.getAccount()}@active` })

    const claimReward = (amount) =>
      harvest.claimreward(wallet.getAccount(), { authorization: `${wallet.getAccount()}@active` })

    const fetchAccountBalance = (accountName) =>
      eos.getCurrencyBalance(names.token, accountName, 'SEEDS')
        .then(balance => {
          return { accountName, balance: Number.parseFloat(balance[0]) ? balance[0] : quantity(0) }
        })

    const fetchTokenStats = () => {
      return eos.getTableRows({
        ...tables.token,
        table: 'stat',
        scope: 'SEEDS'
      }).then(({ rows }) => ({
        supply: rows[0].supply
      }))
    }

    const fetchAccountHarvest = (accountName) => {
      const account = BigNumber(encodeName(accountName, false))

      return eos.getTableRows({
        ...tables.harvest,
        lower_bound: account,
        upper_bound: account.plus(1)
      })
        .then(({ rows }) => ({
          planted: rows[0] ? rows[0].planted : quantity(0),
          reward: rows[0] ? rows[0].reward : quantity(0)
        }))
    }

    const fetchAccountSubscription = (accountName) => {
      const account = BigNumber(encodeName(accountName, false))

      return eos.getTableRows({
        ...tables.subscription,
        scope: application.getAccount(),
        lower_bound: account,
        upper_bound: account.plus(1)
      })
        .then(({ rows }) => ({
          active: rows[0] ? rows[0].active : false,
          deposit: rows[0] ? rows[0].deposit : quantity(0),
          invoice: rows[0] ? rows[0].invoice : quantity(0),
          total: rows[0] ? rows[0].deposit - rows[0].invoice : quantity(0)
        }))
    }

    const fetchUsers = () => {
      return eos.getTableRows({
        ...tables.accounts
      }).then((result) => result.rows.map(row => row.account))
    }

    const checkUserExists = (accountName) => {
      const account = BigNumber(encodeName(accountName, false))

      return eos.getTableRows({
        ...tables.accounts,
        lower_bound: account,
        upper_bound: account.plus(1)
      })
        .then(result => {
          return {
            exists: (result.rows[0] && result.rows[0].account) ? true : false
          }
        })
    }

    return Object.freeze({
      setup,
      addRequest,
      transferSeeds,
      plantSeeds,
      unplantSeeds,
      increaseSubscription,
      claimReward,
      checkUserExists,
      fetchUsers,
      fetchTokenStats,
      fetchAccountBalance,
      fetchAccountHarvest,
      fetchAccountSubscription,
      eos, token
    })
  })()

  const generateWallet = () =>
    Keygen.generateMasterKeys()
      .then(keys => ({
        privateKey: keys.privateKeys.active,
        publicKey: keys.publicKeys.active
      }))

  const fetchTotalStats = () =>
    contracts.fetchUsers()
      .then(users => Promise.all([
        contracts.fetchTokenStats(),
        contracts.fetchAccountHarvest(names.harvest),
        ...users.map(contracts.fetchAccountBalance)
      ]))
      .then(([ token, harvest, ...users ]) => ({
        totalSupply: token.supply,
        totalStake: harvest.planted,
        totalReward: harvest.reward,
        users
      }))

  const fetchWalletStats = () =>
    Promise.all([
      contracts.fetchAccountBalance(wallet.getAccount()),
      contracts.fetchAccountHarvest(wallet.getAccount()),
      contracts.fetchAccountSubscription(wallet.getAccount())
    ])
      .then(([ balanceResult, harvestResult, subscriptionResult ]) => {
        return {
          balance: balanceResult.balance,
          harvest: harvestResult,
          subscription: subscriptionResult
        }
      })

  return Object.freeze({
    wallet,
    contracts,
    generateWallet,
    fetchTotalStats,
    fetchWalletStats
  })
})()
