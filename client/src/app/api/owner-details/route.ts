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

export async function POST(request: Request) {
    const { ownerDetails } = await request.json();

    const newOwnerDetails = await prisma.owner_details.create({
        data: {
            owner_firstname: ownerDetails.owner_firstname,
            owner_lastname: ownerDetails.owner_lastname,
            owner_phone_number: ownerDetails.owner_phone_number,
            owner_address_line1: ownerDetails.owner_address_line1,
            owner_address_line2: ownerDetails.owner_address_line2,
            owner_address_zip: ownerDetails.owner_address_zip,
            owner: {
                connect: {
                    id: ownerDetails.owner.id
                }
            }
        }
    });

    await prisma.$disconnect();

    return NextResponse.json({
        status:200,
        body: {
            ownerDetails: newOwnerDetails
        }
    });
}