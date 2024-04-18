'use client'
import React from 'react'
import UpdatePost from '@/components/adminpanel/posts/updatepost/UpdatePost'

const page = ({ params }: { params: { id: string } }) => {


  return <UpdatePost id={params.id} />
}

export default page