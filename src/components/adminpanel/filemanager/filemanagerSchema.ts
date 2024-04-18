
import * as Yup from 'yup'

export const deleteFilesSchema = Yup.object({
    files: Yup.array().min(1).of(Yup.number().required()).required()
  })
  