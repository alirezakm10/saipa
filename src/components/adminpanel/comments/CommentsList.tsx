"use client";
import { useEffect, useState } from "react";
import RuleIcon from "@mui/icons-material/Rule";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  Button,
  Stack,
  Grid,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import useToast from "@/hooks/useToast";
import {
  useGetCommentsQuery,
  useDeleteCommentMutation,
} from "@/redux/services/comments/commentsApi";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { getColorForStatus, getStatusTitle } from "./getStatusTitlesAndColors";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import CommentStatus from "./CommentStatus";
import { ITablePaginationMode } from "@/types";
import ReplyIcon from '@mui/icons-material/Reply';
import ReplyCommentModal from "./ReplyCommentModal";

import { tokens } from "@/theme";
import usePermission from "@/hooks/usePermission";

interface Props {
  subject: string;
  route: string;
}

const CommentsList: React.FC<Props> = ({ subject, route }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const { hasPermission } = usePermission();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: comments,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetCommentsQuery({
    subject,
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  const [
    deleteComment,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteCommentMutation<any>();
  const deleteHandler = (id: number): void => {
    deleteComment(id);
  };

  const [updateCommentModal, setUpdateCommentModal] = useState<boolean>(false);
  const [replyCommentModal, setReplyCommentModal] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<number>(0);

  const handleUpdateCommentModal = (id: number): void => {
    setCommentId(id);
    setUpdateCommentModal((prev) => !prev);
  }

  const handleReplyCommentModal = (id: number): void => {
    setCommentId(id);
    setReplyCommentModal((prev) => !prev);
  };


  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "شناسه",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (comment : any) => comment.id,
    },
    {
      field: "col2",
      headerName: "نام کاربر",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (comment : any) => comment.row.user.name,
    },
    {
      field: "col3",
      headerName: "تاریخ ثبت ",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (product : any) =>
        new DateObject(new Date(product.row.created_at))
          .convert(persian, persian_fa)
          .format(),
    },
    {
      field: "col4",
      headerName: "خلاصه دیدگاه",
      width: 250,
      headerAlign: "center",
      align: "center",
      valueGetter: (comment : any) => comment.row.body,
    },
    {
      field: "col5",
      headerName: "وضعیت",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (comment : any) => (
        <>
        <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <ParentMenu
              buttonTitle=""
              justIcon={<RuleIcon />}
              color="warning"
              variant="text"
            >
              <CommentStatus id={comment.row.id} />
            </ParentMenu>
            <Typography
              sx={{
                cursor: "default",
              }}
              component="span"
              variant="subtitle2"
              my="auto"
              color={getColorForStatus(comment.row.status)}
              width={100}
            >
              {getStatusTitle(Number(comment.row.status))}
            </Typography>
          </Box>
        </>
      ),
    },
    hasPermission("Comment.edit") &&  hasPermission("Comment.delete") ? {
      field: "col6",
      headerName: "عملیات",
      width: 270,
      headerAlign: "center",
      align: "center",
      renderCell: (comment : any) => (
        <Stack direction="row" spacing={2}>
       {  hasPermission("Comment.edit") && <Button
            variant="outlined"
            color="warning"
            startIcon={<ReplyIcon />}
            onClick={() => handleReplyCommentModal(comment.row.id)}
          >
            ویرایش و پاسخ
          </Button>}
         {  hasPermission("Comment.delete") && <ConfirmModal
            modalTitle={comment.row.name}
            description={`آیا از حذف دیدگاه ${comment.row.id} مطمئن هستید؟`}
            color="error"
            justIcon={<DeleteIcon />}
            setter={() => deleteHandler(comment.row.id)}
            ctaLoader={deleteLoader}
          />}
        </Stack>
      ),
    } : undefined,
  ].filter(Boolean) as GridColDef[];

  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  const [rowCountState, setRowCountState] = useState(comments?.total || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      comments?.meta.total !== undefined
        ? comments?.meta.total
        : prevRowCountState
    );
  }, [comments?.meta.total, setRowCountState]);

  
  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
  }, [deleteStatus, deleteResult]);

  let content;

  if (isSuccess) {
    content = (
      <Grid container spacing={2}>
          <Box sx={{
          display:'flex',
          width:'100%',
          flexDirection:'row',
          justifyContent:'space-between',
          mt:3,
          mb:2,
          pb:1,
          borderBottom: `1px solid ${colors.primary[300]}`
        }} >
          <Typography component='h1' variant="h4" >لیست دیدگاه های {subject === 'product' ? 'فروشگاه' :
                  subject === 'news' ? 'خبرها' :
                  subject === 'content' ? 'نوشته ها' : ''}
          </Typography>
        </Box>
        <DataGrid
          autoHeight
          rowHeight={80}
          {...comments?.data}
          rows={comments?.data}
          columns={columns}
          rowCount={rowCountState}
          loading={isLoading}
          slots={{
            toolbar: CustomToolbar,
          }}
          pageSizeOptions={[10, 20, 30]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
        />
        
           <ReplyCommentModal
          id={commentId}
          open={replyCommentModal}
          setter={() => setReplyCommentModal((prev) => !prev)}
        />
      </Grid>
    );
  }

  return content;
        

};

export default CommentsList;
