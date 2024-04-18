"use client";
import { useEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import {
  Button,
  Stack,
  Grid,
  Box,
  Typography,
  useTheme
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import Link from "next/link";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import useToast from "@/hooks/useToast";
import { useGetGalleriesQuery, useDeleteGalleryMutation } from "@/redux/services/other/galleriesApi";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { tokens } from "@/theme";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import usePermission from "@/hooks/usePermission";


const GalleriesList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const { hasPermission } = usePermission();
  const {data:guaranties, isSuccess, isLoading, isFetching, isError, error} = useGetGalleriesQuery('')
  const [
    deleteGallery,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteGalleryMutation<any>();
  const deleteHandler = (id: number): void => {
    deleteGallery(id);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "ردیف",
      headerAlign:"center",
      align: "center",
      width: 150,
      valueGetter: (gallery : any) => gallery.id,
    },
    {
      field: "col2",
      headerName: "نام گالری",
      headerAlign:"center",
      align: "center",
      width: 150,
      valueGetter: (gallery : any) => gallery.row.title,
    },
    {
      field: "col3",
      headerName: "توضیحات",
      headerAlign:"center",
      align: "center",
      width: 150,
      valueGetter: (gallery : any) => gallery.row.description,
    },
    {
      field: "col4",
      headerName: "تاریخ انتشار",
      headerAlign:"center",
      align: "center",
      width: 150,
      valueGetter: (gallery : any) =>
      new DateObject(new Date(gallery.row.created_at))
      .convert(persian, persian_fa)
      .format("YYYY/MM/DD HH:mm:ss")
    },
    hasPermission("Gallery.create") && hasPermission("Gallery.create") ? {
      field: "col5",
      headerName: "عملیات",
      headerAlign:"center",
      align: "center",
      width: 250,
      renderCell: (gallery : any) => (
        <Stack direction="row" spacing={2}>
       { hasPermission("Gallery.edit") &&  <Link href={`/adminpanel/other/galleries/updategallery/${gallery.row.id}`}>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<BorderColorIcon />}
            >
              ویرایش
            </Button>
          </Link>}
       { hasPermission("Gallery.delete") && <ConfirmModal
            modalTitle={gallery.row.name}
            description="آیا از حذف مطمئن هستید؟"
            color="error"
            icon={<DeleteIcon />}
            
            btnTitle="حذف"
            setter={() => deleteHandler(gallery.row.id)}
            ctaLoader={deleteLoader}
          />}
        </Stack>
      ),
    } : undefined,
  ].filter(Boolean) as GridColDef[];

  
  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{justifyContent:'space-between'}}>
      { hasPermission("Gallery.create") && <Link href='/adminpanel/other/galleries/addgallery' >
           <Button
                  variant='outlined'
                  color='primary'
                   endIcon={<AddCircleOutlineIcon />}
                 >
                   افزودن گالری
           </Button>
         </Link>}
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
 
  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
  }, [deleteStatus, deleteResult]);

let content;

if(isSuccess){
  content = (
    <Grid container  >
      <DataGrid
      autoHeight
      rows={guaranties}
      columns={columns}
      loading={isLoading}
      slots={{
        toolbar: CustomToolbar,
      }}
      paginationMode='server'
      pageSizeOptions={[10,20,30]}
      />
    </Grid>
  )
}

return(
  <>
   <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb:1,
          pb:1,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
            لیست گالری ها
        </Typography>
      </Box>
      { content}
  </>
)
}

export default GalleriesList