"use client"
import React, { FC, useEffect } from 'react';
import { Grid, Box, Button, Tooltip, Typography } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import useToast from '@/hooks/useToast';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectPickedForMainAttach, setDeleteMainAttachedFiles, setPickedFilesForMainAttach, setPickedFilesForMainAttachEmpty } from '@/redux/features/filemanagerSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ParentMenu from '@/components/shared/menus/ParentMenu';
import DynamicMetaAttacher from './DynamicMetaAttacher';


type AttachPermission = 'image' | 'video' | 'document';
// this type safty is for metaeditor logic
// what is metaeditor logic:
// we have a component named DynamicMetaEditorAttacher for now this component get to type slider and default as string if you pass slider to this comp
// returned 3 input for adding title link alt and one button for is_default an image from a array of images if you dont provide any identifier type is in type default that 
// provide just one button for is default with same logic and one input for alt attributes of tags like images
// this component is dynamic and ready for extends new features
// this is one of the seo building features
type MetaEditorIdentifiers = 'slider' | 'default';

interface IDynamicAttachPreview {
  fileType: AttachPermission[];
  metaEditorIdentifier?: MetaEditorIdentifiers;
}

const DynamicAttachPreview: FC<IDynamicAttachPreview> = ({ fileType, metaEditorIdentifier = 'default' }) => {
  const dispatch = useAppDispatch()
  const pickedFiles = useAppSelector(selectPickedForMainAttach)

  const renderFileContent = (file: any) => {
    console.log('inside sadgdshrdhtdhth:', file)
    const extension = file.path.split('.').pop()?.toLowerCase();
    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
      return (
        <Box
          sx={{
            position: 'relative',
            overflow:'hidden',
            width: '200px',
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border:file?.is_default === 1 ? '5px solid green' : '',
            borderRadius:'10px'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              opacity:0,
              transition:'.3s',
              zIndex: 1,
              display:'flex',
              flexDirection:'column',
              justifyContent:'center',
              alignItems:'center',
              gap:2,
              height:'100%',
              width:'100%',
              ":hover":{
                top:0,
              opacity:1,
                bgcolor:'rgba(0,0,0,.7)'
              }
            }}
          >
            <Button
              variant='outlined'
              color='error'
              sx={{
                height:'30px',
                width:"30px"
              }}
              onClick={() => dispatch(setDeleteMainAttachedFiles(file?.id))}
            >
              <DeleteIcon />
            </Button>
            <PhotoView key={file.id} src={`${file.downloadLink}`}>
              <Button
                variant="outlined"
                color='warning'
                sx={{
                  height:'30px',
                  width:"30px"
                }}
              >
                <VisibilityIcon />
              </Button>
            </PhotoView>
            <ParentMenu
            buttonTitle="ادیتور متا"
            buttonIcon={<BorderColorIcon />}
            color="warning"
          >
            <DynamicMetaAttacher file={file} identifier={metaEditorIdentifier} />
          </ParentMenu>
          </Box>
          <img draggable={false} src={file.downloadLink} alt={file.name} width="200px" height="200px" />
        </Box>

      );
    } else if (extension === 'mp4' || extension === 'webm' || extension === 'ogg') {
      return (
        <video controls width="300" height="200">
          <source src={file.downloadLink} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      )
    } else if (extension === 'pdf' || extension === 'docx' || extension === 'xlsx') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2, width: '200px', height: '200px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2, width: '200px', height: '200px' }}>
            <div style={{ fontSize: '60px' }}>
              <ArticleOutlinedIcon />
            </div>
            <a href={file.downloadLink} target="_blank">
              <button style={{ border: '1px solid green' }}>دانلود</button>
            </a>
          </div>
          <div style={{ textAlign: 'center', direction: 'rtl', marginBottom: '2px' }}>
            {file.name}
          </div>
        </div>
      );
    } else {
      return (
        <div>Unsupported file format: {extension}</div>
      );
    }
  };


  useEffect(() => {
    return () => {
      dispatch(setPickedFilesForMainAttachEmpty())
    }
  }, [])

  return (
    <Grid container spacing={2} >
{/* below container should show images */}
<Grid item xs={12} ></Grid>

{/* below container should show videos */}
<Grid item xs={12} ></Grid>

{/* below container should show docs */}
      <Grid item xs={12} >
        <Grid container spacing={2}>
          <PhotoProvider>
            {pickedFiles.map((file: any) => (
              <Grid item key={file.id}>
                {renderFileContent(file)}
              </Grid>
            ))}
          </PhotoProvider>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DynamicAttachPreview;
