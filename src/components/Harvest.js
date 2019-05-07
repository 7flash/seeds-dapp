import { h } from 'hyperapp';

const Harvest = (state) => [
  h('h3', {}, 'Harvest'),
  h('h4', {}, `Until next: ${state.harvest.timeout}`),
  h('hr')
]

export default Harvest
