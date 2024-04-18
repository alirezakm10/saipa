"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles.module.scss";
import {
  Box,
  Stack,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
} from "@mui/material";
import { tokens } from "@/theme";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectSidebarCollapsed,
  setSidebarCollapsed,
} from "@/redux/features/sidebarSlice";
import { motion, AnimatePresence } from "framer-motion";
import MenuItem from "./MenuItem";
import { useSession } from "next-auth/react";
import AccountMenu from "./AccountMenu";
import { sidebarData } from "./sideBarData";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import SwitchRightIcon from "@mui/icons-material/SwitchRight";
import usePermission from "@/hooks/usePermission";
import { selectThemeDirection, selectedSidebarWallpaper } from "@/redux/features/configSlice";

const SideBar = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const downMd = useMediaQuery(theme.breakpoints.down("md"));
  const [showSub, setShowSub] = useState<number | null>(null);
  const [allowedMenuItems, setAllowedMenuItems] = useState<any>([]);
  const themeDirection = useAppSelector(selectThemeDirection)

const getThemeDirection = localStorage.getItem('dir')


  const { allowedPermissions } = usePermission();
 
  const [sidebarWallpaper, setSideBarWallpaper] = useState('')
const choosedSidebarWallpaper = useAppSelector(selectedSidebarWallpaper)
const getSidebarPicFromStorage = localStorage.getItem('selectedWallpaper')




  useEffect(() => {
    const filteredSidebarData = sidebarData
      .map((menu:any) => {
        // @ts-ignore
        const filteredSubMenus = menu.subMenus
          ? menu.subMenus.filter((subMenu: any) =>
              subMenu.permission
                ? allowedPermissions.includes(subMenu.permission)
                : true
            )
          : null;

        return {
          ...menu,
          subMenus: filteredSubMenus,
        };
      })
      .filter((menu) => menu.subMenus == null || menu.subMenus.length > 0)
      .filter((menu) =>
        menu.permission ? allowedPermissions.includes(menu.permission) : true
      );

      setAllowedMenuItems(filteredSidebarData)

  }, []);

  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);

  const menuVariants = {
    initial: {
      width: downMd ? 0 : 70,
    },
    visible: {
      opacity: 1,
      width: 300,
    },
    hidden: {
      width: downMd ? 0 : 70,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      transition: {
        duration: 0.3,
      },
    },
  };

  const subMenuHandler = (id: number) => {
    if (showSub === id) {
      // If the clicked submenu is already open, close it
      setShowSub(null);
    } else {
      // Otherwise, open the clicked submenu
      setShowSub(id);
    }
  };



  let content;

  if (session && status) {
    content = (
      <AnimatePresence>
        <motion.div
          variants={menuVariants}
          animate={sidebarCollapsed ? "visible" : "hidden"}
          style={{
            position: sidebarCollapsed || downMd ? "sticky" : "sticky",
            overflow: sidebarCollapsed || downMd ? 'hidden' : 'visible',
            zIndex: 3,
            top: 0,
            bottom:0,
            height: "100%",
            background: `${colors.themeAccent[700]} url(${getSidebarPicFromStorage ? getSidebarPicFromStorage : choosedSidebarWallpaper}) center/cover no-repeat`,
            color: colors.primary[100],
            borderRadius: getThemeDirection === 'rtl' ? '35px 0px 0px 35px' : '0px 35px 35px 0px',
          }}
        >
          {/* this is Crescent container in open sidebar */}
          <Box
            className={
              sidebarCollapsed
                ? styles.sidebar_content
                : styles.sidebar_content_collapsed
            }
            sx={{
              position:'relative',
              overflowY:sidebarCollapsed ? 'auto' : 'inherit',
              boxShadow: showSub && `-2px 0px 5px ${colors.blue[300]} `,
              borderRadius: getThemeDirection === 'rtl' ? '0px 32px 32px 0px' : '32px 0 0 32px',
            }}
          >
            <IconButton
              sx={{
                position: "relative",
                width: "100%",
                top: 0,
                right: 0,
                left: 0,
                bgcolor: "transparent",
                mx: "auto",
              }}
              onClick={() => dispatch(setSidebarCollapsed())}
            >
              {sidebarCollapsed ? (
                <SwitchLeftIcon fontSize="large" />
              ) : (
                <SwitchRightIcon fontSize="large" />
              )}
            </IconButton>

            <AccountMenu />
            <Divider light sx={{ width: "60%", my: 1 }} />

            {/* menu list start */}
            <Stack mt={1} direction="column" spacing={1}>
              {allowedMenuItems.length> 0 && allowedMenuItems.map((item : any, idx : number) => (
                <MenuItem
                  key={idx}
                  showSub={showSub}
                  menuId={item.menuId}
                  name={item.name}
                  icon={item.icon}
                  link={item.link}
                  headName={item.name}
                  subMenus={item.subMenus}
                  setter={subMenuHandler}
                />
              ))}
            </Stack>
            {/* menu list end */}
          </Box>
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              width: '100%',
              opacity: 0.7,
              filter: 'blur(0.7px)',
              background: colors.themeAccent[400],
              top: 0,
              bottom: 0,
              boxShadow: showSub ? `-2px 0px 5px ${colors.blue[300]}` : '',
              borderRadius: getThemeDirection === 'rtl' ? '35px 50% 50% 35px' : '50% 35px 35px 50%',
              height:'100%'
            }}
            className={styles.frontDrop}
          ></div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return content;
};

export default SideBar;
