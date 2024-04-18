import { useState, useEffect, useRef } from 'react'
import { useGetCommentQuery, useUpdateCommentMutation, useRejectCommentMutation, useConfirmCommentMutation } from '@/redux/services/comments/commentsApi'
import { Typography, Box, Chip, CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { getColorForStatus, getStatusTitle } from './getStatusTitlesAndColors'
import useToast from '@/hooks/useToast'

interface Props {
  id: string;
}




const CommentStatus: React.FC<Props> = ({ id }) => {
  const showToast = useToast();
  const [clickedStatus, setClickedStatus] = useState<number | null>(null);
  const { data: order, isSuccess, isLoading, isError } = useGetCommentQuery(id, {
    refetchOnMountOrArgChange: true
  })


  const [
    confirmComment,
    {
      isSuccess: confirmStatus,
      isLoading: confirmLoader,
      data: confirmResult,
      error:confirmErrorMsg
    },
  ] = useConfirmCommentMutation<any>();

  const [
    rejectComment,
    {
      isSuccess: rejectStatus,
      isLoading: rejectLoader,
      data: rejectResult,
      error:rejectErrorMsg
    },
  ] = useRejectCommentMutation<any>();



  const handleUpdateOrderStatus = (id:number, status:number):void => {
    if (!confirmLoader && status === 2) {
      setClickedStatus(status)
      confirmComment({ id, patch: { status } });
    }else if(!rejectLoader && status === 3){
        setClickedStatus(status)
        rejectComment({ id, patch: { status } });
    }
  }

  



//   this side effect is for confirm
  useEffect(() => {
    if (confirmStatus) {
      showToast(confirmResult?.message, "success");
    }
    if (confirmErrorMsg) {
      const errMsg = confirmErrorMsg.data.message;
      showToast(errMsg, "error");
    }
  }, [confirmStatus, confirmResult, confirmErrorMsg]);

  
  useEffect(() => {
    if (rejectStatus) {
      showToast(rejectResult?.message, "success");
    }
    if (rejectErrorMsg) {
      const errMsg = rejectErrorMsg.data.message;
      showToast(errMsg, "error");
    }
  }, [rejectStatus, rejectResult, rejectErrorMsg]);

  let content;

  if (isSuccess) {
    content = (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        p: 2
      }} >
        <Typography>تغییر وضعیت دیدگاه</Typography>
        <Box
          sx={{
            position: 'relative',
            overflowX: 'hiiden',
            borderRadius: '10px',
            overflowY: 'auto',
            width: '250px',
            height: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            flex: 2,
            gap: 1
          }}
        >
          {/* enums length */}
          {[2, 3].map((status, idx) =>
          (
            <LoadingButton
            key={idx}
            size="small"
            disabled={confirmLoader || rejectLoader }
            
            
            loading={status === clickedStatus && confirmLoader || status === clickedStatus &&  rejectLoader}
            loadingPosition="center"
            variant="outlined"
            sx={{ 
              width: '100px', // Fixed width
              height: '40px', // Fixed height
              my: 2, flex: 1,
              color: getColorForStatus(status),
              border:`1px solid ${getColorForStatus(status)}`
            }}
                onClick={() => handleUpdateOrderStatus(Number(id), status)}
            >
              {getStatusTitle(Number(status))}
            </LoadingButton>
          ))
          }
        </Box>
      </Box>
    )
  }

  if (isLoading) {
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="100%"
        p={3}
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    )
  }
  return content;
}

export default CommentStatus
