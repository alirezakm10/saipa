'use client'
import {Typography } from "@mui/material";

interface Props {
    acceptedFiles: any;
}

const AcceptedFiles: React.FC<Props> = ({ acceptedFiles }) => {
  return (
    acceptedFiles?.length > 0 && <>
<Typography component='h2' variant='h4' >فایل های انتخابی مجاز</Typography>
    {acceptedFiles?.map((file: any, idx:number) => (
           <li key={idx} >{file.name}</li>
    ))}
</>
  )
};

export default AcceptedFiles;
