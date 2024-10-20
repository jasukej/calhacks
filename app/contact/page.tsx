"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Progress from '@/components/Progress';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/Input';
import { CircleHelp } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { Switch } from '@/components/ui/switch';

type UserInfo = {
  name: string;
  phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  send_message?: boolean;
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
    return <div className="h-screen flex justify-center items-center">
        <ClipLoader
        color="#0f766e"
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-blue-200 px-[10rem] gap-x-8 flex flex-row items-center justify-center">
      <div className="w-1/2 pr-8">
        <h1 className="text-4xl font-bold font-mono text-teal-800 mb-4">Your Emergency Contact</h1>
        <span className="flex items-center gap-x-2">
          <CircleHelp strokeWidth={1.25} size={18} />
          <p className="text-sm text-gray-700">This info allows us to call your designated contact in case of an emergency.</p>
        </span>
      </div>

      <div className="w-1/2 bg-white p-8 rounded-lg shadow-md">
        {userInfo && !isEditing ? (
          <div className="space-y-4 relative">
            <div className="grid grid-cols-7 gap-4">
              <p className="font-semibold col-span-2 font-mono">Name</p> 
              <p className="col-span-5">{userInfo.emergency_contact_name}</p>

              <p className="font-semibold col-span-2 font-mono">Phone</p>
              <p className="col-span-5">{userInfo.emergency_contact_phone}</p>

              <p className="font-semibold col-span-2 font-mono">Relationship</p>
              <p className="col-span-5">{userInfo.emergency_contact_relationship}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-neutral-700 justify-end absolute -top-6 right-0 hover:bg-black font-mono w-fit rounded-full text-white font-bold text-sm py-2 px-4 mt-4 transition duration-300 ease-in-out transform"
            >
              EDIT INFO
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="send_message"
                render={({ field: { onChange, value } }) => (
                  <Switch checked={value} onCheckedChange={onChange} />
                )}
              />
              <label
                htmlFor="send_message"
                className="text-sm font-mono font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Send SMS emergency alert?
              </label>
            </div>
            <Input id="name" label="Your Name" control={control} />
            <Input id="phone" label="Your Phone" control={control} />
            <Input id="emergency_contact_name" label="Emergency Contact Name" control={control} />
            <Input id="emergency_contact_phone" label="Emergency Contact Phone" control={control} />
            <Input id="emergency_contact_relationship" label="Relationship" control={control} />
            
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 font-mono text-white rounded-full font-bold py-2 px-4 transition duration-300 ease-in-out transform"
              >
                SAVE INFO
              </button>
              {userInfo && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border-[2px] font-mono hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform"
                >
                  CANCEL
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
