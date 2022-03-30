const includeBuilder = require('./index')

const User = 'User'
const Profile = 'Profile'
const Company = 'Company'

const aliases = {
  orders: {
    index() {
      return {
        reactor: 'reactor',

        user: {
          model: User,
          as: 'user'
        },

        // PROFILE
        'user.profile': {
          model: Profile,
          as: 'profile'
        },
        'user.profile.city': 'city',

        // COMPANY
        'user.company': {
          model: Company,
          as: 'company'
        },
        'user.company.city': 'city'
      }
    }
  }
}

const include = includeBuilder(['user', 'user.profile.city', 'user.company.city'], aliases.orders.index(), ['reactor'])

console.log(JSON.stringify(include, null, 2))
