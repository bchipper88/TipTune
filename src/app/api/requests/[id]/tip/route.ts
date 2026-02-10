import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: requestId } = await params;
  const body = await req.json();
  const { amount, message } = body;

  if (!amount || amount < 100) {
    return NextResponse.json(
      { error: "Minimum tip is $1 (100 cents)" },
      { status: 400 }
    );
  }

  const songRequest = await db.songRequest.findUnique({
    where: { id: requestId },
  });

  if (!songRequest || songRequest.status !== "QUEUED") {
    return NextResponse.json(
      { error: "Song request not found or not in queue" },
      { status: 404 }
    );
  }

  const [tip] = await db.$transaction([
    db.tip.create({
      data: {
        requestId,
        amount,
        message,
        status: "COMPLETED",
      },
    }),
    db.songRequest.update({
      where: { id: requestId },
      data: { totalTips: { increment: amount } },
    }),
  ]);

  return NextResponse.json(tip);
}
