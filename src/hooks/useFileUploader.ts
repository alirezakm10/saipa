import { useCallback } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import {
  setIsUploading,
  setUploadProgress,
  setClearFilesStates
} from '@/redux/features/filemanagerSlice';
import useToast from './useToast';
import axios from 'axios'
import { useSession } from 'next-auth/react';


type FileType = "image" | "video" | "text";

export const useFileUploader = (directory: string) => {
  const { data: session } = useSession()
  const showToast = useToast()
  const dispatch = useAppDispatch()


  const handleUploadFiles = async (filesToUpload: any = [], fileType: FileType) => {

    dispatch(setClearFilesStates())

    try {
      dispatch(setIsUploading(true))
      const formData = new FormData();
      formData.append(`directory`, directory);
      filesToUpload.forEach((eachFile: any, idx: number) => {
        formData.append(`file[${idx}]`, eachFile)
      })
   
      const URL = process.env.NEXT_PUBLIC_API_URL + "/admin/files/upload";
      await axios
        .post(URL, formData, {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
          onUploadProgress: (upload: any) => {
            let progress = Math.round((100 * upload.loaded) / upload.total);
            dispatch(setUploadProgress(progress))
          },
        })
        .then((data: any) => {
          showToast(data.data.message, "success");
          dispatch(setClearFilesStates())
        })
    } catch (err) {
      showToast("خطایی رخ داد!", "error");
    }
    dispatch(setIsUploading(false))
  }



  const categorizeFiles = useCallback((filesToUpload: File[]) => {
    const newImgFiles = filesToUpload.filter(file => file.type.startsWith("image/"))
    const newDocFiles = filesToUpload.filter(file => file.type.startsWith("text/") || file.type.startsWith("application/pdf"));
    const newVideoFiles = filesToUpload.filter(file => file.type.startsWith("video/"));



    if (newImgFiles.length > 0) {
      handleUploadFiles(newImgFiles, "image")
    } else if (newDocFiles.length > 0) {
      handleUploadFiles(newDocFiles, "text")
    } else if (newVideoFiles.length > 0) {
      handleUploadFiles(newVideoFiles, "video")
    }
  }, []);
  
  
  return { categorizeFiles};
};
