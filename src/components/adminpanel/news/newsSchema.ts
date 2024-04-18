
import * as Yup from 'yup'

export const newsSchema = Yup.object({
    status: Yup.string().required("الزامی"),
    title: Yup.string().required("الزامی"),
    meta_title: Yup.string().required("الزامی"),
    meta_description: Yup.string().required("الزامی"),
    short_description: Yup.string().required("الزامی"),
  })
  