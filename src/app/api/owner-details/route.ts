import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BigIntProto = BigInt.prototype as any;
BigIntProto.toJSON = function () {
    // return Number(this);
    return this.toString();
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
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
                    status: 200,
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
    const {
        data,
        ownerID
    } = await request.json();

    // Log the token and uID
    console.log("[Create Owner Details] data: ", data);

    const newOwnerDetails = await prisma.owner_details.create({
        data: {
            name: data.name as string,
            phone_number: data.phone_number,
            phone_number_additional_1: data.phone_number_additional_1,
            phone_number_additional_2: data.phone_number_additional_2,
            email: data.email,
            email_additional: data.email_additional,
            street_address: data.street_address,
            apt_suite_unit: data.apt_suite_unit,
            city: data.city,
            state: data.state,
            zipcode: data.zipcode,
            owner: {
                connect: {
                    id: parseInt(ownerID)
                }
            }
        }
    });

    // Disconnect from the database
    await prisma.$disconnect();

    if (newOwnerDetails == null) {
        return NextResponse.json({
            status: 500,
            body: {
                error: "Failed to create new owner details!"
            }
        });
    }

    return NextResponse.json({
        status: 200,
        body: {
            ownerDetails: newOwnerDetails
        }
    });
}