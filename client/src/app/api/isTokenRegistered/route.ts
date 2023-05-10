import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { useSearchParams } from "next/navigation";

const BigIntProto = BigInt.prototype as any;
BigIntProto.toJSON = function () {
    // return Number(this);
    return this.toString();
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (token == "") {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: "No token was supplied!"
            }
        });
    }

    const tag = await prisma.tags.findUnique({
        where: {
            TAG_TOKEN: token as string
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
  