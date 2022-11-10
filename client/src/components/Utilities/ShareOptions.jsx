import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ShareOptions({ paintRef, setShareOp }) {
  const [emails, setEmails] = useState([])
  const [paintId, setPaintId] = useState(null);
  const [link, setLink] = useState(null)
  const navigate = useNavigate();
  useEffect(() => {
    setPaintId(sessionStorage.getItem("paintId"))
    return (()=>{
      setLink(null);
      setEmails(null);
    })
  }, [])
  const getEmail = (e) => {
    setEmails(e.target.value);
  }
  const share = () => {
    const addresses = emails.split(/\b\s+(?!$)/)
    const user = sessionStorage.getItem("user")
    const title = sessionStorage.getItem("title")
    const url = `${process.env.REACT_APP_SERVER_URL}/api/paint/share`;
    if (!paintId) {
      const ctx = paintRef.current.getContext('2d')
      const imgd = paintRef.current.toDataURL("image/png")
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/paint/add/${user}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ imgString: imgd, title: "Untitled" })
      }).then(res => res.json())
        .then((res) => {
          if (!res.success)
            return window.alert(res.message);
          console.log(res.message);
          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ addresses, paintId, title, owner: user }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (!res.success)
                return window.alert(res.message);
              console.log(res.message)
              sessionStorage.setItem("paintId", res.paintId)
              sessionStorage.setItem("title", res.title)
            })
        })
        .catch((e) => {
          console.log(e.message);
        });
    } else {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addresses, paintId, title, owner: user }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.success)
            return window.alert(res.message);
          console.log(res.message)
          return navigate("/");
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  }

  const getToken = () => {
    const token = sessionStorage.getItem("paintId")
    if (!token)
      return window.alert("cannot generate token now..")
    setLink(token)
  }
  return (
    <div className="shadow-xl z-50 px-2 py-4 absolute w-1/4 bg-white rounded-md shadow-md right-3 top-12">
      <h1 className="text-xl">Add People by email</h1>
      <input onChange={getEmail} placeholder="type space separated emails" className="text-lg rounded-md  px-2 w-full bg-gray-200 " />
      {emails && emails !== "" && <button onClick={share} className="mt-2 px-2 py-1 bg-blue-400 text-white font-semibold rounded-md ">Share</button>}
      <h1 className="mt-3 text-xl">General Access</h1>
      {!link ? <button onClick={getToken} className="mt-2 px-2 py-1 bg-blue-400 text-white font-semibold rounded-md ">Get Token to share</button>
        : <div className="mx-1 rounded-md text-center px-2 py-1 bg-green-700 text-white font-semibold my-3">{link}</div>}
    </div>
  );
}
