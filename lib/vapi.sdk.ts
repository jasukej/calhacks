import Vapi from "@vapi-ai/web";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "vapi-public-key"

export const vapi = new Vapi(publicKey);