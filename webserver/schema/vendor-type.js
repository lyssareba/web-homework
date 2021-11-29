const path = require('path')
const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
} = graphql

const VendorTxType = new GraphQLObjectType({
  name: 'VendorTx',
  fields: () => ({
    id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    description: { type: GraphQLString },
    category: { type: GraphQLString },
    debit: { type: GraphQLBoolean },
    credit: { type: GraphQLBoolean },
    amount: { type: GraphQLFloat },
  })
})

const TransactionSchema = require(path.join('..', 'data-models', 'Transaction')) // eslint-disable-line no-unused-vars
const { TransactionModel: Transaction } = require(path.join('..', 'data-models', 'Transaction'))

const VendorType = new GraphQLObjectType({
  name: 'Vendor',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    transactions: {
      type: VendorTxType,
      resolve: async (parentValue) => {
        const transactions = await Transaction.find({ vendor_id: parentValue.id })
        transactions.forEach(tx => {
          delete Object.assign(tx, {['id']: tx['_id']})['_id']
        })
        return transactions
      }
    }
  })
})

module.exports = VendorType
