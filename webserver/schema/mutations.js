const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat, GraphQLNonNull } = graphql
const { TransactionModel } = require('../data-models/Transaction')
const { UserModel } = require('../data-models/User')
const TransactionType = require('./transaction-type')
const Transactions = require('../query-resolvers/transaction-resolvers')
const UserType = require('./user-type')
const Users = require('../query-resolvers/user-resolvers')
const VendorType = require('./vendor-type')
const Vendors = require('../query-resolvers/vendor-resolvers')

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addTransaction: {
      type: TransactionType,
      args: {
        user_id: { type: GraphQLString },
        description: { type: GraphQLString },
        vendor_id: { type: GraphQLString },
        category: { type: GraphQLString },
        debit: { type: GraphQLBoolean },
        credit: { type: GraphQLBoolean },
        amount: { type: GraphQLFloat }
      },
      /* eslint-disable-next-line camelcase */
      resolve (parentValue, args) {
        return Transactions.addOne(args)
      }
    },
    updateTransaction: {
      type: TransactionType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)},
        user_id: { type: GraphQLString },
        description: { type: GraphQLString },
        vendor_id: { type: GraphQLString },
        category: { type: GraphQLString },
        debit: { type: GraphQLBoolean },
        credit: { type: GraphQLBoolean },
        amount: { type: GraphQLFloat },
      },
      resolve(parentValue, { id, user_id, description, vendor_id, category, debit, credit, amount }) {
        return TransactionModel.findByIdAndUpdate(
          id,
          { user_id, description, vendor_id, category, debit, credit, amount },
          { overwirte: true, new: true, useFindAndModify: false },
        )
      }
    },
    deleteTransaction: {
      type: TransactionType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, { id }) {
        return TransactionModel.findByIdAndDelete(id)
      }
    },
    addUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
        dob: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
      },
      resolve (parentValue, args) {
        return Users.addOne(args)
      }
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)},
        dob: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
      },
      resolve(parentValue, { id, dob, firstName, lastName }) {
        return UserModel.findByIdAndUpdate(
          id,
          { dob, firstName, lastName },
          { overwirte: true, new: true, useFindAndModify: false },
        )
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, { id }) {
        return UserModel.findByIdAndDelete(id)
      }
    },
    addVendor: {
      type: VendorType,
      args: {
        name: { type: GraphQLString }
      },
      resolve (parentValue, args) {
        return Vendors.addOne(args)
      }
    }
  })
})

module.exports = mutation
