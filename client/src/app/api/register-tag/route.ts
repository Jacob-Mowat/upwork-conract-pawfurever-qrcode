import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BigIntProto = BigInt.prototype as any;
BigIntProto.toJSON = function () {
    // return Number(this);
    return this.toString();
};

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

    // Disconnect from the database
    await prisma.$disconnect();

    return NextResponse.json({
        status:200,
        body: {
            tag: tag
        }
    });
}
  