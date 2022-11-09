import React from 'react'
import { RiShareBoxFill } from "react-icons/ri"
export default function ProfileDialog() {
    return (
        <>
            <div className="w-1/5 bg-white shadow-2xl h-1/2 border-4 border-black-500/50 ... rounded-2xl relative">
                <div className='absolute text-xl bg-white rounded-sm right-2 top-2 hover:cursor-pointer'>
                    <RiShareBoxFill />
                </div>
                <div className='m-2'>
                    <img className='h-48 mx-auto' src="300Logo.png"></img>
                    <h1 className='text-center'>Priyanshu Raj</h1>
                    <h1 className='text-center'>priyanshuraj6649@gmail.com</h1>
                </div>
                <hr></hr>
                <div className='m-2'>
                    <div className='flex justify-around'>
                        <button className='px-4 py-2 m-4 bg-white border shadow-inner rounded-xl border-slate-300 hover:border-indigo-300 '>Logout</button>
                        <button className='px-4 py-2 m-4 bg-white border shadow-inner border-slate-300 hover:border-indigo-300 rounded-xl'>Help</button>
                    </div>
                </div>

            </div>
        </>
    )
}
