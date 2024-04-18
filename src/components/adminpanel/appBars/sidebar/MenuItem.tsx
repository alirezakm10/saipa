"use client";
import React, { ReactNode, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  MenuItem as SubMenu,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "@/theme";
import { selectSidebarCollapsed, setSidebarCollapsed } from "@/redux/features/sidebarSlice";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import styles from "../styles.module.scss";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SubSideOne from "./subSides/SubSideOne";
import { useTranslation } from "react-i18next";
import useTextTruncation from "@/hooks/useTextTruncation";

interface ISubMenu {
  name: string;
  icon?: ReactNode;
  link: string;
}
interface Props {
  menuId: number;
  name: string;
  icon: ReactNode;
  headName?:string;
  link: string;
  setter: (id: number) => void;
  showSub: number | null;
  subMenus?: ISubMenu[];
}

const MenuItem: React.FC<Props> = ({ name, icon, link, subMenus, setter, showSub, menuId, headName }) => {
  const truncateText = useTextTruncation()
  const {t} = useTranslation()
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mobileBreakpoint = useMediaQuery(theme.breakpoints.down('md'));
  const colors = tokens(theme.palette.mode);
  const menuCollapsed = useAppSelector(selectSidebarCollapsed);
  const pathname = usePathname();
  // i used one state for collapsed sub menus and uncollapsed submenus for ux trick it cause when user opened a sub and collapsed the menu submenu in collapsed mode stay active
  const [hoverableSubs, setHoverableSubs] = useState<boolean>(false);
  const handleCloseSideBarOnMobile = () => {
    if (!mobileBreakpoint) return;
    dispatch(setSidebarCollapsed())
  }

  const submenuVariants = {
    initial: {
      opacity: 0,
      height: 0,
    },
    visible: {
      opacity: 1,
      height: "auto",
    },
    hidden: {
      height: 0,
      opacity: 0,
    },
    hover: {
      transition: {
        duration: 0.3,
      },
    },
  };



  const themeMode = theme.palette.mode;

  return menuCollapsed ? (
    <>
      {/*this is parent menu item ternary when menu has submenu shouldn't use Link tag i control it here */}
      {subMenus ? (
        <Button
          sx={{
            height: "40px",
            maxHeight: "40px",
            borderRadius: '10px',
            bgcolor: `${showSub === menuId || pathname === link && colors.blue[300]}`,
            color: 'white'
          }}
          onClick={() => setter(menuId)}
        >
          {icon}
          <Typography
            sx={{
              minWidth: "100px",
              color: themeMode === "light" ? "white" : "inherit",
            }}
            component="p"
            variant="body1"
          >
            {t(name)}
          </Typography>
        </Button>
      ) : (
        // this is main page buttin link when menu not collapsed
        <Link href={link}>
          <Button
            sx={{
              position: 'relative',
              width: '100%',
              height: "40px",
              maxHeight: "40px",
              color: 'white',
              borderRadius: '10px',
              bgcolor: `${showSub === menuId || pathname === link && colors.blue[300]}`
            }}
          >
            {icon}
            <Typography
              sx={{
                minWidth: "100px",
                color: themeMode === "light" ? "white" : "inherit",
              }}
              component="p"
              variant="body1"
            >
              {t(name)}
            </Typography>
          </Button>
        </Link>
      )}
      <Box sx={{ borderRadius: "20px", width: '100%' }}>
        <AnimatePresence>

          {
            // this componenet show submenus when menu not collapsed
            showSub === menuId
              ? subMenus?.map((subMenu, idx) => (
                <motion.div
                  key={idx}
                  initial="initial"
                  animate="visible"
                  exit="hidden"
                  // whileHover="hover"
                  variants={submenuVariants}
                  style={{ overflow: 'hidden', borderColor: `${colors.blue[300]}`, background: colors.themeAccent[600] }}
                  className={styles.subMenuBorders}
                >
                  <Link href={subMenu.link} onClick={handleCloseSideBarOnMobile} >
                    <Button
                      sx={{
                        left: 0,
                        width: '100%',
                        borderRadius: '10px',
                        borderStyle: pathname === subMenu.link ? "solid" : "none",
                        borderWidth: "9px 9px 9px 0",
                        borderColor: `transparent ${colors.blue[300]} transparent transparent`,
                        height: "40px",
                        maxHeight: "40px",
                        minWidth: "100px",
                        fontSize: "12px",
                        color: themeMode === "light" ? "white" : "inherit",
                      }}
                    >
                      {subMenu.icon}

                      <Typography
                        component='p'
                        variant="body2"
                      >{truncateText(t(subMenu.name),20)}</Typography>
                    </Button>
                  </Link>
                </motion.div>

              ))
              : ""
          }
        </AnimatePresence>
      </Box>
    </>
  ) : (

    <Box
      onMouseEnter={() => setHoverableSubs(true)}
      onMouseLeave={() => setHoverableSubs(false)}
    >
      <Link href={link}>
        <IconButton
          sx={{ position:'relative', zIndex:3,bgcolor: pathname === link ? colors.blue[300] : colors.themeAccent[500] }}
        >
          {icon}
        </IconButton>
        {hoverableSubs ? <SubSideOne headName={headName} subs={subMenus} /> : ''}
      </Link>
    </Box>
  );
};

export default MenuItem;
