import twilio from "twilio";

const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
// const username = process.env.NEXT_PUBLIC_TWILIO_USERNAME; // If required

if (!accountSid || !authToken) {
  throw new Error("Twilio credentials are not set in environment variables");
}

export const client = twilio(accountSid, authToken);
