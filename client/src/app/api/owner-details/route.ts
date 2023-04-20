import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function() { return this.toString() };

export async function GET(request: Request) {
    const  { searchParams } = new URL(request.url);
    const ownerID = searchParams.get('ownerID');

    // const ownerDetails = prisma.owner_details.findUnique(
    //     where: { owner: ownerID };
    // );

    await prisma.$disconnect();

    // return NextResponse.json({
    //     status:200,
    //     body: {
    //         ownerDetails: ownerDetails
    //     }
    // });
};