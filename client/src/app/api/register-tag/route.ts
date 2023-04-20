import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function() { return this.toString() };

export async function GET(request: Request) {
    const  { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const ownerID = searchParams.get('ownerID');

    const tag = await prisma.tags.update({
        where: {
            TAG_TOKEN: token as string
        },
        data: {
            registered: true,
            owner_id: parseInt(ownerID as string)
        }
    });

    await prisma.$disconnect();

    return NextResponse.json({
        status:200,
        body: {
            tag: tag
        }
    });
}
  