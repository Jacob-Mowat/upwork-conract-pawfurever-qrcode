import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import JSZip from "jszip";
const svgFlatten = require('svg-flatten');

import fs from 'fs';

BigInt.prototype.toJSON = function() { return this.toString() };

export async function POST(request: Request) {
    const { uuid, svg_list } = await request.json();

    console.log(uuid);
    console.log(svg_list);

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
    const zipFile = await zip.generateAsync({type:"nodebuffer"}).then(function(content) {
        fs.writeFileSync(`./uploads/${uuid}.zip`, content);
    });

    // Disconnect from the database
    await prisma.$disconnect();

    return NextResponse.json({
        status:200,
        body: {
            zip_file: zipFile
        }
    });
}
  