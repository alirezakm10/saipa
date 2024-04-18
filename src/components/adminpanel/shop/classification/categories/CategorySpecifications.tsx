"use client";
import { useState, useEffect } from "react";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import CheckboxMenu from "./CheckboxMenu";
import { CheckboxMenuList, SharedCategory } from "./typescope";
import Chip from "@mui/material/Chip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetCategoryQuery,
  useGetSpecificationsListQuery,
  useUpdateSpecToCatMutation,
} from "@/redux/services/shop/productsClassificationApi";
import useToast from "@/hooks/useToast";
import { tokens } from "@/theme";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { btnVariants } from "../animationVariants";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectedProductCategory } from "@/redux/features/shop/productsClassificationSlice";
import TimeLoader from "@/components/shared/loaders/TimeLoader";
import usePermission from "@/hooks/usePermission";

const CategorySpecifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const selectedCat = useAppSelector(selectedProductCategory);
  const { hasPermission } = usePermission();
  const showToast = useToast();
  // get queries
  const {
    data: category,
    isSuccess,
    isLoading,
    isFetching,
  } = useGetCategoryQuery(selectedCat?.id, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: specificationsList,
    isSuccess: specificationsStatus,
    isLoading: specificationsLoader,
  } = useGetSpecificationsListQuery("");

  // mutations
  const [
    updateSpecToCat,
    {
      isLoading: mutationLoader,
      isSuccess: mutationStatus,
      data: mutationResult,
      error: mutationError,
    },
  ] = useUpdateSpecToCatMutation();
  const [specifications, setSpecifications] = useState<CheckboxMenuList[]>([]);

  const [modified, setIsModified] = useState<boolean>(false);

  const handleDelete = (obj: CheckboxMenuList) => {
    setSpecifications(
      specifications.filter((item) => item.title !== obj.title)
    );
    setIsModified(true);
  };

  const handleSave = () => {
    const idsArray = specifications.map((specification) => specification.id);
    updateSpecToCat({
      category_id: selectedCat?.id,
      specification_ids: idsArray,
    });
  };

  useEffect(() => {
    if (specificationsStatus) {
      setSpecifications(category?.specifications);
    }
    setSpecifications(category?.specifications);
  }, [isSuccess, isFetching, selectedCat]);

  useEffect(() => {
    if (mutationStatus) {
      showToast(mutationResult?.message, "success");
    }
    if (mutationError) {
      showToast("somthing went wrong", "error");
    }
  }, [mutationStatus, mutationResult, mutationError]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={1}
      >
        <Typography>
          لیست ویژگی های متصل شده به دسته بندی - {selectedCat?.title}
        </Typography>
        {
          hasPermission("Classification.edit") && <CheckboxMenu
            inputLabel="انتخاب ویژگی"
            buttonIcon={<AddCircleOutlineIcon />}
            allItems={specificationsList}
            attachedItems={specifications}
            setter={setSpecifications}
            setIsModified={setIsModified}
            buttonGuid="برای افزودن ویژگی های جدید از تب افزودن و ویرایش ویژگی ها اقدام کنید."
          />
        }
        {/* reusble component get items as prop for checkbox dropdown */}
      </Box>
      <Box>
        <Divider />
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
                color="primary"
                disabled={mutationLoader}
                loading={mutationLoader}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={handleSave}
                sx={{ my: 2 }}
              >
                ذخیره
              </LoadingButton>
            </motion.div>
          )}
        </AnimatePresence>

        {specifications?.length > 0 ? (
          <>
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
              {specifications?.map((specification: CheckboxMenuList, idx) => (
                <Chip
                  key={idx}
                  label={specification.title}
                  variant="outlined"
                  color={specification.isModified ? "success" : "default"}
                  onDelete={
                    hasPermission("Classification.edit") || specification.isModified
                      ? () => handleDelete(specification)
                      : undefined
                  }
                />
              ))}
            </Box>
          </>
        ) : isFetching || isLoading ? (
          <TimeLoader />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            my={2}
          >
            ویژگی برای این محصول ثبت نشده است
          </Box>
        )}
      </Box>
    </>
  );
};

export default CategorySpecifications;
