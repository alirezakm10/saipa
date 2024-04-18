
import * as Yup from 'yup'

export const updateProductSchema = Yup.object({
    title: Yup.string().required("الزامی"),
    price: Yup.number().required("الزامی"),
    short_description: Yup.string().required("الزامی"),
    brand_id: Yup.string().required("الزامی"), // Add validation for brand_id
  })
  