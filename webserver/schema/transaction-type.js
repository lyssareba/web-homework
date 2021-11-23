const path = require('path')
const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
} = graphql

const TxUserType = new GraphQLObjectType({
  name: 'TxUser',
  fields: () => ({
    id: { type: GraphQLString },
    dob: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString }
  })
})

const UserSchema = require(path.join('..', 'data-models', 'User')) // eslint-disable-line no-unused-vars
const { UserModel: User } = require(path.join('..', 'data-models', 'User'))

const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: () => ({
    id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    description: { type: GraphQLString },
    merchant_id: { type: GraphQLString },
    debit: { type: GraphQLBoolean },
    credit: { type: GraphQLBoolean },
    amount: { type: GraphQLFloat },
    user: {
      type: TxUserType,
      resolve: async (parentValue) => {
        const user = await User.find({ _id: parentValue.user_id})
        user.forEach(usr => {
          delete Object.assign(usr, {['id']: usr['_id']})['_id']
        })
        return user[0]
      }
    }
  })
})

module.exports = TransactionType
