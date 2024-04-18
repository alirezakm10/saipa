"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Button,
  Tooltip,
  useTheme,
  LinearProgress,
  InputLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { AddMenuField, SharedCategory } from "./typescope";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import useToast from "@/hooks/useToast";
import { AddCategories } from "./typescope";
import { setSelectMenu,selectedMenu, selectSynchronizedMenu, setMenuSynchronizer } from "@/redux/features/menus/menuClassificationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import usePermission from "@/hooks/usePermission";
import { updateMenu } from "@/utils/menuUtils";
import { v4 as uuidv4 } from 'uuid';
import { tokens } from "@/theme";
import { data } from "jquery";
import { useUpdateMenuApiMutation } from "@/redux/services/settings/siteSettingsApi";


interface AddedFieldsType {
  parent_id: number;
  title: string;
}


const AddEditSubMenu: React.FC<SharedCategory> = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const dispatch = useAppDispatch();
  const choosedMenu = useAppSelector(selectedMenu)
  const showToast = useToast();
  const [rename, setRename] = useState<string>('');
  const [editLink, setEditLink] = useState<string>('');
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { hasPermission } = usePermission();
  const syncedMenu = useAppSelector(selectSynchronizedMenu)

  const [additionArray, setAdditionArray] = useState<AddMenuField[]>([]);

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

  const recursiveDataMiner = (data:any,id:number) => {
    data?.map((obj:any,idx:number)=>{
      if(choosedMenu.menuId === obj.menuId ){
        dispatch(setMenuSynchronizer({...data,items:[...data.items,]}))
      }else{
        recursiveDataMiner(obj.subMenus,obj.menuId)
        return
      }
    })
  }

  const handleSave = async () => {  
    if (!syncedMenu) {
      return;
    }
  
    const updatedSyncedMenu = updateMenu(syncedMenu, choosedMenu.menuId, "add", {
      subMenus: [...choosedMenu.subMenus, ...additionArray],
    });
    
    // Set the updated menu to the Redux state
    dispatch(setMenuSynchronizer(updatedSyncedMenu));
    await updateMenuApi({id:syncedMenu.config.menuNumber,patch:{config:{...syncedMenu.config},items:[...updatedSyncedMenu.items]}})
    
      // Log the updated menu with new submenus
  

    // Optionally, you can reset the additionArray if needed
    setAdditionArray([]);
  };
  

  const handleAddSubMenu = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    propertyName: string
  ) => {
    if (additionArray.length > 0) {
      const newArray = [...additionArray] // Create a copy of the array
      newArray[id] = {
        ...newArray[id],
        [propertyName]: e.target.value, // Update the specified property
      }
      setAdditionArray(newArray) // Set the state with the modified copy
    }
  }

  const handleUpdateName = async () => {
    if (!syncedMenu) {
      return;
    }
  
    const updatedSyncedMenu = updateMenu(syncedMenu, choosedMenu.menuId, "update", {
      name: rename,
      link:editLink
    });
  
    // Set the updated menu to the Redux state
    dispatch(setMenuSynchronizer(updatedSyncedMenu));
    await updateMenuApi({id:syncedMenu.config.menuNumber,patch:{config:{...syncedMenu.config},items:[...updatedSyncedMenu.items]}})
  
    // Optionally, you can reset the rename state if needed
  }

  const handleAddField = (id: number) => {
      setAdditionArray([...additionArray, { 
        icon:null,
        link:'',
        menuId:uuidv4(),
        name:'',
        subMenus:[],
      }]);
  };

  const handleDelete = (id: number): void => {
    if (!syncedMenu) {
      return;
    }
    const updatedSyncedMenu = updateMenu(syncedMenu, id, "delete")
    dispatch(setMenuSynchronizer(updatedSyncedMenu))
    updateMenuApi({id:syncedMenu.config?.menuNumber,patch:{config:{...syncedMenu.config},items:[...updatedSyncedMenu.items]}})
  }
  

useEffect(() => {
  if (updateStatus) {
    showToast(updateResult?.message, "success");
  }
  if (updateErrorMsg) {
    const errMsg = updateErrorMsg.data.message;
    showToast(errMsg, "error");
  }
}, [updateStatus, updateResult]);  


useEffect(() => {
setRename(choosedMenu?.name)
setEditLink(choosedMenu?.link)
},[choosedMenu.link, choosedMenu.name])




  return (
    <Box display="flex" flexDirection="column" gap="20px" alignItems="center">
      { updateLoader && <Box sx={{
      width:'100%',
      height:'2px'
    }} >
      <LinearProgress /> 
    </Box>}
      <Box>
        <InputLabel sx={{my:1}} >نام منو</InputLabel>
        <TextField
          value={rename}
          onChange={(e) => setRename(e.currentTarget.value)}
          placeholder={choosedMenu?.title}
        />
        </Box>
        <Box>
           <InputLabel sx={{my:1}} >لینک</InputLabel>
        <TextField
          value={editLink}
          sx={{
            direction:'rtl'
          }}
          onChange={(e) => setEditLink(e.currentTarget.value)}
          placeholder={choosedMenu?.title}
        />
      </Box>
      { !updateLoader && <Stack direction="row" spacing={2}>
        {(rename.length > 0 || editLink.length > 0) && (
          <LoadingButton
            size="small"
            color="primary"
            disabled={false}
            loading={false}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            onClick={handleUpdateName}
          >
            بروزرسانی
          </LoadingButton>
        )}

        {hasPermission("Classification.delete") && (
          <Tooltip title="حذف کامل منو با زیر منو های آن">
            <LoadingButton
              size="small"
              color="error"
              disabled={updateLoader}
              loading={updateLoader}
              loadingPosition="center"
              variant="contained"
              onClick={() => handleDelete(choosedMenu.menuId)}
            >
              <DeleteIcon />
            </LoadingButton>
          </Tooltip>
        )}
      </Stack>}

      <Stack direction="row" spacing={2}>
        <Button
          onClick={() => handleAddField(choosedMenu.id)}
          endIcon={<AddCircleOutlineIcon />}
        >
          افزودن زیر منو
        </Button>
      </Stack>

      {additionArray.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection:'column',
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {additionArray.map((field, idx) => (
            <Box 
            key={idx}
            sx={{
              position:'relative',
              overfow:'hidden',
              border:`1px solid ${colors.primary[300]}`,
              borderRadius:'10px',
            }} >
            <TextField
              value={field.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAddSubMenu(e, idx, 'name')
              }
              label="نام زیر منو"
            />
            <TextField
            key={idx}
            value={field.link}
            sx={{
              direction:'rtl'
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleAddSubMenu(e, idx, 'link')
            }
            label="لینک زیر منو"
          />
          </Box>
          ))}
        </Box>
      ) : (
        <Typography>هنوز زیر منو ای اضافه نکرده اید</Typography>
      )}

      {additionArray.length > 0 && (
      !updateLoader && <Stack direction="row" spacing={3}>
          <LoadingButton
            size="small"
            color="primary"
            onClick={handleSave}
            disabled={false}
            loading={false}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
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
  );
};

export default AddEditSubMenu;
