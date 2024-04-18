import React, { useEffect, useMemo } from "react";
import {
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { TreeView } from '@mui/x-tree-view/TreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useGetCategoriesQuery } from "@/redux/services/shop/productsClassificationApi";
import { ContentCategory } from "../typescope";
import { tokens } from "@/theme";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectedProduct,
  setProduct,
} from "@/redux/features/shop/productSlice";
import TimeLoader from "@/components/shared/loaders/TimeLoader";

const CategoryBox: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const product = useAppSelector(selectedProduct);

  const {
    data: categoryList,
    isSuccess,
    isLoading,
  } = useGetCategoriesQuery(4);

  const handleCategorySelect = (node: ContentCategory) => {
    dispatch(
      setProduct({
        ...product,
        category_id: node.id,
        category_name: node.title,
      })
    );
  };

  const renderTree = (node: ContentCategory) => (
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

  // Memoize the rendered tree
  const renderedTree = useMemo(() => {
    if (!isSuccess) {
      return null;
    }

    return (
      <TreeView
        sx={{ width: "100%", my: 2 }}
        aria-label="category box"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronLeftIcon />}
      >
        {categoryList.map((category: ContentCategory) => renderTree(category))}
      </TreeView>
    );
  }, [categoryList, isSuccess]);

  return (
    <Paper
      sx={{
        position: "relative",
        overflowY: "auto",
        height: "300px",
        width: "100%",
        border: `1px solid ${colors.primary[300]}`,
        borderRadius: "5px",
      }}
    >
      <Paper
        sx={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
          py: 2,
          px: 1,
        }}
      >
        <Typography>دسته ها</Typography>
      </Paper>
      {isLoading ? <TimeLoader /> : isSuccess && renderedTree}
    </Paper>
  );
};

export default CategoryBox;
