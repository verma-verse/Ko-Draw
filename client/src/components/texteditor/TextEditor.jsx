import React from 'react'
import { AiOutlineStrikethrough } from 'react-icons/ai'
import { BiItalic } from 'react-icons/bi'
import { BsChatLeftText, BsChatRightText, BsEmojiSmile, BsTextCenter } from 'react-icons/bs'
import { FaBold, FaUnderline } from 'react-icons/fa'
import { MdSubscript, MdSuperscript } from 'react-icons/md'


export default function TextEditor() {
    return (
        <>
            <div className='w-1/5 h-16 rounded-sm shadow-2xl bg-white-500'>
                <div className='flex mt-3'>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <FaBold />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <FaUnderline />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <BiItalic />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <AiOutlineStrikethrough />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <MdSubscript />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <MdSuperscript />
                    </div>

                    <div className="relative inline-block ml-4 text-black group">
                        <button className="px-2 text-black border rounded-md text-md">
                            Font
                        </button>
                        <div className="z-50 hidden bg-gray-200 shadow-md group-hover:block min-w-32">
                            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
                                Arial
                            </a>
                            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
                                Montype Coursive
                            </a>
                            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
                                Arail Black
                            </a>
                        </div>
                    </div>
                    <div className="relative inline-block ml-10 text-black group">
                        <button className="px-2 text-black border rounded-md text-md">
                            Size
                        </button>
                        <div className="z-50 hidden bg-gray-200 shadow-md group-hover:block min-w-32">
                            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
                                10
                            </a>
                            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
                                12
                            </a>
                            <a className="block px-4 py-3 text-black hover:bg-white" href="#">
                                16
                            </a>
                        </div>
                    </div>
                </div>
                <div className='flex mt-2 '>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <BsTextCenter />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <BsChatLeftText />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <BsChatRightText />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <BsEmojiSmile />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <AiOutlineStrikethrough />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <AiOutlineStrikethrough />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <AiOutlineStrikethrough />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <AiOutlineStrikethrough />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <AiOutlineStrikethrough />
                    </div>
                    <div className='flex items-center justify-center w-6 h-6 ml-3 border-2 shadow-3xl'>
                        <AiOutlineStrikethrough />
                    </div>


                </div>

            </div >

        </>


    )
}
