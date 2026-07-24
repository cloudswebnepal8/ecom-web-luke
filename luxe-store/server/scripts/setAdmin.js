import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'

async function run() {
  const email = process.argv[2]

  if (!email) {
    console.error('Usage: node scripts/setAdmin.js someone@example.com')
    process.exit(1)
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('✖ MONGODB_URI is not set. Copy server/.env.example to server/.env first.')
    process.exit(1)
  }

  await mongoose.connect(uri)

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { isAdmin: true },
    { new: true },
  )

  if (!user) {
    console.error(`✖ No user found with email ${email}. Register that account first.`)
  } else {
    console.log(`✔ ${user.email} is now an admin. Log out and back in on the site to see it take effect.`)
  }

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error('✖ Failed:', err.message)
  process.exit(1)
})
