'use client'
import React from 'react'
import UpdateNews from '@/components/adminpanel/news/updatenews/UpdateNews'

const page = ({ params }: { params: { id: string } }) => {


  return <UpdateNews id={params.id} />
}

export default page