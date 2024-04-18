import React, { ChangeEvent, useEffect, useState } from 'react';
import { selectPickedForMainAttach, setMetaEditorUndergone } from '@/redux/features/filemanagerSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { Box, Button, TextField } from '@mui/material';
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import type { FileManagerType } from './typescope';

interface IProps {
  identifier: string;
  file: any;
}

const DynamicMetaAttacher: React.FC<IProps> = ({ identifier, file }) => {
  const dispatch = useAppDispatch();
  const pickedFiles = useAppSelector(selectPickedForMainAttach);

  const [inputValues, setInputValues] = useState({
    title: '',
    link: '',
    alt: '',
  });

  useEffect(() => {
    const selectedFile = pickedFiles.find((pickedFile:FileManagerType) => pickedFile.id === file.id);

    setInputValues({
      title: identifier === 'slider' ? (selectedFile?.title || '') : '',
      link: identifier === 'slider' ? (selectedFile?.link || '') : '',
      alt: selectedFile?.alt || '',
    });
  }, [file, pickedFiles, identifier]);

  const handleInputChanges = (e: ChangeEvent<HTMLInputElement>, property: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [property]: e.target.value,
    }));

    const updatedFiles = pickedFiles.map((pickedFile: FileManagerType) =>
      pickedFile.id === file.id ? { ...pickedFile, [property]: e.target.value } : pickedFile
    );

    dispatch(setMetaEditorUndergone(updatedFiles));
  };

  const handleToggleDefault = () => {
    const updatedFiles = pickedFiles.map((pickedFile: FileManagerType) =>
      pickedFile.id === file.id
        ? { ...pickedFile, is_default: 1 } // Set is_default to 1 for the selected file
        : { ...pickedFile, is_default: 0 } // Set is_default to 0 for other files
    );

    dispatch(setMetaEditorUndergone(updatedFiles));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        p: 1
      }}
    >
      {identifier === 'slider' && (
        <>
          <TextField
            value={inputValues.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChanges(e, 'title')}
            id="outlined-basic"
            label="برچسب"
            variant="outlined"
          />
          <TextField
            value={inputValues.link}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChanges(e, 'link')}
            id="outlined-basic"
            label="لینک"
            variant="outlined"
          />
        </>
      )}
      <TextField
        value={inputValues.alt}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChanges(e, 'alt')}
        id="outlined-basic"
        label="تگ عکس"
        variant="outlined"
      />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <p>شاخص کردن تصویر</p>
        <Button
        sx={{
          border:file?.is_default === 1 ? '5px solid green' : '',
        }}
        onClick={handleToggleDefault} variant="text">
          <CenterFocusStrongIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default DynamicMetaAttacher;
