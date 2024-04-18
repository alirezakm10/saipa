import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, useTheme } from '@mui/material';
import { tokens } from '@/theme';

type IProduct = {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    count: number;
    discount: number;
    amount_after_discount: number;
    amount: number;
    unit_amount: number;
    created_at: Date;
    updated_at: Date;
}

// this is mix type of order address and post types about order transition
type IOrderTransition = {
    id: number;
    title: string;
    cost: number;
    user_id: number;
    city_id: number;
    address: string;
    postal_code: string;
    minimum_delivery_days: number;
    description: string;
    is_default: number;
    deleted_at: Date;
    created_at: string;
    updated_at: string;
}

interface Props {
    productList: IProduct[];
    orderTransition: IOrderTransition;
    order: any;
}
const PurchasesAccordion: React.FC<Props> = ({ productList, orderTransition, order }) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    React.useEffect(() => {
        console.log('products inside accordion: ', productList)
    },[])

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>لیست محصولات</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={5}>
                        {productList?.map((product, idx) => (
                            <Box key={idx} >
                                <TableContainer
                                    sx={{
                                        border: `1px solid ${colors.primary[200]}`,
                                        borderRadius: '10px',
                                    }}
                                >
                                    <Table>
                                        <TableRow>
                                            <TableCell variant="head">نام محصول</TableCell>
                                            <TableCell>{product.product_name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head">شناسه محصول</TableCell>
                                            <TableCell>{product.product_id}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head">تعداد</TableCell>
                                            <TableCell>{product.count}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head">شناسه سفارش</TableCell>
                                            <TableCell>{product.order_id}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head">قیمت هر واحد</TableCell>
                                            <TableCell>{product.unit_amount}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head">تخفیف</TableCell>
                                            <TableCell>{product.discount === 0 ? 'ندارد' : product.discount}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head">مجموع قیمت </TableCell>
                                            <TableCell>{product.discount === 0 ? product.amount : product.amount_after_discount}</TableCell>
                                        </TableRow>
                                    </Table>
                                </TableContainer>
                            </Box>
                        ))
                    }
                    </Stack>
                </AccordionDetails>
            </Accordion>

            {/* main factor details outside accordion */}

            <Table>
                <TableRow>
                    <TableCell variant="head">مجموع قیمت </TableCell>
                    <TableCell>{order?.discount === 0 ? 'ندارد' : 'دارد'}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell variant="head">قیمت کل:</TableCell>
                    <TableCell>{order?.discount === 0 ? order.total_amount : order?.discount}</TableCell>
                </TableRow>
            </Table>
        </>
    )
}

export default PurchasesAccordion