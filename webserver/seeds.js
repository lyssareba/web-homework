const mongoose = require('mongoose');
const { TransactionModel } = require('./data-models/Transaction')
const { UserModel } = require('./data-models/User')
const { VendorModel } = require('./data-models/Vendor')

const transactions = require('./mocks/transactions')
const users = require('./mocks/users')
const vendors = require('./mocks/vendors')

const MONGO_URI = 'mongodb://localhost:27017/graphql'

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const seedDB = async () => {
  await VendorModel.deleteMany({})
  await VendorModel.insertMany(vendors)
  await UserModel.deleteMany({})
  await UserModel.insertMany(users)
  await TransactionModel.deleteMany({})
  await TransactionModel.insertMany(transactions)
}

seedDB().then(() => {
  mongoose.connection.close()
})