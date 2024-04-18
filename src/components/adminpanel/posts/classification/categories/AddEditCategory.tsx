"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Button,
  Tooltip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { useDeletePostCategoryMutation, useAddPostsCategoriesMutation, useUpdatePostCategoryMutation } from "@/redux/services/contents/postCalssificationApi";
import { SharedCategory } from "./typescope";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import useToast from "@/hooks/useToast";
import { AddCategories } from "./typescope";
import { setSelectedPostCategory,selectedPostCategory } from "@/redux/features/contents/postsClassificationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import usePermission from "@/hooks/usePermission";

interface AddedFieldsType {
  parent_id: number;
  title: string;
}

const AddEditCategory: React.FC<SharedCategory> = () => {
  const dispatch = useAppDispatch();
  const selectedCat = useAppSelector(selectedPostCategory);
  const showToast = useToast();
  const [rename, setRename] = useState<string>("")
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { hasPermission } = usePermission();

  const [
    updatePostCategory,
    { isLoading: updateLoader, isSuccess: updateStatus, data: updateResult },
  ] = useUpdatePostCategoryMutation();
  const [
    deletePostCategory,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeletePostCategoryMutation();
  const [
    addPostsCategories,
    { isLoading: addLoader, isSuccess: addStatus, data: addResult },
  ] = useAddPostsCategoriesMutation();

  const [additionArray, setAdditionArray] = useState<AddCategories[]>([]);

  // save new subCategories
  const handleSave = (): void => {
    addPostsCategories(additionArray);
  };

  const handleAddCategory = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (additionArray.length > 0) {
      const newArray = [...additionArray]; // Create a copy of the array
      newArray[id].title = e.target.value; // Modify the copy
      setAdditionArray(newArray); // Set the state with the modified copy
    }
  };

  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    updatePostCategory({ parent_id: id, title: rename });
    setRename("");
  };

  const handleAddField = (id: number) => {
    setAdditionArray([...additionArray, { parent_id: id, title: "" }]);
  };



  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success");
    }
  }, [addStatus, addResult]);

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
      setAdditionArray([]);
    }
  }, [updateStatus, updateResult]);

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
      deleteTimeoutRef.current = setTimeout(() => {
        dispatch(setSelectedPostCategory({}));
        setAdditionArray([]);
      }, 2000);
    }
    setAdditionArray([]);
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
        deleteTimeoutRef.current = null;
      }
    };
  }, [deleteResult])

  return (
    <Box display="flex" flexDirection="column" gap="20px" alignItems="center">
      <Typography>{selectedCat?.title}</Typography>
      <TextField
        label="ویرایش نام دسته"
        value={rename}
        onChange={(e) => setRename(e.currentTarget.value)}
        placeholder={selectedCat?.title}
      />
      <Stack direction="row" spacing={2}>
        {rename.length > 0 && (
          <LoadingButton
            size="small"
            color="primary"
            disabled={updateLoader}
            loading={updateLoader}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={(e) => handleUpdate(e, selectedCat.id)}
          >
            بروزرسانی
          </LoadingButton>
        )}

     { hasPermission("Classification.delete") &&  <Tooltip title="حذف کامل دسته با زیر دسته های آن">
          <LoadingButton
            size="small"
            color="error"
            disabled={deleteLoader}
            loading={deleteLoader}
            loadingPosition="center"
            variant="contained"
            onClick={() => deletePostCategory([selectedCat.id])}
          >
            <DeleteIcon />
          </LoadingButton>
        </Tooltip>}
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button
          onClick={() => handleAddField(selectedCat.id)}
          endIcon={<AddCircleOutlineIcon />}
        >
          افزودن زیر دسته
        </Button>
      </Stack>

      {additionArray.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {additionArray.map((field, idx) => (
            <TextField
              key={idx}
              value={field.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAddCategory(e, idx)
              }
              label="نام زیر دسته"
            />
          ))}
        </Box>
      ) : (
        <Typography>هنوز زیر دسته ای اضافه نکرده اید</Typography>
      )}

      {additionArray.length > 0 && (
        <Stack direction="row" spacing={3}>
          <LoadingButton
            size="small"
            color="primary"
            onClick={handleSave}
            disabled={addLoader}
            loading={addLoader}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
          >
            ذخیره
          </LoadingButton>

          <LoadingButton
            size="small"
            color="primary"
            // onClick={handleSave}
            // disabled={mutationLoader}
            // loading={mutationLoader}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={() => setAdditionArray([])}
          >
            ریست
          </LoadingButton>
        </Stack>
      )}
    </Box>
  );
};

export default AddEditCategory;
