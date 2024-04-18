'use client'
import UpdateDocs from "@/components/adminpanel/docs/updateDocs/UpdateDocs"

const page = ({ params }: { params: { id: string } }) => {


  return <UpdateDocs id={params.id} />
}

export default page