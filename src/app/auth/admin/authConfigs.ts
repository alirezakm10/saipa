import * as Yup from "yup";

export const registerStates = {
  username: "",
  device: "android",
  gender: "male",
  avatar_id: "sdgsfdghdfhgdfh",
  refferal_code: "",
  password: "",
  confirmpassword: "",
  terms:'',
}

export const registerSchema = Yup.object({
  username: Yup.string().required("username is required."),
  device: Yup.string().required("device recognition failed!"),
  gender: Yup.string().required("lastname is required."),
  avatar_id:Yup.string().required('you should choose a avatar!'),
  refferal_code: Yup.string(),
  password: Yup.string()
    .required("Please Enter your password")
    // .min(8, 'Password should be more than 8 chars')
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\;:'",.<>/?~`])[A-Za-z\d!@#$%^&*()_+=[\]{}|\\;:'",.<>/?~`]+$/
    // ,'At least one letter (uppercase or lowercase) and one special char')
    ,
  confirmpassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Passwords must match"),
  terms: Yup.array().required("Terms of service must be checked! ")
})



export const signinStates = {
  email:'',
  password:'', 
  remember:false
}

export const signinSchema = Yup.object({
  email: Yup.string().email().required('الزامی'),
  password: Yup.string().required('الزامی')
  .min(8, 'password should be more than 8 chars')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\;:'",.<>/?~`])[A-Za-z\d!@#$%^&*()_+=[\]{}|\\;:'",.<>/?~`]+$/
  ,'At least one letter (uppercase or lowercase) and one special char'),
  remember: Yup.boolean()
})


export const forgetPassStates = {
  email:'',
  mobile:''
}
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const forgetPassSchema = Yup.object({
  email: Yup.string().email(),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid')
})