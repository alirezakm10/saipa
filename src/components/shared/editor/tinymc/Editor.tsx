import React, { useState, useEffect, useRef, useCallback,FC } from "react";
import { Editor as Tinymce } from "@tinymce/tinymce-react";
import { useTheme } from "@mui/material";
import { Box } from '@mui/material';
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectedEditorContent, setEditorContent } from "@/redux/features/editorSlice";
import { selectPickedFilesForEditor, setShowFilemanager } from "@/redux/features/filemanagerSlice";

interface IEditor {
  fetchedContent?:string;
}

const Editor:FC<IEditor> = ({fetchedContent}) => {
  const dispatch = useAppDispatch();
  const editorContent = useAppSelector(selectedEditorContent);
  const theme = useTheme();
  const themeMode = theme.palette.mode;
  const pickedFiles = useAppSelector(selectPickedFilesForEditor);
  const editorRef = useRef<any>(null);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  const editorSkin = themeMode === 'dark' ? "oxide-dark" : "oxide";

  const handleAttachFiles = useCallback(async () => {
    await dispatch(setShowFilemanager(['textEditor']));
    setIsFileManagerOpen(true);
  }, [dispatch]);

  useEffect(() => {
    const insertContentAfterFileSelection = async () => {
      if (isFileManagerOpen && pickedFiles.length > 0) {
        const insertedFiles = pickedFiles.map((file: any) => {
          const extension = file.downloadLink.split('.').pop()?.toLowerCase();
          if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif') {
            return `<img src="${file.downloadLink}" alt="${file.name}" width="200px" height="200px" />`;
          } else if (extension === 'mp4' || extension === 'webm' || extension === 'ogg') {
            return `<video controls width="300" height="200">
                      <source src="${file.downloadLink}" type="video/${extension}">
                      Your browser does not support the video tag.
                    </video>`;
          } else if (extension === 'pdf' || extension === 'docx' || extension === 'xlsx' || extension === 'csv') {
            return `<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2; width: 200px; height: 200px;">
                      <!-- Your HTML content for PDF, docx, etc. -->
                    </div>`;
          } else {
            return `<div>Unsupported file format: ${extension}</div>`;
          }
        }).join('');

        const currentContent = editorRef.current.editor.getContent();
        const newContent = currentContent + insertedFiles;

        editorRef.current.editor.setContent(newContent);
        
        // Manually trigger the onEditorChange callback
        dispatch(setEditorContent(newContent));
        setIsFileManagerOpen(false);
      }
    };

    insertContentAfterFileSelection();

  }, [isFileManagerOpen, pickedFiles,dispatch])
  


  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: '400px', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Tinymce
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_APIKEY}
        onInit={(evt, editor) => {
          if (editorRef.current === null) {
            editorRef.current = { editor };
          }
        }}
        initialValue={fetchedContent? fetchedContent : ''}
        value={editorContent}
        init={{
          minHeight: '400px',
          height: '100%',
          width: "100vw",
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "addTestList | " +
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | link image " +
            "removeformat | help",
          skin: editorSkin,
          content_css: "dark",
          file_picker_types: 'file image media',
          images_file_types: 'jpg,svg,webp,png,jpeg',
          block_unsupported_drop: false,
          setup: function (editor) {
            editor.ui.registry.addButton('addTestList', {
              text: 'Attach',
              tooltip: 'Attach files from file manager',
              icon: 'gallery',
              onAction: handleAttachFiles,
            });
          },
        }}
        onEditorChange={(newValue, editor) => {
          dispatch(setEditorContent(newValue))
        }}
      />
    </Box>
  );
};

export default Editor;
