import React from 'react'

export default function Profile() {
    return (
        <>
            <div className="w-5/6 mx-auto bg-white shadow-2xl h-screen border-4 border-black-500/50 ... rounded-2xl relative">
                <div className='flex items-center justify-center w-full bg-green-300 h-11' >
                    <h1 className='text-2xl font-black'>
                        Ko Draw  Welcomes You !! Priyanshu...</h1>
                </div>
                <div className='flex flex-col h-full border-solid '>
                    <div className='flex justify-between bg-green-400 h-1/2 '>
                        <div className='h-full bg-red-500'>
                            Hello
                        </div>
                        <div className='h-full bg-blue-400'>
                            Hi
                        </div>
                    </div>
                    <div className='bg-yellow-500 h-1/2 '>
                        Bye
                    </div>
                </div>

            </div>
        </>
    )
}
