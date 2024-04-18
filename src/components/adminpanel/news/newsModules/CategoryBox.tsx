"use client";
import {
  Paper,
  Box,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { TreeView } from '@mui/x-tree-view/TreeView'
import { TreeItem } from '@mui/x-tree-view/TreeItem'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { ContentCategory } from "../typescope";
import { tokens } from "@/theme";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectedCategory,
  setNews,
  selectedNews
} from "@/redux/features/news/newsSlice";
import { useGetNewsCategoryQuery } from "@/redux/services/news/newsApi";

interface Props{
  selectedId? : number;
}

const CategoryBox: React.FC<Props> = ({selectedId}) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const news = useAppSelector(selectedNews);
  const {
    data: categoryList,
    isSuccess,
    isLoading,
  } = useGetNewsCategoryQuery("");

  const handleCategorySelect = (node: ContentCategory) => {
    dispatch(
      setNews({ ...news, category_id: node.id, category_name: node.title })
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

  let content;

  if (isSuccess) {
    content = (
      <TreeView
        sx={{ width: "100%", my: 2 }}
        aria-label="category box"
        selected={selectedId?.toString()}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronLeftIcon />}
      >
        {categoryList.map((category: ContentCategory) => renderTree(category))}
      </TreeView>
    );
  }

  if (isLoading) {
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="100%"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

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
      <Box sx={{borderBottom: `1px solid ${colors.primary[300]}`, p:1 , position:"sticky" , top:0, zIndex: 2 , background:"inherit"  }} >
        دسته ها
      </Box>
      <Box sx={{height:"100%"}}>
      {content}
      </Box>
      ‌
    </Paper>
  );
};

export default CategoryBox;
