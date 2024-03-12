import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BigIntProto = BigInt.prototype as any;
BigIntProto.toJSON = function () {
    // return Number(this);
    return this.toString();
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const uID = searchParams.get('uID');

    // Log the token and uID
    console.log("[isAdmin] uID: ", uID);

    const owner = await prisma.owners.findUnique({
        where: {
            user_id: uID as string
        }
    });

    // Disconnect from the database
    await prisma.$disconnect();

    if (owner == null) {
        return NextResponse.json({
            status: 404,
            body: {
                message: "Owner not found"
            }
        });
    }

    // Check is admin
    if (owner.admin_flag === false) {
        return NextResponse.json({
            status: 403,
            body: {
                message: "You are not an admin"
            }
        });
    } else {
        return NextResponse.json({
            status: 200,
            body: {
                admin: true
            }
        });
    }
}
