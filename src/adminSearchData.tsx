import { ReactNode } from 'react';
import DashboardIcon from "@mui/icons-material/Dashboard";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CategoryIcon from "@mui/icons-material/Category";


export interface IAdminSearchData {
    faTitle: string,
    enTitle: string,
    faSubtitle: string,
    enSubtitle: string,
    link: string,
    icon: ReactNode 
}


export const adminSearchData: IAdminSearchData[] = [
    {
        faTitle: 'طبقه بندی',
        enTitle: 'Classification',
        faSubtitle: 'دسته بندی, ویژگی, کلمات کلیدی',
        enSubtitle:'category, specification, keyword',
        link: '/adminpanel/classification',
        icon: <CategoryIcon />
    },
    {
        faTitle: 'صفحه اصلی',
        enTitle: 'Dashboard',
        faSubtitle: 'صفحه اصلی پنل ادمین',
        enSubtitle:'main page of adminpanel',
        link: '/adminpanel',
        icon: <DashboardIcon /> 
    },
    {
        faTitle: 'سئو',
        enTitle: 'Seo',
        faSubtitle: 'مدیریت ماژول سئو',
        enSubtitle:'seo module manager',
        link: '/adminpanel/seo',
        icon: <QueryStatsIcon /> 
    },
    {
        faTitle: 'کاربران',
        enTitle: 'Users',
        faSubtitle: 'ایجاد و حذف کاربر, مدیریت نقش ها, لیست کاربران',
        enSubtitle:'create and delete user, role managment, users list',
        link: '/adminpanel/users',
        icon: <QueryStatsIcon /> 
    },

];
