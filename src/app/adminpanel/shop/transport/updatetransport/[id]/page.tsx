import React from 'react'
import UpdateTransport from '@/components/adminpanel/shop/transport/UpdateTransport'

const page = ({params} : {params: { id: string }}) => {
  return <UpdateTransport id={params.id} />
}

export default page