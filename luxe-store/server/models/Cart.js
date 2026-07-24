import mongoose from 'mongoose'

// `sessionId` is an opaque cart identifier. The frontend sends either a
// random guest UUID (anonymous browsing) or `user_<userId>` once someone
// is logged in, so a user's cart persists across devices/sessions.
const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false },
)

const cartSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    items: [cartItemSchema],
  },
  { timestamps: true },
)

export default mongoose.model('Cart', cartSchema)
