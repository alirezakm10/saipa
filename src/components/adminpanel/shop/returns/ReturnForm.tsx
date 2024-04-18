import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { EReturnStatus } from './typescope'
import { useUpdateReturnStatusMutation } from '@/redux/services/shop/returnApi'
import { Typography, Box, useTheme, TableCell, TableRow, TableContainer, Table, InputLabel, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { getColorForStatus, getStatusTitle } from './getStatusTitlesAndColors'
import useToast from '@/hooks/useToast'
import ParentMenu from '@/components/shared/menus/ParentMenu'
import EditRoadOutlinedIcon from "@mui/icons-material/EditRoadOutlined";
import { tokens } from '@/theme'

interface Props {
  returnedProduct: any;
}


const ReturnForm: React.FC<Props> = ({ returnedProduct }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const showToast = useToast();
  const [clickedStatus, setClickedStatus] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('')
  const [
    updateOrderStatus,
    {
      isSuccess: updateReturn,
      isLoading: updateLoader,
      data: updateResult,
      error
    },
  ] = useUpdateReturnStatusMutation<any>();


  const handleUpdateReturn = (): void => {
    updateOrderStatus({ id:returnedProduct.id, patch: {status:clickedStatus, description}})
  }



  useEffect(() => {
    if (updateReturn) {
      showToast(updateResult?.message, "success");
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateReturn, updateResult, error]);





  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1,
    }}
    >
          <Typography component="h1" variant="h4" sx={{ mx: "auto" }}>
                    فرم مرجوعی 
                  </Typography>
                  <Typography>اطلاعات مرجوعی</Typography>
      <Box>
        <TableContainer
          sx={{
            border: `1px solid ${colors.primary[200]}`,
            borderRadius: '10px',
          }}
        >
          <Table>
          <TableRow>
              <TableCell variant="head">نام کاربر</TableCell>
              <TableCell>
                {returnedProduct.user.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">نام محصول</TableCell>
              <TableCell>
                {returnedProduct.product.title}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <ParentMenu
                  buttonTitle="وضعیت"
                  buttonIcon={<EditRoadOutlinedIcon />}
                  color="warning"
                >
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
                            border: `1px solid ${getColorForStatus(status)}`
                          }}
                          onClick={() => setClickedStatus( status)}
                        >
                          {getStatusTitle(Number(status))}
                        </LoadingButton>
                      ))
                      }
                    </Box>
                  </Box>
                </ParentMenu>
              </TableCell>
              <TableCell variant="head">{getStatusTitle(clickedStatus ? clickedStatus : returnedProduct.last_event.status)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">آدرس</TableCell>
              <TableCell>
                {returnedProduct.order.address}
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>
        <InputLabel sx={{ my: 2 }}>توضیحات مرجوعی</InputLabel>
        <TextField
          name='description'
          value={description}
          type='text'
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
        />
        <LoadingButton
        sx={{
          my:2
        }}
          color="success"
          disabled={updateLoader}
          loading={updateLoader}
          loadingPosition="center"
          variant="contained"
          type="submit"
          onClick={handleUpdateReturn}
        >
          ثبت
        </LoadingButton>
      </Box>
    </Box>
  );
}

export default ReturnForm
