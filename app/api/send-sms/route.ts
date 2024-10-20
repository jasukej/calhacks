import { NextResponse } from 'next/server';
import { auth, db } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { client } from "@/lib/twilio";

export async function POST(request: Request) {
    const { userId, latitude, longitude } = await request.json();

    if (!userId || !latitude || !longitude) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (!userDoc.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data();
        const emergencyContactPhone = userData.emergency_contact_phone;
        const userName = userData.name;

        if (!emergencyContactPhone) {
            return NextResponse.json({ error: 'No emergency contact phone found' }, { status: 404 });
        }

        const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const notificationOpts = {
            toBinding: JSON.stringify({
                binding_type: 'sms',
                address: emergencyContactPhone,
            }),
            body: `${userName} is having a panic attack. They have set you as their emergency contact. Their current location is ${googleMapsLink}. Please contact them as soon as possible.`,
        };

        const notification = await client.notify
            .services(process.env.TWILIO_SERVICE_SID)
            .notifications.create(notificationOpts);

        return NextResponse.json({ message: 'SMS sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending SMS:', error);
        return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
    }
}