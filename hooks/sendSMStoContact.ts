import { auth } from "@/lib/firebase";

import axios from "axios";

export const sendSMStoContact = async () => {

    const user = auth.currentUser;

    if (!user) {
        console.log('No authenticated user found');
        return;
    }

    try {
        const position: GeolocationPosition = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        console.log(user.uid);

        const response = await axios.post('/api/sendSMS', {
            userId: user.uid,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });

        if (response.status !== 200) {
            throw new Error('Failed to send SMS');
        }

        console.log('SMS sent to emergency contact');
        return true;
        
    } catch (error) {
        console.log('Error sending SMS to emergency contact:', error);
        return false;
    }
}
