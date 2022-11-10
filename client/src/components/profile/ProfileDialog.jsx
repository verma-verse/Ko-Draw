import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { RiShareBoxFill } from "react-icons/ri"
import { useNavigate } from 'react-router-dom';

export default function ProfileDialog() {
    const [name, setName] = useState(null);
    const [dp, setDp] = useState(null);
    const [mail, setmail] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        const user = sessionStorage.getItem("firstName");
        const photo = sessionStorage.getItem("dp")
        const gmail = sessionStorage.getItem("email")

        if (user) setName(user);
        if (photo) setDp(photo);
        if (gmail) setmail(gmail);
    }, []);
    // useEffect(()=>{
    //     if(!name)
    // },[name])
    const logout = () => {
        sessionStorage.clear();
        document.cookie = "jwtCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        setName(null)
        setDp(null)
        setmail(null)
    }
    return (
        <>
            <div className="absolute z-50 w-1/5 bg-white shadow-2xl right-2 top-14 rounded-2xl">
                <div onClick={() => navigate('/profile')} className='absolute z-50 text-xl bg-white rounded-sm right-2 top-2 hover:cursor-pointer'>
                    <RiShareBoxFill />
                </div>
                <div className='m-2 '>
                    <img className='h-48 mx-auto' src={dp}></img>
                    <h1 className='text-center'>{name}</h1>
                    <h1 className='text-center'>{mail}</h1>
                </div>
                <hr></hr>
                <div className='m-2'>
                    <div className='flex justify-around'>
                        <button onClick={logout} className='px-4 py-2 m-4 bg-white border shadow-inner rounded-xl border-slate-300 hover:border-indigo-300 '>Logout</button>
                        <button className='px-4 py-2 m-4 bg-white border shadow-inner border-slate-300 hover:border-indigo-300 rounded-xl'>Help</button>
                    </div>
                </div>
            </div>
        </>
    )
}
