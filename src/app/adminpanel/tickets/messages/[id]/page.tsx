'use client'
import React from 'react';
import Messages from '@/components/adminpanel/tickets/Messages';


const page = ({ params }: { params: { id: string } }) => {
  return <Messages id={params.id}   />
}

export default page