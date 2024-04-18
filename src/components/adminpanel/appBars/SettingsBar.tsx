"use client";
import React, { useContext, useEffect, useState } from "react";
import { tokens } from "@/theme";
import { useTheme, Typography, Box, IconButton, useMediaQuery, Tooltip, Grid, Divider } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  SelectShowSetting,
  setShowSetting,
} from "@/redux/features/settingsSlice";
import styles from "./styles.module.scss";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import { useSession } from "next-auth/react";
import { selectThemeDirection, selectedSidebarWallpaper, setSidebarWallpaper, setThemeDirection } from "@/redux/features/configSlice";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SearchMenu from "@/components/shared/menus/SearchMenu";
import LanguageMenu from "@/components/shared/menus/LanguageMenu";
import FlipIcon from '@mui/icons-material/Flip';
import { ColorModeContext, DirectionModeContext } from "@/theme";
import Image from "next/image";
import {
  setSideBarOpen,
} from "@/redux/features/sidebarSlice";
import local from "next/font/local";

const sidebarWallpapers = [
  '/assets/sidebarWallpapers/1.jpeg',
  '/assets/sidebarWallpapers/2.jpeg',
  '/assets/sidebarWallpapers/3.jpeg',
  '/assets/sidebarWallpapers/4.jpeg',
  '/assets/sidebarWallpapers/5.jpeg',
]


const SettingsBar: React.FC = () => {
  const [selectedWallpaperIndex, setSelectedWallpaperIndex] = useState(0);
const choosedSidebarWallpaper = useAppSelector(selectedSidebarWallpaper)

  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const lessThanmd = useMediaQuery(theme.breakpoints.down('md'))
  const colorMode = useContext(ColorModeContext);
  const themeDirection = useAppSelector(selectThemeDirection)
  const settingCollapsed = useAppSelector(SelectShowSetting)
  const handleSelectSidebarWallpaper = (img:string) => {
    dispatch(setSideBarOpen(true))
    dispatch(setSidebarWallpaper(img))
    if (typeof window !== 'undefined') { 
      localStorage.setItem('selectedWallpaper',img)
    }else{
      dispatch(setSidebarWallpaper(''))
    }
  }


  const settingVariants = {
    initial: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      width: lessThanmd ? '85%' : '400px',
      left: themeDirection === 'ltr' ? 0 : 'inherit',
      right: themeDirection === 'ltr' ? 'inherit' : 0,
    },
    hidden: {
      width: "400px",
      left: themeDirection === 'ltr' ? '-400px' : 'inherit',
      right: themeDirection === 'ltr' ? 'inherit' : '-400px',
    },
    hover: {
      transition: {
        duration: 0.3,
      },
    },
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
dispatch(setThemeDirection(localStorage.getItem('dir')))
    }
  },[])

  let content;

  if (session && status) {
    content = (
      <AnimatePresence>
        <motion.div
          // initial="initial"
          animate={settingCollapsed ? "visible" : "hidden"}
          // exit="hidden"
          // whileHover="hover"
          className={styles.settingbar_container}
          variants={settingVariants}
          style={{
            // background: settingCollapsed
            //   ? colors.primary[800]
            //   : "transparent",
            color: colors.primary[100],
          }}
        >

          <IconButton
            onClick={() => dispatch(setShowSetting())}
            sx={{
              position: 'absolute',
              zIndex: 100,
              top: 0,
              bottom: 0,
              left: themeDirection === 'ltr' ? '-40px' : 'inherit',
              right: themeDirection === 'ltr' ? 'inherit' : '-40px',
              height: '40px',
              width: '40px',
              color:'white',
              my: 'auto',
              bgcolor: colors.blue[800],
              ":hover": {
                bgcolor: colors.blue[200]
              }
            }}
          >
            {/* <SettingsIcon /> */}
            <DisplaySettingsIcon />
          </IconButton>

          <Typography
          color='white'
            variant='h4' >تنظیمات</Typography>

          <Typography
          color='white'
          sx={{ my: 2 }} >تنظیمات پایه</Typography>
          <Box

            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              width: '100%',
            }}
          >
            <LanguageMenu />
            <Tooltip title={`تغییر جهت`} >
              <IconButton
                sx={{
                  mx: 1, filter: "drop-shadow(20px 10px 10px 10px white)",
                  bgcolor: colors.themeAccent[500]
                }}
                onClick={() => { 
                  dispatch(setThemeDirection(themeDirection))
                  localStorage.setItem('dir', themeDirection)
                }}
              >
                <FlipIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='روشنایی قالب' >
              <IconButton
                onClick={colorMode.toggleColorMode}
                sx={{ bgcolor: colors.themeAccent[500] }}
              >
                {theme.palette.mode === "dark" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>



          <Box width='100%' my={2} >
            <Divider variant='middle' />
          </Box>

          <Typography 
          color='white'
          sx={{ my: 2 }} >انتخاب عکس سایدبار</Typography>
          <Grid container spacing={2} justifyContent='center' >
            <Grid item onClick={() => handleSelectSidebarWallpaper('') } >
            <Box
                    bgcolor={colors.themeAccent[500]}
                    width={100}
                    height={140}
                    sx={{position:'relative', overflow:'hidden',cursor:'pointer', borderRadius:'10px',
                    border:localStorage.getItem('selectedWallpaper') === '' ? `5px solid white` : ''
                  }}
                  />
            </Grid>
            {
              sidebarWallpapers?.map((img, idx) => (
                <Grid 
                key={idx}
                item onClick={() => handleSelectSidebarWallpaper(img) } >
                  <Image
                    src={img}
                    alt={img}
                    loading="lazy"
                    style={{
                      position:'relative',
                      overflow:'hidden',
                      borderRadius:'10px',
                      filter: `dropShadow(5px 4px 10px)`,
                      objectFit: "cover",
                      objectPosition: "center center",
                      cursor: 'pointer',
                      border:localStorage.getItem('selectedWallpaper') === img ? `5px solid ${colors.themeAccent[500]}` : ''
                    }}
                    draggable={false}
                    width={100}
                    height={140}
                  />
                </Grid>
              ))
            }
          </Grid>



        </motion.div>
      </AnimatePresence>
    )
  }

  return content;
};

export default SettingsBar;
