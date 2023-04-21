import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

BigInt.prototype.toJSON = function() { return this.toString() };

export async function POST(request: Request) {
    const { 
        pet_name,
        pets_photo,
        extra_information,
        use_owner_details,
        owners_name,
        phone_number,
        addressline1,
        addressline2,
        zipcode,
        tagID
    } = await request.json();

    // First get the tag
    const tag = await prisma.tags.findUnique({
        where: {
            id: parseInt(tagID)
        }
    });

    // Then get the owner, incase use_owner_details is true
    const owner = await prisma.owners.findUnique({
        where: {
            id: parseInt(tag?.owner_id?.toString() ?? "0")
        }
    });

    // get the owner_details, incase use_owner_details is true
    const owner_details = await prisma.owner_details.findUnique({
        where: {
            id: parseInt(owner?.owner_details_id?.toString() ?? "0")
        }
    });

    // Then create the tag_details 
    const tag_details = await prisma.tag_details.create({
        data: {
            pets_name: pet_name,
            pets_photo_url: "https://i.imgur.com/8Q5ZQ0x.png",
            pets_information: extra_information,
            uses_owners_information: use_owner_details,
            tag_owners_name: use_owner_details ? `${owner_details?.owner_firstname} ${owner_details?.owner_lastname}` : owners_name,
            tag_phone_number: use_owner_details ? owner_details?.owner_phone_number : phone_number,
            tag_address_line1: use_owner_details ? owner_details?.owner_address_line1 : addressline1,
            tag_address_line2: use_owner_details ? owner_details?.owner_address_line2 : addressline2,
            tag_address_zip: use_owner_details ? owner_details?.owner_address_zip : zipcode
        }
    });

    // Then update the tag with the tag_details_id
    const updated_tag = await prisma.tags.update({
        where: {
            id: parseInt(tagID)
        },
        data: {
            tag_details_id: tag_details.id
        }
    });

    // respond with the tag_details_id
    return NextResponse.json({ 
        status: 200,
        body: {
            tag_details_id: tag_details.id 
        }
    });

};

export async function GET(request: Request) {
    // TODO: implement retrieving a tag's tag_details using its tag_details_id
};


  