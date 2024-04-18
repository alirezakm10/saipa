'use client'
import { BottomBar, SideBar, TopBar } from "@/components/adminpanel";
import SettingsBar from "@/components/adminpanel/appBars/SettingsBar";
import FileManager from "@/components/adminpanel/filemanager/FileManager";
import SignoutModal from "@/components/adminpanel/signout/SignoutModal";
import { Box, Container, Grid, useTheme } from "@mui/material";
import { useSession } from "next-auth/react"
import { ReactNode, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectThemeDirection, setThemeDirection } from "@/redux/features/configSlice";
import { redirect } from "next/navigation";
import { CircleLoader } from "react-spinners";
import { tokens } from "@/theme";


interface Props {
  children?: ReactNode;
}

const AuthenticationLogics: React.FC<Props> = ({ children }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { data: session, status } = useSession();
const dispatch = useAppDispatch()
const themeDirection = useAppSelector(selectThemeDirection)
// here we get default setted language from i18
// this array used for strict direction for content section in grid means if the language was persian or arabic
// persist content section dirtection to rtl even if main direction of other objects changed
// solution is Array.prototype.includes() from java script
const strictRtlContent = ['fa','ar']

useEffect(() => {
  if (typeof window !== 'undefined') {
    dispatch(setThemeDirection(localStorage.getItem('dir')))
        }
        if(status === 'authenticated'){
          redirect('/adminpanel')
        }
},[])

  let content;
  if (status === 'authenticated') {
    content = (
      <>
      <Grid container
      sx={{
        direction:themeDirection,
      }}
      >
        <TopBar />
        <Grid item xs={12} py={1} >
          <Box sx={{
            position: 'relative',
            display: 'flex',
            width:'100%'
          }} >
            <SideBar />
            <Container maxWidth="xl" sx={{
              width:'100%',
              height:'auto',
              position:'relative',
              overflow:'hidden',
              direction:strictRtlContent.includes('fa') || strictRtlContent.includes('ar') ? 'ltr' : themeDirection,
            }} >
              {children}       
              <FileManager />
            </Container>
          </Box>
        </Grid>
        <Grid item xs={12} >
          <BottomBar />
        </Grid>
        <SettingsBar />
      </Grid>
        <SignoutModal />
      </>
    )
  }

  if(status === 'loading'){
    content = (
     <Box
        sx={{
          position:'absolute',
          top:0,
          bottom:0,
          left:0,
          right:0,
          zIndex:10,
          display: 'flex',
          width: '100%',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
            >
        <CircleLoader size='300px' color={colors.themeAccent[400]} />
            </Box>
    )
  }

  if (status === 'unauthenticated') {
    content = children
  }

  return content;
}

export default AuthenticationLogics