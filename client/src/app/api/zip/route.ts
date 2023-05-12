import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import JSZip from "jszip";
import fs from 'fs';
import { s3Client } from "@/lib/s3bucket";

const svgFlatten = require('svg-flatten');

const BigIntProto = BigInt.prototype as any;
BigIntProto.toJSON = function () {
    // return Number(this);
    return this.toString();
};

export async function POST(request: Request) {
    const { uuid, svg_list } = await request.json();

    // Log that we got a request to zip svg files with the uuid and svg_list
    console.log("[zipSvgFiles] Got a request to zip svg files with the uuid and svg_list");
    console.log("[zipSvgFiles] uuid: ", uuid);
    console.log("[zipSvgFiles] svg_list: ", svg_list);

    // Create a zip file
    const zip = new JSZip();

    for (let i = 0; i < svg_list.length; i++) {
        const svg = svg_list[i].data;
        console.log(svg);

        // Flatten svg data
        const flattenedSvg = svgFlatten(svg).pathify().transform().value();
        console.log(flattenedSvg);

        // Save svg data to `${svg_list[i].name}.svg`
        zip.file(`qr-code (${svg_list[i].name}).svg`, flattenedSvg);
    }

    // Create a zip file    
    const zipFile: any = await zip.generateAsync({ type: "nodebuffer" }).then(async function (content) {
        // fs.writeFileSync(`./uploads/${uuid}.zip`, content);

        try {
            // Upload to S3
            const uploadParams = {
                Bucket: "ar-t-cacher-app-s3",
                Key: `PawFurEver/${uuid}.zip`,
                ACL: "public-read",
                Body: content
            };

            // Send the upload to S3
            const response = await s3Client.upload(uploadParams).promise();

            console.log(response);

            // register the download url in the database
            const save_url = await prisma.zip_download_urls.create({
                data: {
                    zip_file_url: response.Location,
                    zip_file_name: `${uuid}.zip`,
                    num_of_tags: svg_list.length
                }
            });

            return {
                status: 200,
                body: {
                    zip_file_url: response.Location,
                    zip_file_name: `${uuid}.zip`
                }
            };
        } catch (error) {
            console.log(error);

            return {
                status: 500,
                body: {
                    error: error
                }
            };
        }
    });

    // Disconnect from the database
    await prisma.$disconnect();

    return NextResponse.json(zipFile);
}
