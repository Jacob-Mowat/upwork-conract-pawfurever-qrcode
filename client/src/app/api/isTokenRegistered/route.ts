import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function() { return this.toString() };

export async function POST(request: Request) {
    const { token } = await request.json();

    const tag = await prisma.tags.findUnique({
        where: {
            TAG_TOKEN: token as String
        }
    });

    return NextResponse.json({
        status:200,
        body: {
            tag: tag
        }
    });
}
  