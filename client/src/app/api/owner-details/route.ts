import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BigIntProto = BigInt.prototype as any;
BigIntProto.toJSON = function () {
    // return Number(this);
    return this.toString();
};

export async function GET(request: Request) {
    const  { searchParams } = new URL(request.url);
    const ownerID = searchParams.get('ownerID');

    try {
        const owner = await prisma.owners.findUnique({
            where: { id: parseInt(ownerID as string) },
        });

        if (owner == null) {
            await prisma.$disconnect();

            return NextResponse.json({
                status: 500,
                body: {
                    error: "No owner found for this user!"
                }
            });
        } else { 
            if (owner.owner_details_id == null) {
                await prisma.$disconnect();
        
                return NextResponse.json({
                    status: 500,
                    body: {
                        error: "No owner details found for this owner!"
                    }
                });
            } else {
                const ownerDetails = await prisma.owner_details.findUnique({
                    where: { id: owner.owner_details_id }
                });

                // Disconnect from the database
                await prisma.$disconnect();

                return NextResponse.json({
                    status:200,
                    body: {
                        ownerDetails: ownerDetails
                    }
                });
            }
        }
    } catch (error) {
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: error
            }
        });
    }
};

export async function POST(request: Request) {
    const { firstname, lastname, phone_number, email, addressline1, addressline2, zipcode, ownerID } = await request.json();

    const newOwnerDetails = await prisma.owner_details.create({
        data: {
            owner_firstname: firstname,
            owner_lastname: lastname,
            owner_email: email,
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

    if (newOwnerDetails == null) {
        // Disconnect from the database
        await prisma.$disconnect();

        return NextResponse.json({
            status: 500,
            body: {
                error: "Failed to create new owner details!"
            }
        });
    }

    // Disconnect from the database
    await prisma.$disconnect();

    return NextResponse.json({
        status:200,
        body: {
            ownerDetails: newOwnerDetails
        }
    });
}