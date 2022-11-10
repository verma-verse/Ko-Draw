import React, { useState, useEffect } from 'react'
import { BsPersonCircle, } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { BsFillPencilFill } from 'react-icons/bs'
import styled from "styled-components";
import { popularProducts } from "./data";
import Photo from "./Photo"

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;
export default function Profile({ items }) {
    const [user, setUser] = useState("Anonymous")
    const [mail, setmail] = useState("anonymous@gmail.com")
    useEffect(() => {
        const name = sessionStorage.getItem("user");
        const email = sessionStorage.getItem("email") || "anonymous@gmail.com";

        if (name) {
            setUser(name);
            setmail(email);


        }
    }, [])
    return (
        <>
            <div className="w-full  bg-white shadow-2xl h-screen border-4 border-black-500/50 ... rounded-2xl relative">
                <div className='flex items-center justify-center w-full bg-green-300 h-11' >
                    <h1 className='text-2xl font-black'>
                        Ko Draw  Welcomes You !! {user}...</h1>
                </div>
                <div className='flex h-full'>
                    <div className='flex flex-col w-1/4 shadow-2xl bg-white-300'>
                        <img src='./300Logo.png' className='items-center rounded-full shadow-xl'></img>
                        <div className='mt-8 ml-8 text-2xl'>
                            <BsPersonCircle />
                            <h1 className=''>{user}</h1>

                        </div>
                        <div className='mt-8 ml-8 text-2xl '>
                            <MdEmail />
                            <h1 className=''>{mail}</h1>

                        </div>
                        <div className='mt-8 ml-8 text-2xl'>
                            <BsFillPencilFill />
                            <h1 className=''>Writer Self</h1>

                        </div>
                    </div>
                    <div className='flex justify-between w-3/4 shadow-xl bg-slate-300'>
                        <Container>
                            {popularProducts.map((item) => (
                                <Photo item={item} key={item.id} />
                            ))}
                        </Container>

                    </div>


                </div>


            </div>
        </>
    )
}
