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
        photo_url,
        bio,
        birthday,
        breed,
        gender,
        microchip_number,
        neutered_spayed,
        behaviour,
        allergies,
        uses_owners_information,
        parent_name,
        parent_phone_number,
        parent_phone_number_additional_1,
        parent_phone_number_additional_2,
        parent_email,
        parent_email_additional,
        parent_street_address,
        parent_apt_suite_unit,
        parent_city,
        parent_state,
        parent_zipcode,
        tagID
    } = await request.json();

    // First get the tag
    const tag = await prisma.tags.findUnique({
        where: {
            id: parseInt(tagID)
        }
    });

    // Then get the owner, incase use_owner_details is true
    // const owner = await prisma.owners.findUnique({
    //     where: {
    //         id: parseInt(tag?.owner_id?.toString() ?? "0")
    //     }
    // });

    // Then create the tag_details 
    const tag_details = await prisma.tag_details.create({
        data: {
            name: name,
            photo_url: photo_url,
            bio: bio,
            birthday: new Date(birthday).toISOString(),
            breed: breed,
            gender: gender,
            microchip_number: microchip_number,
            neutered_spayed: neutered_spayed,
            behaviour: behaviour,
            allergies: allergies,
            uses_owners_information: uses_owners_information,
            parent_name: parent_name,
            parent_phone_number: parent_phone_number,
            parent_phone_number_additional_1: parent_phone_number_additional_1,
            parent_phone_number_additional_2: parent_phone_number_additional_2,
            parent_email: parent_email,
            parent_email_additional: parent_email_additional,
            parent_street_address: parent_street_address,
            parent_apt_suite_unit: parent_apt_suite_unit,
            parent_city: parent_city,
            parent_state: parent_state,
            parent_zipcode: parent_zipcode
        }
    });

    // Remove the old tag_details using the tag_details_id from the tag
    const deleted_tag_details = await prisma.tag_details.delete({
        where: {
            id: parseInt(tag?.tag_details_id?.toString() ?? "0")
        }
    });

    console.log("Deleted tag_details: ", deleted_tag_details);

    // Then update the tag with the tag_details_id
    const updated_tag = await prisma.tags.update({
        where: {
            id: parseInt(tagID)
        },
        data: {
            tag_details_id: tag_details.id
        }
    });

    // Disconnect from the database
    await prisma.$disconnect();

    // respond with the tag_details_id
    return NextResponse.json({
        status: 200,
        body: {
            tag_details_id: tag_details.id,
            updated_tag_details: tag_details,
            updated_tag: updated_tag
        }
    });

};
