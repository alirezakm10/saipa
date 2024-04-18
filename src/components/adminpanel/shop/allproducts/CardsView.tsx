"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/redux/services/shop/productsApi";
import Link from "next/link";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import useToast from "@/hooks/useToast";
import { ITablePaginationMode } from "@/types";
import usePermission from "@/hooks/usePermission";

const CardsView = () => {
  const showToast = useToast();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const { hasPermission } = usePermission();

  // get queries
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error : productsError ,
  } = useGetProductsQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  // mutations api

  const [
    deleteProduct,
    {
      isSuccess: deleteStatus,
      isLoading: deleteLoader,
      error: deleteError,
      data: deleteResult,
    },
  ] = useDeleteProductMutation<any>();

  const handleDelete = (id: number) => {};

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
    if (deleteError) {
      showToast(deleteError?.data.message, "error");
    }
  }, [deleteStatus, deleteError]);

  let content;

  if (isSuccess) {
    content = (
      <Grid container spacing={2}>
        {products.data.map((product: any) => (
          <Grid key={product.id} item xs sm={6} md={4} lg={3}>
            <Card>
              <CardActionArea href={`/adminpanel`}>
                <CardMedia
                  component="img"
                  height="170"
                  image={
                    product.images.filter(
                      (photo: any) => photo.is_default == 1
                    )[0]?.download_link ?? "/assets/images/no-image.svg"
                  }
                  alt={
                    product.images.filter(
                      (photo: any) => photo.is_default == 1
                    )[0]?.alt
                  }
                  sx={{ background: "#fff" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${product.price} تومان`}
                  </Typography>
                  {product.inventory > 0 ? (
                    <Typography sx={{ color: "green", mt: 1 }}>
                      موجودی : {product.inventory}
                    </Typography>
                  ) : (
                    <Typography sx={{ color: "#f44336", mt: 1 }}>
                      ناموجود
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Stack
                  direction="row"
                  justifyContent="end"
                  width="100%"
                  spacing={1}
                >
                  {hasPermission("Product.edit") && (
                    <Link href={`/adminpanel/shop/updateproduct/${product.id}`}>
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<BorderColorIcon />}
                      >
                        ویرایش
                      </Button>
                    </Link>
                  )}
                  {hasPermission("Product.delete") && (
                    <ConfirmModal
                      description={`آیا از حذف ${product.title} مطمئن هستید؟`}
                      color="error"
                      icon={<DeleteIcon />}
                      ctaLoader={deleteLoader}
                      btnTitle="حذف"
                      setter={() => alert("delete")}
                    />
                  )}
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (isLoading) {
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="100vh"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (productsError) {
    const error : any = productsError;
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

  return content;
};

export default CardsView;
