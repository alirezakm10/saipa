import * as Yup from "yup";

export const validationSchema = Yup.object({
  name: Yup.string().required("پر کردن فیلد الزامی است."),
});
