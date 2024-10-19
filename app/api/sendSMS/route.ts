import { NextResponse } from "next/server";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust the import based on your project structure
import twilio from "twilio";

const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.NEXT_PUBLIC_TWILIO_SERVICE_SID;

if (!accountSid || !authToken || !messagingServiceSid) {
  throw new Error("Twilio credentials are not set in environment variables");
}

const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  const { userId, latitude, longitude } = await request.json();

  if (!userId || !latitude || !longitude) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const emergencyContactPhone = userData.emergency_contact_phone;
    const userName = userData.name;

    if (!emergencyContactPhone) {
      return NextResponse.json(
        { error: "No emergency contact phone found" },
        { status: 404 }
      );
    }

    const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const messageBody = `${userName} is having a panic attack. They have set you as their emergency contact. Their current location is ${googleMapsLink}. Please contact them as soon as possible.`;

    const message = await client.messages.create({
      body: messageBody,
      messagingServiceSid: messagingServiceSid,
      to: emergencyContactPhone,
    });

    return NextResponse.json(
      { message: "SMS sent successfully", messageSid: message.sid },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      { error: "Failed to send SMS", message: error.message },
      { status: 500 }
    );
  }
}
