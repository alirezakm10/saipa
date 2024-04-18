'use client'
import UserDetail from '@/components/adminpanel/users/userDetail/UserDetail'
import React from 'react'

const page = ({ params }: { params: { id: string } }) => {
  return <UserDetail id={params.id} />
}

export default page