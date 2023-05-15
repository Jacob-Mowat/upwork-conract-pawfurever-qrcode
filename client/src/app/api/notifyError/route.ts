import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {
        message,
    } = await request.json();

    // Log the token and uID
    console.log("[notifyError] ", message);

    return NextResponse.json({
        status: 200,
        body: {
            message: "Error notification sent!"
        }
    });
}