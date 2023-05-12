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
    const uID = searchParams.get('uID');

    // Log the token and uID
    console.log("[isOwnerOfTag] token: ", token);
    console.log("[isOwnerOfTag] uID: ", uID);

    if (token == "") {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: "No token was supplied!"
            }
        });
    }

    if (uID == "") {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: "No uID was supplied!"
            }
        });
    }

    const owner = await prisma.owners.findUnique({
        where: {
            user_id: uID as string
        }
    });

    const tag = await prisma.tags.findUnique({
        where: {
            TAG_TOKEN: token as string
        }
    });

    if (tag == null) {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: "No tag was found!"
            }
        });
    }

    if (owner == null) {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: "No owner was found!"
            }
        });
    }

    if (tag.owner_id == owner.id) {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 200,
            body: {
                owns_tag: true
            }
        });
    } else {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 200,
            body: {
                owns_tag: false
            }
        });
    }
}
