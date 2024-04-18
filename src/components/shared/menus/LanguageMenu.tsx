// this menu contains one or multiple icon button
import { useState, ReactNode } from "react";
import {
    Box,
    Menu,
    Stack,Tooltip, IconButton, useTheme
} from "@mui/material";
import Link from "next/link";
import { tokens } from "@/theme";
import { useTranslation, Trans } from 'react-i18next';
import i18n from "../../../../i18next";
import TranslateIcon from '@mui/icons-material/Translate';
import { IranFlagSvg } from "@/svg";
import { UsaFlagSvg } from "@/svg";


type TLanguageInfo = {
    nativeName: string;
    icon: ReactNode
};

type TLanguages = {
    [key: string]: TLanguageInfo;
};



const LanguageMenu = () => {
    const { t } = useTranslation()
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

     const lngs: TLanguages = {
        en: {
            nativeName: t('lng.english'),
            icon: <UsaFlagSvg /> 
        },
        fa: {
            nativeName: t('lng.persian'),
            icon: <IranFlagSvg />
           
        }
    }



    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
            <Tooltip
                title={
                    <Stack direction="row" spacing={2} alignItems="center">
                        <span>تغییر زبان</span>
                        {<TranslateIcon />}
                    </Stack>
                }
            >
                <IconButton
                    onClick={handleClick}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    sx={{ bgcolor: colors.themeAccent[500] }}
                >
                    {<TranslateIcon />}
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                        width: "fit-content",
                        p: 2,
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            // bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {Object.keys(lngs).map((lng, idx:number) => (
                    <span key={idx} >
                    <IconButton
                            sx={{
                                mx: 1, filter: "drop-shadow(20px 10px 10px 10px white)",
                                bgcolor: colors.themeAccent[500]
                            }}
                    onClick={() => i18n.changeLanguage(lng)}>
                        {lngs[lng].icon}
                    </IconButton>
                    </span>
                ))}
            </Menu>
        </Box>
    );
};

export default LanguageMenu;
