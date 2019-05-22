import { h } from "hyperapp"

const Wallet = ({
                  wallet: {
                    privateKey,
                    accountName,
                    balance,
                    harvest,
                    subscription
                  }
}) => [
  h('h3', {}, 'Your wallet'),
  h('h4', {}, `Private key: ${privateKey}`),
  accountName && h('h4', {}, `Account: ${accountName}`),
  accountName && h('h4', {}, `Balance: ${balance}`),
  h('h3', {}, 'Your harvest'),
  accountName && h('h4', {}, `Planted amount: ${harvest.planted}`),
  accountName && h('h4', {}, `Available reward: ${harvest.reward}`),
  h('h3', {}, 'Your subscription'),
  accountName && h('h4', {}, `Price per block: ${subscription.price}`),
  accountName && h('h4', {}, `Active: ${subscription.active}`),
  accountName && h('h4', {}, `Deposit: ${subscription.deposit}`),
  accountName && h('h4', {}, `Invoice: ${subscription.invoice}`),
  accountName && h('h4', {}, `Total: ${subscription.total}`),
  h('hr')
]

export default Wallet
