import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import JSZip from "jszip";

import fs from 'fs';

BigInt.prototype.toJSON = function() { return this.toString() };

export async function POST(request: Request) {
    const { uuid, svg_list } = await request.json();

    console.log(uuid);
    console.log(svg_list);

    // Create a zip file
    const zip = new JSZip();
    
    // Make sure folder exists on filesystem with name `./uploads/${uuid}`
    fs.mkdirSync(`./uploads/${uuid}`, { recursive: true }); 

    // Add new folder to zip file
    var uploadsFolder = zip.folder(`./uploads/${uuid}`);

    for (let i = 0; i < svg_list.length; i++) {
        // Save svg data to `./uploads/${uuid}/${svg_list[i].name}.svg`
        uploadsFolder?.file(`qr-code (${svg_list[i].name}).svg`, svg_list[i].data);
    }

    // Create a zip file    
    const zipFile = await zip.generateAsync({type:"nodebuffer"}).then(function(content) {
        fs.writeFileSync(`./uploads/${uuid}.zip`, content);
    });

    return NextResponse.json({
        status:200,
        body: {
            zip_file: zipFile
        }
    });
}
  