import { useState, useEffect, useRef } from 'react'
import { EOrderStatus } from './typescope'
import { useGetOrderQuery, useUpdateOrderStatusMutation } from '@/redux/services/shop/ordersApi'
import { Typography, Box, Chip, CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { getColorForStatus, getStatusTitle } from './getStatusTitlesAndColors'
import useToast from '@/hooks/useToast'

interface Props {
  id: string;
}




const OrderStatus: React.FC<Props> = ({ id }) => {
  const showToast = useToast();
  const [clickedStatus, setClickedStatus] = useState<number | null>(null);
  const { data: order, isSuccess, isLoading, isFetching, isError } = useGetOrderQuery(id, {
    refetchOnMountOrArgChange: true
  })
  const [
    updateOrderStatus,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error
    },
  ] = useUpdateOrderStatusMutation<any>();


  const [currentStatus, setCurrentStatus] = useState<EOrderStatus>(EOrderStatus.CHECKING)


  const handleUpdateOrderStatus = (id:number, status:number):void => {
    if (!updateLoader) {
      setClickedStatus(status); // Update the clicked status in the state
      updateOrderStatus({ id, patch: { status } });
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setCurrentStatus(order.status)
    }
  }, [order, currentStatus])

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

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
        <Typography>تغییر سریع وضعیت سفارش</Typography>
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
          {[1, 2, 3, 4, 5, 6, 7].map((status, idx) =>
          (
            <LoadingButton
            key={idx}
            size="small"
            disabled={updateLoader}
            
            
            loading={status === clickedStatus && updateLoader}
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

export default OrderStatus
