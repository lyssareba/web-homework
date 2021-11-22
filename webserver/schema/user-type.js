/* eslint-disable no-unused-vars */
const path = require('path')
const graphql = require('graphql')
const {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType
} = graphql

const UserSchema = require(path.join('..', 'data-models', 'User')) // eslint-disable-line no-unused-vars
const { TransactionModel: Transaction } = require(path.join('..', 'data-models', 'Transaction'))
const TransactionType = require('./transaction-type')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    dob: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    transactions: {
      type: GraphQLList(TransactionType),
      resolve: async (parentValue) => {
        const transactions = await Transaction.find({ user_id: parentValue.id })
        transactions.forEach(tx => {
          delete Object.assign(tx, {['id']: tx['_id']})['_id']
        })
        return transactions
      }
    }
  })
})

module.exports = UserType
