import * as Yup from "yup";
export const ticketSchema = Yup.object({
    title: Yup.string()
    .required("پر کردن فیلد الزامی است."),
    subject_id: Yup.string()
    .required("پر کردن فیلد الزامی است."),
    user_id: Yup.string().required("پر کردن فیلد الزامی است."),
    role_id: Yup.number().required("پر کردن فیلد الزامی است."),
    priority: Yup.number().required("پر کردن فیلد الزامی است."),
    content : Yup.string().required("پر کردن فیلد الزامی است.")

})


export const messageSchema = Yup.object({
    content : Yup.string().required("پر کردن فیلد الزامی است."),
})