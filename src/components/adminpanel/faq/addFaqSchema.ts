import * as Yup from 'yup'

export const addFaqSchema = Yup.object({
    title: Yup.string().required('الزامی')
})