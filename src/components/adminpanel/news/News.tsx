"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useGetNewsQuery,
  useDeleteNewMutation,
} from "@/redux/services/news/newsApi";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Button,
  Stack,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import Link from "next/link";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import useToast from "@/hooks/useToast";
import { useSession } from "next-auth/react";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
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



const News = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const { hasPermission } = usePermission();
  const { data: session, status: sessionStatus } = useSession({
    required: true,
  });
  const showToast = useToast();

  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  // get queries
  const {
    data: news,
    isSuccess: postsStatus,
    isLoading: postsLoader,
    error: postsError,
  } = useGetNewsQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  const [rowCountState, setRowCountState] = useState(news?.meta.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      news?.meta.total !== undefined ? news?.meta.total : prevRowCountState
    );
  }, [news?.meta.total, setRowCountState]);

  // mutation queries

  const [
    deleteNew,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteNewMutation();

  const deleteHandler = (id: number): void => {
    deleteNew(id);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "ردیف",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (news: any) => news.id,
    },
    {
      field: "col2",
      headerName: "نام پست",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (news: any) => news.row.title,
    },
    {
      field: "col3",
      headerName: "نویسنده",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (news: any) => news.row.author,
    },
    {
      field: "col4",
      headerName: "خلاصه پست",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (news: any) => news.row.short_description,
    },
    {
      field: "col5",
      headerName: "تاریخ انتشار",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (news: any) => news.row.publish_time,
    },
    hasPermission("Keyword.index")
      ? {
          field: "col6",
          headerName: "کلمات کلیدی",
          headerAlign: "center",
          align: "center",
          width: 150,
          renderCell: (news: any) => (
            <ParentMenu buttonTitle="مشاهده">
              <ShowKeywords keywordsArray={news.row.seo?.keywords} />
            </ParentMenu>
          ),
        }
      : undefined,
      hasPermission("News.edit") && hasPermission("News.delete") ? {
      field: "col7",
      headerName: "عملیات",
      headerAlign: "center",
      align: "center",
      width: 250,
      renderCell: (news: any) => (
        <Stack direction="row" spacing={2}>
          {hasPermission("News.edit") && (
            <Link href={`/adminpanel/news/updatenews/${news.row.id}`}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<BorderColorIcon />}
              >
                ویرایش
              </Button>
            </Link>
          )}
          {hasPermission("News.delete") && (
            <ConfirmModal
              modalTitle={news.row.title}
              description="آیا از حذف مطمئن هستید؟"
              color="error"
              icon={<DeleteIcon />}
              btnTitle="حذف"
              setter={() => deleteHandler(news.row.id)}
              ctaLoader={deleteLoader}
            />
          )}
        </Stack>
      ),
    } : undefined,
  ].filter(Boolean) as GridColDef[];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
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
      <DataGrid
        autoHeight
        rowCount={rowCountState}
        {...news?.data}
        rows={news?.data}
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
    );
  }

  if (postsError) {
    const error:any = postsError;
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
          لیست اخبار
        </Typography>
        {hasPermission("News.create") && (
          <Button
            variant="contained"
            onClick={() => router.push("/adminpanel/news/addnews")}
          >
            افزودن خبر
          </Button>
        )}
      </Box>
      {content}
    </>
  );
};

export default News;
