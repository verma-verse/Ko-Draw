import React, { useState, useEffect } from 'react'
import { BsPersonCircle, } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { BsFillPencilFill } from 'react-icons/bs'
import styled from "styled-components";
import { popularProducts } from "./data";
import Photo from "./Photo"
import NavBar from '../Navbar/NavBar';

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;
export default function Profile({ items }) {
    const [user, setUser] = useState("Anonymous")
    const [mail, setmail] = useState("anonymous@gmail.com")
    const [photo, setdp] = useState(null)
    useEffect(() => {
        const name = sessionStorage.getItem("firstName");
        const email = sessionStorage.getItem("email") || "anonymous@gmail.com";
        const im = sessionStorage.getItem("dp")

        if (name) {
            setUser(name);
            setmail(email);
            setdp(im);

        }
    }, [])
    return (
        <>
            <NavBar />
            <div className="w-full  bg-white shadow-2xl h-screen border-4 border-black-500/50 ... rounded-2xl relative">
                <div className='flex h-full'>
                    <div className='flex flex-col w-1/4 shadow-2xl bg-white-300'>
                        <img src={photo} className='items-center mt-8 rounded-full shadow-xl h-96'></img>
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
                    <div className='flex justify-between w-3/4 overflow-y-auto shadow-xl bg-slate-300'>
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
