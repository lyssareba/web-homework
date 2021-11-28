const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VendorSchema = new Schema({
  id: { type: Schema.Types.ObjectId },
  name: { type: String, default: null },
})

const model = mongoose.model('vendor', VendorSchema)

module.exports = {
  VendorModel: model,
  VendorSchema,
  default: VendorSchema
}