# @repo/db

Mongoose-based database package for the monorepo.

## Environment Variables

Required in `.env`:
MONGODB_URI=mongodb://localhost:27017/pracsphere
## Usage

import { connectDB, User, Task } from "@repo/db";

await connectDB();
const user = await User.findOne({ email: "test@example.com" });
undefined