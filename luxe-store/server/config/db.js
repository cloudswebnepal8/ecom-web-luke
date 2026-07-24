import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error(
      '\n✖ MONGODB_URI is not set. Copy server/.env.example to server/.env and add your MongoDB Atlas connection string.\n',
    )
    process.exit(1)
  }

  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(uri)
    console.log(`✔ MongoDB Atlas connected: ${mongoose.connection.host}`)
  } catch (err) {
    console.error('✖ MongoDB connection failed:', err.message)
    process.exit(1)
  }
}
