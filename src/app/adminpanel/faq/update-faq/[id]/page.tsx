import UpdateFaq from "@/components/adminpanel/faq/UpdateFaq"

const page = ({params} : {params: { id: string }}) => {
  return <UpdateFaq id={params.id} />
}

export default page