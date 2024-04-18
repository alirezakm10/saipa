"use client";
import { useState, useEffect } from "react";
import {
  useGetContentsQuery,
  useDeleteContentMutation,
} from "@/redux/services/contents/contentApi";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import Link from "next/link";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import useToast from "@/hooks/useToast";
import { ITablePaginationMode } from "@/types";
import { tokens } from "@/theme";
import { useRouter } from "next/navigation";
import usePermission from "@/hooks/usePermission";
import ShowKeywords from "../sharedAdminModules/ShowKeywords";

interface Keyword {
  id: number;
  keyword: string;
  pivot?: any;
}

const Posts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const showToast = useToast();
  const { hasPermission } = usePermission();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  // get queries
  const {
    data: posts,
    isSuccess: postsStatus,
    isLoading: postsLoader,
    error: postsError,
  } = useGetContentsQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  const [rowCountState, setRowCountState] = useState(posts?.meta.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      posts?.meta.total !== undefined ? posts?.meta.total : prevRowCountState
    );
  }, [posts?.meta.total, setRowCountState]);

  // mutation queries

  const [
    deleteContent,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteContentMutation();

  const deleteHandler = (id: number): void => {
    deleteContent(id);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "ردیف",
      width: 50,
      headerAlign: "center",
      align: "center",
      valueGetter: (post: any) => post.id,
    },
    {
      field: "col2",
      headerName: "نام پست",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (post: any) => post.row.title,
    },
    {
      field: "col3",
      headerName: "نویسنده",
      width: 120,
      headerAlign: "center",
      align: "center",
      valueGetter: (post: any) => post.row.author,
    },
    {
      field: "col4",
      headerName: "خلاصه پست",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (post: any) => post.row.short_description,
    },
    {
      field: "col5",
      headerName: "تاریخ انتشار",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (post: any) => post.row.publish_time,
    },
    hasPermission("Keyword.index")
      ? {
          field: "col6",
          headerName: "کلمات کلیدی",
          width: 100,
          headerAlign: "center",
          align: "center",
          renderCell: (post: any) => (
            <ParentMenu buttonTitle="مشاهده">
              <ShowKeywords keywordsArray={post.row.seo?.keywords} />
            </ParentMenu>
          ),
        }
      : undefined,
    hasPermission("Content.edit") && hasPermission("Content.delete")
      ? {
          field: "col7",
          headerName: "عملیات",
          width: 200,
          headerAlign: "center",
          align: "center",
          renderCell: (post: any) => (
            <Stack direction="row" spacing={2}>
              {hasPermission("Content.edit") && (
                <Link href={`/adminpanel/posts/updatepost/${post.row.id}`}>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<BorderColorIcon />}
                  >
                    ویرایش
                  </Button>
                </Link>
              )}
              {hasPermission("Content.delete") && (
                <ConfirmModal
                  modalTitle={post.row.title}
                  description="آیا از حذف مطمئن هستید؟"
                  color="error"
                  icon={<DeleteIcon />}
                  btnTitle="حذف"
                  setter={() => deleteHandler(post.row.id)}
                  ctaLoader={deleteLoader}
                />
              )}
            </Stack>
          ),
        }
      : undefined,
  ].filter(Boolean) as GridColDef[];

  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
        {/* <Link href='/adminpanel/posts/addpost' >
           <Button
                  variant='outlined'
                  color='primary'
                   endIcon={<AddCircleOutlineIcon />}
                 >
                   افزودن پست
                 </Button>
         </Link> */}
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

  if (postsStatus) {
    content = (
      <>
        <DataGrid
          autoHeight
          rowCount={rowCountState}
          {...posts?.data}
          rows={posts?.data}
          columns={columns}
          loading={postsLoader}
          slots={{
            toolbar: CustomToolbar,
          }}
          paginationMode="server"
          pageSizeOptions={[10, 20, 30]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </>
    );
  }

  if (postsError) {
    const error: any = postsError;
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50%"
        alignItems="center"
      >
        {error?.data?.message?? "خطایی رخ داده است!"}
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          pb: 1,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          نوشته ها
        </Typography>
        {hasPermission("Content.create") && (
          <Button
            variant="contained"
            onClick={() => router.push("/adminpanel/posts/addpost")}
          >
            افزودن نوشته
          </Button>
        )}
      </Box>
      {content}
    </>
  );
};

export default Posts;
