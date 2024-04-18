"use client";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
  Divider,
  TextField,
  Button,
  LinearProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useGetPostsCategoriesQuery, useAddPostCategoryMutation } from "@/redux/services/contents/postCalssificationApi";
import { tokens } from "@/theme";
import styles from "./styles.module.scss";
import CategoryTabs from "./CategoryTabs";
import CategoryIcon from "@mui/icons-material/Category";
import CircularProgress from "@mui/material/CircularProgress";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { AddCategories } from "./typescope";
import useToast from "@/hooks/useToast";
import { selectedPostCategory, setSelectedPostCategory } from "@/redux/features/contents/postsClassificationSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
// this component renders treeviews as sidebar and tab contents component as content inside grid
import type { Category } from "./typescope";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TreeView } from "@mui/x-tree-view/TreeView";
import usePermission from "@/hooks/usePermission";

export default function Categories() {
  const dispatch = useAppDispatch()
  const selectedCat = useAppSelector(selectedPostCategory)
  const showToast = useToast();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hasPermission } = usePermission();
  const { data: categories, isLoading, isSuccess } = useGetPostsCategoriesQuery(8);
  const [addParentCategory, setAddParentCategory] = useState<AddCategories>({
    parent_id: 0,
    title: "",
  });

  const [
    addPostCategory,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error: updateError,
    },
  ] = useAddPostCategoryMutation();

  const handleAddCategory = () => {
    addPostCategory(addParentCategory);
  };

  const handleCategorySelect = (node: Category) => {
    dispatch(setSelectedPostCategory(node))
  
  };


  const renderTree = (node: Category) => (
    <TreeItem
      onClick={() => handleCategorySelect(node)}
      key={node.id}
      nodeId={node.id.toString()}
      label={node.title}
    >
      {Array.isArray(node.children)
        ? node.children.map((child) => renderTree(child))
        : null}
    </TreeItem>
  );

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
      setAddParentCategory({ parent_id: 0, title: "" });
    }
  }, [updateStatus, updateResult]);




  return (
    <Grid container spacing={2}>
    <Grid item xs={12} md={3}>
     <Box
        sx={{
          mx: { xs: "auto", md: "inherit" },
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: "10px",
          p: 1,
          flexGrow: 1,
          maxWidth: 400,
          maxHeight: "600px",
          // minHeight: "600px",
          overflowY: "auto",
        }}
      >
        <Typography>دسته ها</Typography>

        {hasPermission("Classification.create") && <ParentMenu
          buttonTitle="افزودن دسته"
          buttonIcon={<AddCircleOutlineIcon />}
        >
          <Stack direction="row" spacing={3} p={1}>
            <TextField
              value={addParentCategory.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAddParentCategory({
                  parent_id: 0,
                  title: e.currentTarget.value,
                })
              }
            />
            <LoadingButton
              onClick={handleAddCategory}
              size="small"
              color="primary"
              variant="outlined"
              loading={updateLoader}
              disabled={updateLoader}
            >
              ثبت
            </LoadingButton>
          </Stack>
        </ParentMenu>}

        <Divider sx={{ my: 1 }} />

      {isLoading ? <LinearProgress /> :  <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronLeftIcon />}
        >
          {categories?.map((category: Category) => renderTree(category))}
        </TreeView>}
      </Box>
    </Grid>
    <Grid item xs={12} md={9}>
      {selectedCat.id ? (
        <CategoryTabs />
      ) : (
        <Box
          sx={{
            mx: { xs: "auto", md: "inherit" },
            border: `1px solid ${colors.primary[300]}`,
            borderRadius: "10px",
            p: 1,
            flexGrow: 1,
            minHeight: "600px",
            overflowY: "auto",
          }}
          className={styles.nothing_selected}
        >
          ‌
          <Stack direction="row" alignItems="center" spacing={2}>
            <span>دسته ای انتخاب نشده است</span>
            <CategoryIcon sx={{ fontSize: "100px", opacity: 0.3 }} />
          </Stack>
        </Box>
      )}
    </Grid>
  </Grid>
  );
}
