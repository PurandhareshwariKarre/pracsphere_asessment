import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getServerSession();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db("pracsphere");
  const tasks = await db
    .collection("tasks")
    .find({ userId: session.user.email })
    .toArray();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const client = await clientPromise;
  const db = client.db("pracsphere");

  const newTask = {
    title: data.title,
    description: data.description,
    dueDate: data.dueDate ? new Date(data.dueDate) : null,
    status: data.status || "pending",
    userId: session.user.email,
  };

  const result = await db.collection("tasks").insertOne(newTask);

  // MongoDB v4+ no longer returns 'ops', fetch the inserted doc manually
  const insertedTask = await db.collection("tasks").findOne({ _id: result.insertedId });
  return NextResponse.json(insertedTask);
}

export async function PATCH(request: Request) {
  const session = await getServerSession();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, updates } = await request.json();

  const client = await clientPromise;
  const db = client.db("pracsphere");

  // Use returnDocument: "after" instead of deprecated returnOriginal
  const result = await db.collection("tasks").findOneAndUpdate(
    { _id: new ObjectId(id), userId: session.user.email },
    { $set: updates },
    { returnDocument: "after" }
  );

  if (!result.value) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(result.value);
}

export async function DELETE(request: Request) {
  const session = await getServerSession();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  const client = await clientPromise;
  const db = client.db("pracsphere");

  const result = await db.collection("tasks").deleteOne({
    _id: new ObjectId(id),
    userId: session.user.email,
  });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true }, { status: 204 });
}
