import UpdateDiscount from "@/components/adminpanel/shop/discounts/UpdateDiscount"
const page = ({params} : {params: { id: string }}) => {
  return <UpdateDiscount id={params.id} />
}

export default page