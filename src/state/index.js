const quantity = (amount) => `${Number(amount).toFixed(4)} SEEDS`

export default {
  notifications: [],
  wallet: {
    privateKey: null,
    accountName: null,
    balance: quantity(0),
    harvest: {
      planted: quantity(0),
      reward: quantity(0)
    },
    subscription: {
      active: false,
      deposit: quantity(0),
      invoice: quantity(0),
      total: quantity(0)
    },
  },
  stats: {
    ready: false,
    users: [],
    nextHarvestTime: 'NOW',
    untilNextHarvest: 'NOW',
    totalSupply: quantity(0),
    totalStake: quantity(0),
    totalReward: quantity(0)
  },
  formFields: {
    accountNameField: '',
    plantAmountField: '',
    unplantAmountField: '',
    transferAmountField: '',
    transferAccountField: '',
    subscribeAmountField: '',
    claimAmountField: ''
  }
};
