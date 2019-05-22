import { h } from "hyperapp"
import * as R from "ramda"

const Stats = ({
                 stats: {
                   users, untilNextHarvest, totalSupply, totalStake
                 }
}) => [
  h('h3', {}, 'Statistics'),
  h('h4', {}, `Until next harvest: ${untilNextHarvest}`),
  h('h4', {}, `Total supply: ${totalSupply}`),
  h('h4', {}, `Total stake: ${totalStake}`),
  h('h4', {}, 'Top holders: '),
  h('ul', {}, R.compose(
    R.addIndex(R.map)((user, index) => h('li', {}, `${index+1}. ${user.accountName} - ${user.balance}`)),
    R.sort((a, b) => Number.parseFloat(b.balance) - Number.parseFloat(a.balance))
  )(users)),
  h('hr')
]

export default Stats
