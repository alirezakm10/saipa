'use client'
import UpdateProduct from "@/components/adminpanel/shop/updateProduct/UpdateProduct"

const page = ({params} : {params: { id: string }}) => {

  return <UpdateProduct id={params.id} />
}

export default page