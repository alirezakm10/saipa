import UpdateGallery from "@/components/adminpanel/other/galleries/UpdateGallery"

const page = ({params} : {params: { id: string }}) => {
  return <UpdateGallery id={params.id} />
}

export default page

