import * as Yup from "yup";

export const validationSchema = Yup.object({
  email: Yup.string()
    .email("ایمیل معتبر نیست.")
    .required("پر کردن فیلد الزامی است."),
  name: Yup.string().required("پر کردن فیلد الزامی است."),
  password: Yup.string()
    .min(8, "پسورد باید حداقل 8 رقم باشد")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\;:'",.<>/?~`])[A-Za-z\d!@#$%^&*()_+=[\]{}|\\;:'",.<>/?~`]+$/,
      "پسورد باید شامل حداقل یک حرف کوچک، یک حرف بزرگ و یک کاراکتر خاص باشد"
    )
    .required("پر کردن فیلد الزامی است."),
  password_confirmation: Yup.string().oneOf(
    [Yup.ref("password"), ""],
    "فیلد پسورد و تایید پسورد باید برابر باشد."
  ).required('پر کردن فیلد الزامی است.'),
  national_code: Yup.string().matches(
    /^\d{10}$/,
    "کد ملی باید 10 رقمی باشد."
  ),
  phone: Yup.string()
  .matches(/^[0-9]{11}$/, ' شماره تلفن باید عددی و به همراه کد باشد.'),
  mobile: Yup.string()
    .matches(/^0\d{10}$/, "شماره موبایل باید با صفر شروع شود و 11 رقم باشد")
    .required("پر کردن فیلد الزامی است."),
});

export const updateValidationSchema = Yup.object({
  email: Yup.string().email("ایمیل معتبر نیست."),
  password: Yup.string()
    .min(8, "پسورد باید حداقل 8 رقم باشد")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\;:'",.<>/?~`])[A-Za-z\d!@#$%^&*()_+=[\]{}|\\;:'",.<>/?~`]+$/,
      "پسورد باید شامل حداقل یک حرف کوچک، یک حرف بزرگ و یک کاراکتر خاص باشد"
    ),
  password_confirmation: Yup.string().oneOf(
    [Yup.ref("password"), ""],
    "فیلد پسورد و تایید پسورد باید برابر باشد."
  ),
  national_code: Yup.string().matches(/^\d{10}$/, "کد ملی باید ده رقمی باشد."),
  phone: Yup.string()
  .matches(/^[0-9]{11}$/, ' شماره تلفن باید عددی و به همراه کد باشد.'),
  mobile: Yup.string()
    .matches(/^0\d{10}$/, "شماره موبایل باید با صفر شروع شود و 11 رقم باشد")
    .required("پر کردن فیلد الزامی است."),
});

export const addressValidationSchema = Yup.object({
  city_id: Yup.object().required("پر کردن فیلد الزامی است."),
  postal_code: Yup.string().matches(
    /\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b/,
    "کدپستی معتبر نیست."
  ),
  address: Yup.string().required("پر کردن فیلد الزامی است."),
});
