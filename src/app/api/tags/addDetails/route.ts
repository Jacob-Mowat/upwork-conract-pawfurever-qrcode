import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
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

    // Log the the data extraplulated from the request
    console.log("[Edit Tag Details] name: ", name);
    console.log("[Edit Tag Details] photo_url: ", photo_url);
    console.log("[Edit Tag Details] bio: ", bio);
    console.log("[Edit Tag Details] birthday: ", birthday);
    console.log("[Edit Tag Details] breed: ", breed);
    console.log("[Edit Tag Details] gender: ", gender);
    console.log("[Edit Tag Details] microchip_number: ", microchip_number);
    console.log("[Edit Tag Details] neutered_spayed: ", neutered_spayed);
    console.log("[Edit Tag Details] behaviour: ", behaviour);
    console.log("[Edit Tag Details] allergies: ", allergies);
    console.log("[Edit Tag Details] uses_owners_information: ", uses_owners_information);
    console.log("[Edit Tag Details] parent_name: ", parent_name);
    console.log("[Edit Tag Details] parent_phone_number: ", parent_phone_number);
    console.log("[Edit Tag Details] parent_phone_number_additional_1: ", parent_phone_number_additional_1);
    console.log("[Edit Tag Details] parent_phone_number_additional_2: ", parent_phone_number_additional_2);
    console.log("[Edit Tag Details] parent_email: ", parent_email);
    console.log("[Edit Tag Details] parent_email_additional: ", parent_email_additional);
    console.log("[Edit Tag Details] parent_street_address: ", parent_street_address);
    console.log("[Edit Tag Details] parent_apt_suite_unit: ", parent_apt_suite_unit);
    console.log("[Edit Tag Details] parent_city: ", parent_city);
    console.log("[Edit Tag Details] parent_state: ", parent_state);
    console.log("[Edit Tag Details] parent_zipcode: ", parent_zipcode);
    console.log("[Edit Tag Details] tagID: ", tagID);

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
            name: name,
            photo_url: photo_url,
            bio: bio,
            birthday: birthday,
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
            tag_details_id: tag_details.id
        }
    });

};
