import React from 'react'
import { sendWhatsApp } from './utils/sendWhatsApp'
import { useEffect, useState } from "react";
import api from './api/api'

const Whatsapp = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

const fetchMembers = async () => {
  try {
    const res = await api.get("admin/api/expiring_soon_members/");
    console.log(res.data);
    setMembers(res.data);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <>
<div className="flex justify-center items-center h-screen">
  <div>
    <h1>Expiring Members</h1>

    {members.map((member) => (
      <div key={member.id}>
        <p className="text-red-500">{member.name}</p>
        <p>{member.phone}</p>
        <p>{member.expiry_date}</p>

        <button
          className="px-4 py-2 bg-cyan-500 text-white"
          onClick={() => sendWhatsApp(member)}>
          SEND 
        </button>
      </div>
    ))}
  </div>
</div>
    </>
  )
}

export default Whatsapp
