import UpdateTender from "@/components/adminpanel/other/tenders/UpdateTender"

const page = ({params} : {params: { id: string }}) => {
  return <UpdateTender id={params.id} />
}

export default page