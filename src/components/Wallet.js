import { h } from "hyperapp"

const Wallet = ({
                  wallet: {
                    privateKey,
                    accountName,
                    balance,
                    stake,
                    subscription
                  }
}) => [
  h('h3', {}, 'Your wallet'),
  h('h4', {}, `Private key: ${privateKey}`),
  accountName && h('h4', {}, `Account: ${accountName}`),
  accountName && h('h4', {}, `Balance: ${balance} Seeds`),
  accountName && h('h4', {}, `Stake: ${stake} Seeds`),
  accountName && h('h4', {}, `Subscription: ${subscription} seeds / minute`),
  h('hr')
]

export default Wallet
