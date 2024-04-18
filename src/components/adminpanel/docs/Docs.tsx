"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useGetDocsQuery, useDeleteDocMutation } from "@/redux/services/documents/docsApi";
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

interface Keyword {
  id: number;
  keyword: string;
  pivot?: any;
}

interface ShowKeywordsProps {
  keywordsArray: Keyword[];
}

const ShowKeywords: React.FC<ShowKeywordsProps> = ({ keywordsArray }) => {
  return (
    <Box display="flex" flexDirection="column" gap="10px">
      <Typography>کلمات کلیدی</Typography>
      <Divider />
      {keywordsArray?.map((item: any, idx: number) => (
        <Chip key={idx} label={item.keyword} />
      ))}
    </Box>
  );
};

const Docs = () => {
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
    data: docs,
    isSuccess: postsStatus,
    isLoading: postsLoader,
    error: postsError,
  } = useGetDocsQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  const [rowCountState, setRowCountState] = useState(docs?.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      docs?.total !== undefined ? docs?.total : prevRowCountState
    );
  }, [docs?.total, setRowCountState]);

  // mutation queries

  const [
    deleteDoc,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteDocMutation();

  const deleteHandler = (id: number): void => {
    deleteDoc(id);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "ردیف",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (docs: any) => docs.id,
    },
    {
      field: "col2",
      headerName: "نام سند",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (docs: any) => docs.row.title,
    },
    {
      field: "col3",
      headerName: "تاریخ انتشار",
      headerAlign:"center",
      align: "center",
      width: 150,
      valueGetter: (docs:any) =>
      new DateObject(new Date(docs.row.created_at))
      .convert(persian, persian_fa)
      .format("YYYY/MM/DD HH:mm:ss")
    },
    hasPermission("Keyword.index")
      ? {
          field: "col4",
          headerName: "طبقه بندی",
          headerAlign: "center",
          align: "center",
          width: 150,
          renderCell: (docs: any) => (
            <ParentMenu buttonTitle="مشاهده">
              <ShowKeywords keywordsArray={docs.row.keywords} />
            </ParentMenu>
          ),
        }
      : undefined,
      hasPermission("Document.edit") && hasPermission("Document.delete") ? {
      field: "col7",
      headerName: "عملیات",
      headerAlign: "center",
      align: "center",
      width: 250,
      renderCell: (docs: any) => (
        <Stack direction="row" spacing={2}>
          {hasPermission("Document.edit") && (
            <Link href={`/adminpanel/docs/update-docs/${docs.row.id}`}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<BorderColorIcon />}
              >
                ویرایش
              </Button>
            </Link>
          )}
          {hasPermission("Document.delete") && (
            <ConfirmModal
              modalTitle={docs.row.title}
              description="آیا از حذف مطمئن هستید؟"
              color="error"
              icon={<DeleteIcon />}
              btnTitle="حذف"
              setter={() => deleteHandler(docs.row.id)}
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
        {...docs?.data}
        rows={docs?.data}
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
    const error : any = postsError;  
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
          لیست اسناد
        </Typography>
        {hasPermission("Document.create") && (
          <Button
            variant="contained"
            onClick={() => router.push("/adminpanel/docs/add-doc")}
          >
            افزودن سند
          </Button>
        )}
      </Box>
      {content}
    </>
  );
};

export default Docs;
