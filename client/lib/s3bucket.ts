import AWS, { Credentials } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import { config } from "dotenv";

config();

export const s3Client = new S3({
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    sslEnabled: true,
    s3ForcePathStyle: false,
    credentials: new Credentials({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    }),
});