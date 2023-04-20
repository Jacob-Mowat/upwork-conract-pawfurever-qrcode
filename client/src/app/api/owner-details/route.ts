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
    const { firstname, lastname, phone_number, addressline1, addressline2, zipcode, ownerID } = await request.json();

    const newOwnerDetails = await prisma.owner_details.create({
        data: {
            owner_firstname: firstname,
            owner_lastname: lastname,
            owner_phone_number: phone_number,
            owner_address_line1: addressline1,
            owner_address_line2: addressline2,
            owner_address_zip: zipcode,
            owner: {
                connect: {
                    id: ownerID
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