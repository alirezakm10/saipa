
'use client'
import { Typography } from "@mui/material";


interface Props {
    fileRejections: any;
}

const RejectedFiles: React.FC<Props> = ({ fileRejections }) => {
  return (
    fileRejections?.length > 0 && <>
<Typography component='h2' variant='h4' color='error' >فایل های رد شده</Typography>
   { fileRejections?.map((file: any, idx:number) => (
           <li key={idx} >{file.name}</li>
    ))}
</>
)
};

export default RejectedFiles;
