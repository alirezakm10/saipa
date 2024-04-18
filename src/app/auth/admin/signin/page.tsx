'use client'
import {useMemo, useState} from 'react';
import {Box, Grid, Typography, Avatar, Paper}  from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Formik, Form } from "formik";
import FormikController from '@/components/shared/formBuilder/FormController';
import { AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { useSession, signIn } from "next-auth/react";
import { signinStates, signinSchema } from '../authConfigs';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import TimeLoader from '@/components/shared/loaders/TimeLoader';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectThemeDirection } from '@/redux/features/configSlice';

  // created style for toaseter
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

const SignIn: React.FC = () => {


  const {data: session, status} = useSession();
  const router = useRouter();
  // static loader for scop fetching other routes use rtk
  const [loading, setLoading] = useState<boolean>(false)
  const themeDirection = useAppSelector(selectThemeDirection)

  // with this var u can have different images at each render based your public/assets/wallpapers static images
  // i stored value via useMemo to prevent image changes with state upadtes like onSubmit handler
  const imgNumber = useMemo(() => Math.floor(Math.random() * 14) + 1,[])


  const onSubmit = async (values: any, actions: any) => {
    setLoading(true);
    try {
      const response:any = await signIn("credentials", {
        email: values.email,
        password: values.password,
        remember:values.remember,
        // Replace "/dashboard" with the path you want to redirect to after successful login
        callbackUrl: "localhost:3000",
        redirect: false,
      });
  
      // Check if the sign-in was successful based on the response
      if (response.error) {
        // Display an error toast if there's an error message
        Toast.fire({
          icon: "error",
          title: response.error,
        });
        setLoading(false);
      } else {
        Toast.fire({
          icon: "success",
          title: `ورود موفق`,
        });
        setLoading(false);
        router.push('/adminpanel');
      }
    } catch (error) {
      // Handle any unexpected errors
      Toast.fire({
        icon: "error",
        title: `دقایقی دیگر مجددا تلاش کنید!`,
      });
      setLoading(false);
    }
  };



let content;

if(status === "unauthenticated"){
  content= (
    <Grid container component="main" sx={{ height: '100vh', overflowY:'auto', width:'100%' }}>
    <Grid
      item
      xs={false}
      sm={4}
      md={7}
      sx={{
        backgroundImage: `url(/assets/wallpapers/${imgNumber}.jpeg)`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <Box
        sx={{
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent:'center',
          height:'100%'
        }}
      >
        <Box
           sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:'center',
            height:'100%',
            width:'100%'
          }}
        >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          ورود به سامانه
        </Typography>
        <Formik 
             initialValues={signinStates}
             validationSchema={signinSchema}
             onSubmit={onSubmit}
        >
        <Form style={{display:'flex', flexDirection:'column', width:'100%', direction: themeDirection ? 'rtl' : 'ltr'}} >
          <FormikController
            control="input"
            type="email"
            label="ایمیل"
            name="email"
            icon={<AiOutlineUser size={20} />}
          />
          <FormikController
            control="input"
            type="password"
            label="رمز عبور"
            name="password"
            icon={<RiLockPasswordLine />}
          />
          <FormikController
            control="checkbox"
            type="checkbox"
            label="مرا به خاطر بسپار"
            name="remember"
           options={[
            {key:'remember',
            value:false}]
           }
          />
            <LoadingButton
              loading={loading ? true : false}
              loadingPosition="center"
              type='submit'
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              ورود
            </LoadingButton>
        </Form>
        </Formik>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
              فراموشی رمز عبور
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"اکانت ندارید؟ ثبت نام"}
              </Link>
            </Grid>
          </Grid>
        </Box>


              <Typography component='h1' variant='caption' >تمامی حقوق این سایت نزد شرکت ایکس محفوظ می باشد.</Typography>
      </Box>
    </Grid>
  </Grid>
  )
}
if(status === 'loading'){
  content = <Box
  sx={{
    position:'relative',
    width:'100%',
    height:'100vh',
    display:'flex',
    justifycontent:'center',
    alignItem:'center'
  }}
  >
    <TimeLoader />
  </Box>
}

  return content;
}

export default SignIn;
