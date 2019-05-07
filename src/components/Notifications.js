import { h } from "hyperapp"
import * as R from "ramda"

const Notifications = ({ notifications }) => [
  notifications && notifications.length > 0 && [
    h('h3', {}, 'History: '),
    R.map((notification) => h('h4', {}, notification))(notifications),
    h('hr')
  ]
]

export default Notifications
