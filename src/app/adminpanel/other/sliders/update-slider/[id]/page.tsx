import UpdateSlider from "@/components/adminpanel/other/sliders/UpdateSlider"

const page = ({params} : {params: { id: string }}) => {
  return <UpdateSlider id={params.id} />
}

export default page

