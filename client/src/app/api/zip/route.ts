import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import fs from 'fs';

BigInt.prototype.toJSON = function() { return this.toString() };

export async function POST(request: Request) {
    const { uuid, svg_list } = await request.json();

    console.log(uuid);
    console.log(svg_list);

    // Create a zip file
    const zipFile = "empty zip";
    
    for (let i = 0; i < svg_list.length; i++) {
        // Make sure folder exists on filesystem with name `./uploads/${uuid}`
        fs.mkdirSync(`./uploads/${uuid}`, { recursive: true });

        // Save svg data to `./uploads/${uuid}/${svg_list[i].name}.svg`
        fs.writeFile(`./uploads/${uuid}/qr-code (${svg_list[i].name}).svg`, svg_list[i].data, (err) => {
            if (err) {
                console.error(err);
                return;
            };
        });
    }

    return NextResponse.json({
        status:200,
        body: {
            zip_file: zipFile
        }
    });
}
  