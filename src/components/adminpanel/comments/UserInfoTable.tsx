import { Table, TableCell, TableContainer, TableRow } from '@mui/material'
import { useTheme } from '@mui/material'
import { tokens } from '@/theme'

interface Props {
    username:string;
    email:string;
    mobile:string;
    phone:string;
}

const UserInfoTable:React.FC<Props> = ({username, email, mobile, phone}) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    
  return (
    <Table>
        <TableRow>
            <TableCell variant="head">نام کاربر</TableCell>
            <TableCell>{username}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell variant="head">ایمیل کاربر</TableCell>
            <TableCell>{email}</TableCell>
        </TableRow>
        <TableRow>
            <TableCell variant="head">شماره موبایل</TableCell>
            <TableCell 
            sx={{direction:'rtl'}}
            >
              {mobile}
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell variant="head">شماره منزل</TableCell>
            <TableCell>{phone}</TableCell>
        </TableRow>
    </Table>
  )
}

export default UserInfoTable
