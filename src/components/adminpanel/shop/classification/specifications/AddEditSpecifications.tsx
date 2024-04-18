'use client'
import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  CircularProgress,
  useTheme,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import {
  CheckboxMenuList,
  SharedCategory,
  Specification,
} from "../categories/typescope";
import Chip from "@mui/material/Chip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetSpecificationsListQuery,
  useDeleteSpecificationsMutation,
  useAddSpecificationMutation,
} from "@/redux/services/shop/productsClassificationApi";
import Swal from "sweetalert2";
import useToast from "@/hooks/useToast";
import { tokens } from "@/theme";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { btnVariants } from "../animationVariants";
import DeleteIcon from '@mui/icons-material/Delete';
import usePermission from "@/hooks/usePermission";

interface AddSpecification {
  title: string;
}

const AddEditSpecifications = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const { hasPermission } = usePermission();
  // get queries
  const {
    data: specificationsList,
    isLoading: specificationsLoader,
    isSuccess,
    isLoading,
  } = useGetSpecificationsListQuery("");
  // mutations
  const [
    deleteSpecifications,
    { isLoading: deleteLoader, isSuccess: deleteStatus, data: deleteResult },
  ] = useDeleteSpecificationsMutation();
  const [
    addSpecifications,
    { isLoading: addLoader, isSuccess: addStatus, data: addResult },
  ] = useAddSpecificationMutation();

  // default states
  const [deletionArray, setDeletionArray] = useState<number[]>([]);
  const [additionArray, setAdditionArray] = useState<AddSpecification[]>([]);

  const [modified, setIsModified] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");


  const [error, setError] = useState<boolean>(false)
  const [duplicateInput, setDuplicateInput] = useState<string>('')



  const handleAddField = () => {
    setAdditionArray([...additionArray, {title:''}])
  };


  const handleAddSpecification = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (additionArray.length > 0) {
      const newArray = [...additionArray]; // Create a copy of the array
      newArray[id].title = e.currentTarget.value; // Modify the copy
      setAdditionArray(newArray); // Set the state with the modified copy
    }
  }


  // this method fill the deletion array
  const handleDelete = (obj: Specification) => {
    setDeletionArray([...deletionArray, obj.id]);
    setIsModified(true)
  };

  // this method send request ti backend to exclude deleted items from db
  const saveDeleted = ():void => {
    deleteSpecifications(deletionArray)
  }

  const handleSave = () => {
    addSpecifications(additionArray)
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
  }, [deleteStatus, deleteResult]);

  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success");
    }
  }, [addStatus, addResult]);


    const filteredSpecifications = specificationsList?.filter(
      (specification: Specification) =>
        specification.title.includes(searchQuery) &&
        !deletionArray.includes(specification.id)
    );
  



  let content;

  if (isSuccess) {
    content = (
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          my={1}
        >
          <Typography component='h1' variant="h5"  >مدیریت تمام ویژگی ها</Typography>
          <TextField
            label="جستجو"
            onChange={handleSearch}
            value={searchQuery}
          />
          {/* reusble component get items as prop for checkbox dropdown */}
        </Box>
        <Box>
          <Divider />

          <Box display='flex' flexDirection='column'  gap='20px' alignItems='center' my={2}>
            <Stack direction="row" spacing={2} >
              {hasPermission("Classification.create") && <Button
                onClick={handleAddField}
                endIcon={<AddCircleOutlineIcon />}
              >
                افزودن ویژگی
              </Button>}
            </Stack>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                  justifyContent:'center'
                }}
              >
                {additionArray.map((field, idx) => (
                  <TextField value={field.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddSpecification(e, idx)}
                  key={idx} label="نام ویژگی" />
                ))}
              </Box>
          
            {additionArray.length > 0 && (
              <Stack direction="row" spacing={3}>
                <LoadingButton
                  size="small"
                  color="primary"
                  disabled={addLoader}
                  loading={addLoader}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={handleSave}
                >
                  ذخیره
                </LoadingButton>

                <LoadingButton
                  size="small"
                  color="primary"
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

          {specificationsList?.length > 0 ? (
            <>
              <AnimatePresence>
                {modified && (
                  <motion.div
                    initial={btnVariants.initial}
                    exit={btnVariants.hidden}
                    variants={btnVariants}
                    animate={modified ? "visible" : "hidden"}
                  >
                    <LoadingButton
                      size="small"
                      color="error"
                      onClick={saveDeleted}
                      disabled={deleteLoader}
                      loading={deleteLoader}
                      loadingPosition="start"
                      startIcon={<DeleteIcon />}
                      variant="contained"
                      sx={{my:2}}
                    >
                      ثبت
                    </LoadingButton>
                  </motion.div>
                )}
              </AnimatePresence>
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                width="100%"
                height="100%"
                gap={2}
                sx={{ p: 1 }}
              >
                {filteredSpecifications?.map(
                  (specification: Specification, idx: number) => (
                    <Chip
                      key={idx}
                      label={specification.title}
                      variant="outlined"
                      color={specification.isModified ? "success" : "default"}
                      onDelete={hasPermission("Classification.edit") || specification.isModified ? () => handleDelete(specification) : undefined}
                    />
                  )
                )}
              </Box>
            </>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center">
              ویژگی برای این محصول ثبت نشده است
            </Box>
          )}
        </Box>
      </>
    );
  }

  if (isLoading) {
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50%"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return content;
};

export default AddEditSpecifications;
