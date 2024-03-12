import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BigIntProto = BigInt.prototype as any;
BigIntProto.toJSON = function () {
    // return Number(this);
    return this.toString();
};

export async function POST(request: Request) {
    const {
        name,
        phone_number,
        phone_number_additional_1,
        phone_number_additional_2,
        email,
        email_additional,
        street_address,
        apt_suite_unit,
        city,
        state,
        zipcode,
        ownerID
    } = await request.json();

    // Log the token and uID
    console.log("[Edit Owner Details] name: ", name);
    console.log("[Edit Owner Details] phone_number: ", phone_number);
    console.log("[Edit Owner Details] phone_number_additional_1: ", phone_number_additional_1);
    console.log("[Edit Owner Details] phone_number_additional_2: ", phone_number_additional_2);
    console.log("[Edit Owner Details] email: ", email);
    console.log("[Edit Owner Details] email_additional: ", email_additional);
    console.log("[Edit Owner Details] street_address: ", street_address);
    console.log("[Edit Owner Details] apt_suite_unit: ", apt_suite_unit);
    console.log("[Edit Owner Details] city: ", city);
    console.log("[Edit Owner Details] state: ", state);
    console.log("[Edit Owner Details] zipcode: ", zipcode);
    console.log("[Edit Owner Details] ownerID: ", ownerID);

    // First get the owner
    const owner = await prisma.owners.findUnique({
        where: {
            id: parseInt(ownerID)
        }
    });

    // Then get the owner_details
    const owner_details = await prisma.owner_details.findUnique({
        where: {
            id: parseInt(owner?.owner_details_id?.toString() ?? "0")
        }
    });

    // Then update the owner_details
    const updated_owner_details = await prisma.owner_details.update({
        where: {
            id: parseInt(owner_details?.id?.toString() ?? "0")
        },
        data: {
            name: name,
            phone_number: phone_number,
            phone_number_additional_1: phone_number_additional_1,
            phone_number_additional_2: phone_number_additional_2,
            email: email,
            email_additional: email_additional,
            street_address: street_address,
            apt_suite_unit: apt_suite_unit,
            city: city,
            state: state,
            zipcode: zipcode
        }
    });

    // Then update the owner
    const updated_owner = await prisma.owners.update({
        where: {
            id: parseInt(owner?.id?.toString() ?? "0")
        },
        data: {
            owner_details: {
                connect: {
                    id: parseInt(updated_owner_details?.id?.toString() ?? "0")
                }
            }
        }
    });

    // Disconnect from the database
    await prisma.$disconnect();

    // respond with the tag_details_id
    return NextResponse.json({

        status: 200,
        body: {
            owner_details_id: updated_owner_details?.id?.toString() ?? "0",
            owner_details: updated_owner_details,
            owner: updated_owner
        }
    });

};
