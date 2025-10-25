import { connectDB, Task, User } from "@repo/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tasks = await Task.find({ userId: user._id });
    return NextResponse.json(tasks);
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("Error in GET /api/tasks:", error);
    return NextResponse.json({ error: "Internal server error", details: error?.message || "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newTask = await Task.create({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      status: data.status || "pending",
      userId: user._id,
    });

    return NextResponse.json(newTask);
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("Error in POST /api/tasks:", error);
    return NextResponse.json({ error: "Internal server error", details: error?.message || "Unknown error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, updates } = await request.json();
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: user._id },
      { $set: updates },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("Error in PATCH /api/tasks:", error);
    return NextResponse.json({ error: "Internal server error", details: error?.message || "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await Task.deleteOne({
      _id: id,
      userId: user._id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("Error in DELETE /api/tasks:", error);
    return NextResponse.json({ error: "Internal server error", details: error?.message || "Unknown error" }, { status: 500 });
  }
}
