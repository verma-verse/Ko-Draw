import React from 'react'
import { BsPersonCircle, } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { BsFillPencilFill } from 'react-icons/bs'
export default function Profile() {
    return (
        <>
            <div className="w-5/6 mx-auto bg-white shadow-2xl h-screen border-4 border-black-500/50 ... rounded-2xl relative">
                <div className='flex items-center justify-center w-full bg-green-300 h-11' >
                    <h1 className='text-2xl font-black'>
                        Ko Draw  Welcomes You !! Priyanshu...</h1>
                </div>
                <div className='flex h-full'>
                    <div className='flex flex-col w-1/4 shadow-2xl bg-white-300'>
                        <img src='./300Logo.png' className='items-center rounded-full shadow-xl'></img>
                        <div className='mt-8 ml-8 text-2xl'>
                            <BsPersonCircle />
                            <h1 className=''>Priyanshu Raj</h1>

                        </div>
                        <div className='mt-8 ml-8 text-2xl '>
                            <MdEmail />
                            <h1 className=''>priyanshuraj6649@gmail.com</h1>

                        </div>
                        <div className='mt-8 ml-8 text-2xl'>
                            <BsFillPencilFill />
                            <h1 className=''>Writer Self</h1>

                        </div>
                    </div>
                    <div className='flex justify-between w-3/4 shadow-xl bg-slate-300'>
                        <div className='flex justify-between w-full'>
                            <div className=''>
                                <img src='./images.jpeg' className='transition duration-300 ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500'></img>
                            </div>
                            <div className=''>
                                <img src='./images.jpeg' className='transition duration-300 ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500'></img>
                            </div>
                            <div className=''>
                                <img src='./images.jpeg' className='transition duration-300 ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500'></img>
                            </div>
                            <div className=''>
                                <img src='./images.jpeg' className='transition duration-300 ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500'></img>
                            </div>
                        </div>
                    </div>


                </div>


            </div>
        </>
    )
}
