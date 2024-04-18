import AddSlider from "@/components/adminpanel/other/sliders/AddSlider"

const page = ({params} : {params: { id: string }}) => {
  return <AddSlider id={params.id}  />
}

export default page