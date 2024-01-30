import Head from "next/head";
import Navbar from "@/Components/Navbar";
import Link from "next/link";
import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");

    const supabase = useSupabaseClient();

    async function sendCode() {
        console.log("email entered:", email);
        const { data, error } = await supabase.auth.signInWithOtp({
            email: 'example@email.com',
            // options: {
            //   emailRedirectTo: 'https://example.com/welcome'
            // }
        });

        if (data) {
            console.log('verification code sent');
        }
        if (error) {
            console.error("Failed to send verification code", error);
        }
    }

    async function submitCode() {

        const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'magiclink' });

        if (data) {
            console.log("Signed in Succesfully", data)
        }
        if (error) {
            console.error("Failed to sign in", error)
        }
    }

    return (
        <>
            <Head>
                <title>Cybix</title>
            </Head>
            <div className="flex flex-col h-screen">
                {/* Navbar */}
                <Navbar />
                <div className="mx-auto max-w-md">
                    <div className="border self-center rounded-lg my-8 p-4 m-4">
                        <div className="text-center text-xl font-bold text-gray-800">
                            Log In - Cybix
                        </div>

                        <div className=" flex flex-col my-4">
                            <label className="font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                className="border p-2 rounded-md mt-1"
                                placeholder="john@doe.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                className="w-40 border text-sm font-medium px-4 py-2 mt-2 rounded-md bg-gray-50 hover:bg-gray-100"
                                onClick={sendCode}
                            >
                                Send Code
                            </button>
                        </div>

                        <div className=" flex flex-col my-4">
                            <label className="font-medium text-gray-600">
                                Verification Code
                            </label>
                            <input
                                type="password"
                                className="border p-2 rounded-md mt-1"
                                placeholder="123456"
                                onChange={(e) => setCode(e.target.value)}
                                value={code}
                            />
                            <button
                                onClick={submitCode}
                                className="w-40 border border-blue-600 text-sm font-medium px-4 py-2 mt-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Sign In
                            </button>
                        </div>

                        <p className="text-gray-600 text-sm prose">
                            {"By signing in, you agree to our "}
                            <Link href="/terms">terms of use</Link>
                            {" and "}
                            <Link href="/privacy">privacy policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
