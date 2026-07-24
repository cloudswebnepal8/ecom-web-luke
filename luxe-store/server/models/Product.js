import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Home',
        'Kitchen',
        'Accessories',
        'Office',
        'Electronics',
        'Sports',
        'Books',
        'Art',
        'Stationary',
      ],
    },
    badge: {
      type: String,
      enum: ['Bestseller', 'New', 'Popular', 'Limited', null],
      default: null,
    },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true },
)

export default mongoose.model('Product', productSchema)
