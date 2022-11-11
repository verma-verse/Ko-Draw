import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../Navbar/NavBar'

export default function HomePage() {
    const [tokenOp, setTokenOp] = useState(false);
    const joinPaint = () => {

    }
    return (
        <div>
            <NavBar />
            {tokenOp && <div className="absolute top-0 left-0 z-50 grid w-screen h-screen bg-gray-500 place-items-center opacity-60">
                <div className="p-8 bg-white rounded-lg">
                    <input className="px-2 py-1 text-2xl font-bold text-blue-500 bg-white border-2 border-blue-600 rounded-md" type="text" placeholder="Enter token here" />
                    <div className="flex justify-around mt-4">
                        <button onClick={joinPaint} className="px-6 py-1 text-xl text-white bg-blue-500 rounded-md hover:bg-blue-700 ">Join</button>
                        <button className="px-3 py-1 text-xl text-white bg-blue-500 rounded-md hover:bg-blue-700" onClick={() => setTokenOp(false)}>Cancel</button>
                    </div>
                </div >
            </div>}
            <div className='grid h-screen place-items-center'>
                <Link to="/board" className='px-3 py-2 text-xl font-bold text-white bg-blue-500 rounded-md'>New Board</Link>
                <button onClick={() => setTokenOp(true)} className='px-3 py-2 text-xl font-bold text-white bg-blue-500 rounded-md'>Join with Token</button>
            </div>
        </div>
    )
}
