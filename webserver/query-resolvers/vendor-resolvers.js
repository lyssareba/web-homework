const { VendorModel } = require('../data-models/Vendor')
const { packageModel }= require('./utils.js')

async function find (criteria) {
  const query = Object.keys(criteria).length
  ? VendorModel.find(criteria)
  : VendorModel.find()

  const vendors = await query.exec()

  return packageModel(vendors)
}

async function findOne (id) {
  const query = VendorModel.findById(id)
  const vendor = await query.exec()

  return packageModel(vendor)[0] || null
}

async function addOne ({ id, name }) {
  const query = new VendorModel({ id, name })
  const vendor = await query.save();

  return packageModel(vendor)[0] || null
}

module.exports = {
  find,
  findOne,
  addOne
}