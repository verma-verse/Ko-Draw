import React from 'react'

export default function ProfileDialog() {
    return (
        <>
            <div className="w-1/3 bg-white shadow-2xl h-1/2">
                <div className='m-2'>
                    <img className='h-48 mx-auto' src="300Logo.png"></img>
                    <h1 className=''>Priyanshu Raj</h1>
                    <h1 className=''>priyanshuraj6649@gmail.com</h1>
                </div>
                <hr></hr>
                <div className='m-2'>
                    <button className='p-2 m-2 bg-green-300 rounded-xl'>My Profile</button>
                </div>
                <hr></hr>
                <div className='m-2'>
                    <div className='flex'>

                        <button className='p-2 pl-4 pr-4 m-4 bg-green-300 rounded-xl'>Logout</button>
                        <button className='p-2 pl-4 pr-4 m-4 mr-6 bg-green-300 rounded-xl'>Help</button>
                    </div>
                </div>

            </div>
        </>
    )
}
