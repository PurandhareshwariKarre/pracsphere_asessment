import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const client = await clientPromise;
    const db = client.db("pracsphere");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ name, email: normalizedEmail, password: hashedPassword });

    return new Response(
      JSON.stringify({ success: true, message: "User registered successfully" }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
