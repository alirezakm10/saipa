"use client";
import { useEffect, useState } from "react";
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
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
import { useGetDocsCategoriesQuery } from "@/redux/services/documents/docsClassificationApi";
import { tokens } from "@/theme";
import styles from "./styles.module.scss";
import CategoryTabs from "./MenusTab";
import CategoryIcon from "@mui/icons-material/Category";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUpdateMenuApiMutation } from "@/redux/services/settings/siteSettingsApi";
import { AddCategories } from "./typescope";
import useToast from "@/hooks/useToast";
import { selectedNewCategory, setSelectedNewCategory } from "@/redux/features/news/newsClassificationSlice";
import { setSelectMenu, selectedMenu, setMenuSynchronizer, selectSynchronizedMenu } from "@/redux/features/menus/menuClassificationSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
// this component renders treeviews as sidebar and tab contents component as content inside grid
import type { Category } from "./typescope";
import usePermission from "@/hooks/usePermission";
import { v4 as uuidv4 } from 'uuid';
import { updateMenu } from "@/utils/menuUtils";

interface Props {
  returnedMenu: any;
}

const Menus: React.FC<Props> = ({ returnedMenu }) => {
  const dispatch = useAppDispatch()
  const choosedMenu = useAppSelector(selectedMenu)
  const showToast = useToast()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { hasPermission } = usePermission()
  const syncedMenu = useAppSelector(selectSynchronizedMenu)


  const [addParentMenu, setAddParentMenu] = useState<any>({
    icon: null,
    link: '',
    menuId: uuidv4(),
    name: '',
    subMenus: [],
  });




  const [
    updateMenuApi,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error: updateErrorMsg,
      isError: updateErrorBoolean,
    },
  ] = useUpdateMenuApiMutation<any>();

  const handleAddParentMenu = async () => {
    // Update the synchronized menu state
    dispatch(setMenuSynchronizer({ ...syncedMenu, items: [...syncedMenu.items, addParentMenu] }))
    console.log('aaaaa:', syncedMenu)
    await updateMenuApi({ id: syncedMenu.config.menuNumber, patch: { ...syncedMenu } })
    console.log('addparent state after one submit', addParentMenu)
  };

  const handleMenuSelect = (node: any) => {
    dispatch(setSelectMenu(node))
  };

  const renderTree = (node: any) => {
    return (
      <TreeItem
        onClick={() => handleMenuSelect(node)}
        key={node?.menuId}
        nodeId={node?.menuId?.toString()}
        label={node?.name}
      >
        {Array.isArray(node.subMenus)
          ? node.subMenus.map((child: any) => renderTree(child))
          : null}
      </TreeItem>
    )
  }

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
      setAddParentMenu({
        icon: null,
        link: '',
        menuId: uuidv4(),
        name: '',
        subMenus: [],
      });
    }
    if (updateErrorMsg) {
      const errMsg = updateErrorMsg.data.message;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult]);




  useEffect(() => {
    dispatch(setMenuSynchronizer(returnedMenu))
  }, [])

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
            buttonTitle="افزودن منو سطح اول"
            buttonIcon={<AddCircleOutlineIcon />}
          >
            <Stack direction="row" spacing={3} p={1}>
              <TextField
                value={addParentMenu.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAddParentMenu({
                    icon: null,
                    link: '',
                    menuId: uuidv4(),
                    name: e.currentTarget.value,
                    subMenus: [],
                  })
                }
              />
              <LoadingButton
                onClick={handleAddParentMenu}
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

         <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronLeftIcon />}
          >

            {syncedMenu?.items?.map((menuItem: any) => renderTree(menuItem))}
          </TreeView>
        </Box>
      </Grid>
      <Grid item xs={12} md={9}>
        {choosedMenu.menuId ? (
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
              <span>منو ای انتخاب نشده است</span>
              <CategoryIcon sx={{ fontSize: "100px", opacity: 0.3 }} />
            </Stack>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}


export default Menus