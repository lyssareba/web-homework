const graphql = require('graphql')
const TransactionType = require('./transaction-type')
const Transactions = require('../query-resolvers/transaction-resolvers.js')
const Users = require('../query-resolvers/user-resolvers')
const UserType = require('./user-type')
const Vendors = require('../query-resolvers/vendor-resolvers')
const VendorType = require('./vendor-type')

const {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} = graphql
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    transaction: {
      type: TransactionType,
      args: {
        id: { type: GraphQLString }
      },
      resolve (parentValue, args) {
        return Transactions.findOne(args.id)
      }
    },
    transactions: {
      type: GraphQLList(TransactionType),
      args: {
        amount: { type: GraphQLFloat },
        credit: { type: GraphQLBoolean },
        debit: { type: GraphQLBoolean },
        description: { type: GraphQLString },
        merchant_id: { type: GraphQLString },
        vendor_id: { type: GraphQLString },
        category: { type: GraphQLString },
        user_id: { type: GraphQLString }
      },
      resolve (parentValue, args) {
        return Transactions.find(args)
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      resolve (parentValue, args) {
        return Users.findOne(args.id)
      }
    },
    users: {
      type: GraphQLList(UserType),
      args: {
        id: { type: GraphQLString },
        dob: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return Users.find(args)
      }
    },
    vendor: {
      type: VendorType,
      args: {
        id: { type: GraphQLString }
      },
      resolve (parentValue, args) {
        return Vendors.findOne(args.id)
      }
    },
    vendors: {
      type: GraphQLList(VendorType),
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return Vendors.find(args)
      }
    }
  })
})

module.exports = RootQuery
