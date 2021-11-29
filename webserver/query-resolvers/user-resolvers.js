const { UserModel } = require('../data-models/User')
const { packageModel }= require('./utils.js')

async function find (criteria) {
  const query = Object.keys(criteria).length
  ? UserModel.find(criteria)
  : UserModel.find()

  const users = await query.exec()

  return packageModel(users)
}

async function findOne (id) {
  const query = UserModel.findById(id)
  const user = await query.exec()

  return packageModel(user)[0] || null
}

async function addOne ({ id, dob, firstName, lastName }) {
  const query = new UserModel({ id, dob, firstName, lastName  })
  const user = await query.save();

  return packageModel(user)[0] || null
}

module.exports = {
  find,
  findOne,
  addOne
}