'use client'
import React from 'react'
import Link from "next/link";
import { Box, MenuItem, useTheme, Typography, Divider, Tooltip } from '@mui/material';
import { usePathname } from "next/navigation";
import { tokens } from '@/theme';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectThemeDirection } from '@/redux/features/configSlice';
import { useTranslation } from 'react-i18next';
import useTextTruncation from '@/hooks/useTextTruncation';

interface Props {
    subs: any;
    headName?: string;
}


const SubSideOne: React.FC<Props> = ({ subs, headName }) => {
    const truncateText = useTextTruncation()
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const pathname = usePathname();
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const themeDirection = useAppSelector(selectThemeDirection)
    const getThemeDirection = localStorage.getItem('dir')


    return (
        subs?.length > 0 && <Box
            sx={{
                position: 'absolute',
                top: 0,
                overflowClipBox: 'content-box',
                width: '100%',
                height: '100vh',
                bgcolor: 'transparent'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    overflowY: 'auto',
                    transition: '.3s',
                    top: '0',
                    left: getThemeDirection === 'rtl' ? '45px' : 0,
                    right: getThemeDirection === 'rtl' ? 0 : '45px',
                    borderRadius: '10px',
                    zIndex: 3,
                    width: '300px',
                    height: '100vh',
                    color: '#fff',
                    p: 1,
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'saturate(180%) blur(10px)',
                }}
            >
                <Typography component='h1' variant='h4' >{t(headName!)}</Typography>
                <Divider variant='middle' sx={{ my: 1, borderColor: '#f5f5f5' }} />
                {subs?.map((item: any, idx: number) => (
                    <Tooltip key={idx} title={t(item.name)} >
                        <Link
                            href={item.link}>
                            <MenuItem
                                sx={{
                                    borderStyle: pathname === item.link ? "solid" : "none",
                                    borderWidth: "9px 9px 9px 0",
                                    borderColor: `transparent ${colors.blue[300]} transparent transparent`,
                                    height: "40px",
                                }}
                                value={10}>
                                <Typography component='p' variant='subtitle1' >{truncateText(t(item.name), 20)}</Typography>

                            </MenuItem>
                        </Link>
                    </Tooltip>
                ))}
            </Box>
        </Box>
    )
}

export default SubSideOne