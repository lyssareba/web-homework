const { model, Schema, SchemaTypes } = require('mongoose')

const CategoryEnum = ['FOOD', 'SUPPLIES', 'HARDWARE', 'SOFTWARE', 'MISCELLANEOUS', 'GIFTS', 'TRAVEL']

const TransactionSchema = new Schema({
  id: { type: SchemaTypes.ObjectId },
  user_id: { type: String, default: null },
  amount: { type: Number, default: null },
  credit: { type: Boolean, default: null },
  debit: { type: Boolean, default: null },
  description: { type: String, default: null },
  merchant_id: { type: String, default: null },
  vendor_id: { type: String, default: null },
  category: { type: String, enum: CategoryEnum, default: null },
  user: { type: Object, default: null}
})

const TransactionModel = model('transaction', TransactionSchema)
module.exports = {
  TransactionModel,
  TransactionSchema,
  default: TransactionSchema
}
