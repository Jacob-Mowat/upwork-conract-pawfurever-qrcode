import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { s3Client } from "@/lib/s3bucket";

BigInt.prototype.toJSON = function() { return this.toString() };

export async function POST(request: Request) {
    const { 
        token,
        photo_data,
        photo_extension
    } = await request.json();

    if (token == "") {
        return NextResponse.json({
            status: 500,
            body: {
                error: "No token was supplied!"
            }
        });
    }

    if (photo_data == "") {
        return NextResponse.json({
            status: 500,
            body: {
                error: "No photo_data was supplied!"
            }
        });
    }

    try {
        // Upload to S3
        const uploadParams = {
            Bucket: "ar-t-cacher-app-s3",
            Key: `PawFurEver/tag/${token}/tag_photo.${photo_extension}`,
            ACL: "public-read",
            Body: photo_data
        };

        // Send the upload to S3
        const response = await s3Client.upload(uploadParams).promise();

        console.log("Uploaded tag photo: ", response);

        return {
            status:200,
            body: {
                photo_url: response.Location,
            }
        };
    } catch (error) {
        console.log(error);

        return {
            status:500,
            body: {
                error: error
            }
        };
    }

};
