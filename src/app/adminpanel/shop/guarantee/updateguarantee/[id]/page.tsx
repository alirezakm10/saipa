import React from 'react'
import UpdateGuarantee from '@/components/adminpanel/shop/guarantee/UpdateGuarantee'

const page = ({params} : {params: { id: string }}) => {
  return <UpdateGuarantee id={params.id} />
}

export default page