// Product data now lives in MongoDB Atlas and is served by the backend API
// (see /server). This file just keeps the category list in one place for
// the filter bar, matching the enum used in server/models/Product.js.

export const categories = [
  'All',
  'Home',
  'Kitchen',
  'Accessories',
  'Office',
  'Electronics',
  'Sports',
  'Books',
  'Art',
  'Stationary',
]
