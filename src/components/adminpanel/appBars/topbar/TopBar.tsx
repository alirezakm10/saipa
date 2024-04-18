"use client";
import styles from "../styles.module.scss";
import { Box, Button, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { tokens } from "@/theme";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import Tooltip from '@mui/material/Tooltip';
import { setShowFilemanager } from "@/redux/features/filemanagerSlice";
import { useSession } from "next-auth/react";
import WidgetsMenu from "@/components/shared/menus/WidgetsMenu";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import WidgetsIcon from '@mui/icons-material/Widgets';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { selectSidebarCollapsed, setSidebarCollapsed } from "@/redux/features/sidebarSlice";
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import { useTranslation } from 'react-i18next';
import useToast from "@/hooks/useToast";

type TLanguageInfo = {
  nativeName: string;
};

type TLanguages = {
  [key: string]: TLanguageInfo;
};



const TopBar = () => {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const themeMode = theme.palette.mode;
  const downMd = useMediaQuery(theme.breakpoints.down("md"))
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed)


  const lngs: TLanguages = {
    en: { nativeName: t('lng.english') },
    fa: { nativeName: t('lng.persian') }
  }


  const widgets = [
    {
      icon: <FolderSpecialIcon />,
      tooltip: 'مدیریت فایل ها',
      handler: () => dispatch(setShowFilemanager(['mainAttach'])),
      navigate: '',
    },
    {
      icon: <ReceiptLongIcon />,
      tooltip: 'فرم ساز',
      navigate: `${process.env.NEXT_PUBLIC_FORMBUILDER_URL}`
    }
  ]


  let content;

  if (session && status) {
    content = (
      <Box
        className={styles.topbar}
        sx={{
          bgcolor: colors.themeAccent[700],
          color: colors.primary[100],
        }}
      >
        {/* search input */}

        <Box className={styles.topbar_content} >
          {downMd && <IconButton
            sx={{
              position: 'relative',
              zIndex: 4,
              bgcolor: colors.themeAccent[500]
            }}
            onClick={() => dispatch(setSidebarCollapsed())}>
            {sidebarCollapsed ? <SwitchLeftIcon /> : <SwitchRightIcon />}
          </IconButton>}
          <Box className={styles.left}>
            <Typography sx={{ color: themeMode === 'light' ? 'white' : 'inherit' }} >{t('nav.uploadlogo')}</Typography>
          </Box>

          <Box className={styles.right}>
            {/* 

          <Tooltip title='جستجو' >
            <IconButton >
              <SearchIcon />
            </IconButton>
          </Tooltip> */}

            {/* <SearchMenu icon={<SearchIcon />} tooltipText='جستجو' /> */}

            <Tooltip title='اعلان ها' >
              <IconButton
                sx={{ bgcolor: colors.themeAccent[500] }}
              >
                <NotificationsActiveIcon />
              </IconButton>
            </Tooltip>

            <WidgetsMenu icon={<WidgetsIcon />} tooltipText='کلیک کنید' tooltipIcon={<MoveDownIcon />} subItems={widgets} />
       


          </Box>
        </Box>
      </Box>
    )
  }


  return content;
};

export default TopBar;
