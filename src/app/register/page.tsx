"use client";
import { Button } from "@/components/button";
import { TextField } from "@/components/field";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import axios from "axios";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState("")
    const handleSubmit = async () => {
        if(!name || !email || !password) {
            setErr("Please complete the form");
            return;
        }else{
            setErr("")
        }
        try {
            await axios.post('http://127.0.0.1:7072/register', {
                name: name,
                email: email,
                password: password
            });
            router.push('/login');
        } catch (error) {
            if(error){
                console.log("error", error)
            }
        }
    }
  return (
    <div className=" h-full flex items-center justify-center">
        <div className=" bg-slate-100 rounded-lg p-5">
            <div className=" text-gray-500 font-bold text-xl text-center my-6">Register</div>
            <div className="py-2 gap-6 flex-col flex">
                <TextField
                    label="Name"
                    onChange={setName}
                    value={name}
                />
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
                        // ()=>router.push('/login')}
                />
            </div>
            <div className=" text-sm font-light text-center mt-4">Have an account? <span onClick={()=>router.push('/login')} className="cursor-pointer text-emerald-950 font-semibold">Login here</span></div>
        </div>
    </div>
  )
}
