"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/Input";
import { Checkbox } from "@/components/ui/checkbox";

type UserInfo = {
  name: string;
  phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  send_message?: boolean; // Add this field for checkbox value
};

function ContactPage() {
  const [user, setUser] = useState<any | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<UserInfo>();

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);
      await fetchUserInfo(user.uid);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch user info from Firestore
  const fetchUserInfo = async (userId: string) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserInfo(docSnap.data() as UserInfo);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUserInfo(null);
    }
  };

  const onSubmit = async (data: UserInfo) => {
    if (!user) {
      router.push("/auth");
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, data, { merge: true });
      await fetchUserInfo(user.uid);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      reset(userInfo);
    }
  }, [userInfo, reset]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-blue-200 px-[10rem] gap-x-8 flex flex-row items-center justify-center">
      <div className="w-1/2 pr-8">
        <h1 className="text-4xl font-bold font-serif text-teal-800 mb-4">
          Emergency Contact Information
        </h1>
        <p className="text-sm text-gray-700 mb-4">
          If you are comfortable, please provide your emergency contact
          information. It allows us to contact your designated person in case of
          an emergency.
        </p>
      </div>
      <div className="w-1/2 bg-white p-8 rounded-lg shadow-md">
        {userInfo && !isEditing ? (
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {userInfo.emergency_contact_name}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {userInfo.emergency_contact_phone}
            </p>
            <p>
              <span className="font-semibold">Relationship:</span>{" "}
              {userInfo.emergency_contact_relationship}
            </p>
            <p>
              <span className="font-semibold">Send SMS:</span>{" "}
              {userInfo.send_message ? "Yes" : "No"}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300 ease-in-out transform"
            >
              Edit Information
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input id="name" label="Your Name" control={control} />
            <Input id="phone" label="Your Phone" control={control} />
            <Input
              id="emergency_contact_name"
              label="Emergency Contact Name"
              control={control}
            />
            <Input
              id="emergency_contact_phone"
              label="Emergency Contact Phone"
              control={control}
            />
            <Input
              id="emergency_contact_relationship"
              label="Relationship"
              control={control}
            />
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="send_message"
                render={({ field: { onChange, value } }) => (
                  <Checkbox checked={value} onCheckedChange={onChange} />
                )}
              />
              <label
                htmlFor="send_message"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Send SMS warnings?
              </label>
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform"
              >
                Save Information
              </button>
              {userInfo && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ContactPage;
