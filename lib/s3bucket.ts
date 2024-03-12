import AWS, { Credentials } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";

export const s3Client = new S3({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT,
    sslEnabled: true,
    s3ForcePathStyle: false,
    credentials: new Credentials({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
    }),
});