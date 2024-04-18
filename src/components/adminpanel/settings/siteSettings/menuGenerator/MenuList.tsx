'use client'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { DataGrid, GridRowsProp, GridColDef, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import React, { useEffect, useState } from 'react'
import ParentMenu from "@/components/shared/menus/ParentMenu";
import { useGetMenusQuery, useAddMenuMutation } from '@/redux/services/settings/siteSettingsApi';
import Link from 'next/link';
import ConfirmModal from '@/components/shared/modals/ConfirmModal';
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useToast from "@/hooks/useToast";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { LoadingButton } from '@mui/lab';
import MenuModal from './MenuModal';



const MenuList: React.FC = () => {
  const showToast = useToast();
  const { data: menus, isSuccess, isLoading, isFetching, isError, error : menusError } = useGetMenusQuery('')
  const [updateMenuModal, setUpdateMenuModal] = useState<boolean>(false);
  const [modalTempData, setModalTempData] = useState<any>();


  const handleEachReturn = (obj: any): void => {
    console.log('this is retrived menu object before select edit: ', obj)
    setModalTempData(obj);
    setUpdateMenuModal((prev) => !prev);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "ردیف",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (menu) => menu.id,
    },
    {
      field: "col2",
      headerName: "محل منو",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (menu) => menu.row.config.component,
    },
    {
      field: "col3",
      headerName: "صفحه فرود",
      headerAlign: "center",
      align: "center",
      width: 110,
      valueGetter: (menu) => menu.row.config.page,
    },
    {
      field: "col4",
      headerName: "عملیات",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (menu) => (
        <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="warning"
          startIcon={<BorderColorIcon />}
          onClick={() => handleEachReturn(menu.row)}
        >
        ویرایش
        </Button>
      </Stack>
      ),
    },
  ];


  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
        {/* <Link href='/adminpanel/other/menus/add-main-menu/1' >
          <Button
            variant='outlined'
            color='primary'
            endIcon={<AddCircleOutlineIcon />}
          >
            افزودن منو
          </Button>
        </Link> */}
        <Link href='https://google.com' >sdgd</Link>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  
  let content;

  if (isSuccess) {
    content = (
      <Box>
          <Box sx={{
          display:'flex',
          alignItems:'center',
          gap:2,
          mb:2
        }} >
        </Box>
        <DataGrid
          autoHeight
          rows={menus?.data}
          columns={columns}
          loading={isFetching}
          slots={{
            toolbar: CustomToolbar,
          }}
          paginationMode='server'
          pageSizeOptions={[10, 20, 30]}
          getRowId={row => row.config.menuNumber}
        />
         <MenuModal
          open={updateMenuModal}
          returnedMenu={modalTempData}
          setter={() => setUpdateMenuModal((prev) => !prev)}
        />
      </Box>
    )
  }

  if (isLoading) {

  }

  if (menusError) {
    const error : any = menusError;
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50%"
        alignItems="center"
      >
        {error?.data?.message ?? error.error}
      </Box>
    );
  }

  return content
}

export default MenuList