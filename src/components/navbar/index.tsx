'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
import axios from 'axios';

const NavBar = () => {
    const router = useRouter();
    const handleLogout = async () => {
        console.log("handleLogout")
        try {
            await axios.delete('http://127.0.0.1:7072/logout', {
                withCredentials: true,
            });
            router.push('/login');
        } catch (error) {
            console.log("error", error)
        }
    }
  return (
    <div className=" h-16 flex flex-row w-full bg-emerald-900 justify-between items-center">
        <div className='flex flex-row items-center cursor-pointer'>
            <div className=' text-xl font-normal text-white  px-6'>
                <span className=" font-extrabold">GitHub</span> Jobs
            </div>
            <div className=' text-emerald-100 text-sm'>
                Dashboard
            </div>
        </div>
        <div className=' text-white text-sm px-6 cursor-pointer' onClick={handleLogout
            // ()=>{
            // handleLogout()
            // console.log("hit");
            // router.push('/login')
        // }
        }>
            Logout
        </div>
    </div>
  )
}

export default NavBar