"use client";
import { Button } from "@/components/button";
import { TextField } from "@/components/field";
import { urlApi } from "@/data/variables";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('test@gmail.com');
    const [password, setPassword] = useState('123456');
    const [err, setErr] = useState("")
    const handleSubmit = async () => {
        if(!email || !password) {
            setErr("Please complete the form");
            return;
        }else{
            setErr("")
        }
        try {
            await axios.post(`${urlApi}login`, {
                email: email,
                password: password
            }, {
                withCredentials: true,
            });
            router.push('/dashboard');
        } catch (error: any) {
            if(error){
                console.log("error", error)
                setErr(error?.response?.data?.message)
            }
        }
    }
  return (
    <div className=" h-full flex items-center justify-center">
        <div className=" bg-slate-100 rounded-lg p-5">
            <div className=" text-gray-500 font-bold text-xl text-center my-6">Login</div>
            <div className="py-2 gap-6 flex-col flex">   
                <TextField
                    label="Email"
                    onChange={setEmail}
                    value={email}
                />
                <TextField
                    label="Password"
                    onChange={setPassword}
                    value={password}
                    password
                />
                {err && <div className=" text-xs text-red-800">{err}</div>}
                <Button
                    label="Submit"
                    onClick={handleSubmit}
                />
            </div>
            <div className=" text-sm font-light text-center mt-4">Don&apos;t have an account? <span onClick={()=>router.push('/register')} className="cursor-pointer text-emerald-950 font-semibold">Register here</span></div>
        </div>
    </div>
  )
}
