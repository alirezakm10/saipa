

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import QuizIcon from '@mui/icons-material/Quiz';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import PublicIcon from '@mui/icons-material/Public';
import SettingsIcon from '@mui/icons-material/Settings';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

export const sidebarData = [
    {
      menuId:0,
      name: "sidenav.dashboard",
      icon: <DashboardIcon />,
      link: "/adminpanel",
      permission : null,
    },
    {
      menuId:1,
      name: "sidenav.users",
      icon: <PeopleAltIcon />,
      link: "",
      permission : null,
      subMenus: [
        {
          name: "sidenavsub.allUsers",
          icon: null,
          link: "/adminpanel/users",
          permission : "User.index",
        },
        {
          name: "sidenavsub.addUser",
          icon: null,
          link: "/adminpanel/users/adduser",
          permission : "User.create",
        },
        {
          name: "sidenavsub.userLoginLogs",
          icon: null,
          link: "/adminpanel/users/logs",
          permission : "SignIn.index",
        },
        {
          name: "sidenavsub.rolesAndPermissions",
          icon: null,
          link: "/adminpanel/roles",
          permission : "Role.index",
        },
        
      ],
    },
    {
      menuId:2,
      name: "sidenav.posts",
      icon: <NoteAltIcon />,
      link: "",
      permission : null,
      subMenus: [
        {
          name: "sidenavsub.allPosts",
          icon: null,
          link: "/adminpanel/posts",
          permission : "Content.index",
        },
        {
          name: "sidenavsub.addPost",
          icon: null,
          link: "/adminpanel/posts/addpost",
          permission : "Content.create",
        },
        {
          name: "sidenavsub.postsComments",
          icon: null,
          link: "/adminpanel/posts/comments",
          permission : "Comment.index",
        },
        {
          name: "sidenavsub.postsClassification",
          icon: null,
          link: "/adminpanel/posts/classification",
          permission : "Classification.index",
        },
      ],
    },
    {
      menuId:3,
      name: "sidenav.news",
      icon: <PublicIcon />,
      link: "",
      permission : null,
      subMenus: [
        {
          name: "sidenavsub.allNews",
          icon: null,
          link: "/adminpanel/news",
          permission : "News.index",
        },
        {
          name: "sidenavsub.addNews",
          icon: null,
          link: "/adminpanel/news/addnews",
          permission : "News.create",
        },
          {
          name: "sidenavsub.newsComments",
          icon: null,
          link: "/adminpanel/news/comments",
          permission : "Comment.index",
        },
        {
          name: "sidenavsub.newsClassification",
          icon: null,
          link: "/adminpanel/news/classification",
          permission : "Classification.index",
        },
      ],
    },
    {
      menuId:4,
      name: "sidenav.documents",
      icon: <HistoryEduIcon />,
      link: "",
      permission : null,
      subMenus: [
        {
          name: "sidenavsub.allDocuments",
          icon: null,
          link: "/adminpanel/docs",
          permission : "Document.index",
        },
        {
          name: "sidenavsub.addDocument",
          icon: null,
          link: "/adminpanel/docs/add-doc",
          permission : "Document.create",
        },
        {
          name: "sidenavsub.documentsClassification",
          icon: null,
          link: "/adminpanel/docs/classification",
          permission : "Classification.index",
        },
      ],
    },
    {
      menuId:5,
      name: "sidenav.store",
      icon: <StoreIcon />,
      link: "",
      permission : null,
      subMenus: [
        {
          name: "sidenavsub.allProducts",
          icon: null,
          link: "/adminpanel/shop/allproducts",
          permission : "Product.index",
        },
        {
          name: "sidenavsub.addProduct",
          icon: null,
          link: "/adminpanel/shop/addproduct",
          permission : "Product.create",
        },
        {
          name: "sidenavsub.productsDiscounts",
          icon: null,
          link: "/adminpanel/shop/discount",
          permission : "Discount.index",
        },
        {
          name: "sidenavsub.productsTransportPlane",
          icon: null,
          link: "/adminpanel/shop/transport",
          permission : "Post.index",
        },
        {
          name: "sidenavsub.productsOrdersList",
          icon: null,
          link: "/adminpanel/shop/orders",
          permission : "Order.index",
        },
        {
          name: "sidenavsub.productsReturn",
          icon: null,
          link: "/adminpanel/shop/returns",
          permission : "Order.index",
        },
        {
          name: "sidenavsub.productsGuaranties",
          icon: null,
          link: "/adminpanel/shop/guarantee",
          permission : "Guarantee.index",
        },
        {
          name: "sidenavsub.productsComments",
          icon: null,
          link: "/adminpanel/shop/comments",
          permission : "Comment.index",
        },
        {
          name: "sidenavsub.productsClassification",
          icon: null,
          link: "/adminpanel/shop/classification",
          permission : "Classification.index",
        },
        {
          name: "sidenavsub.productsLogs",
          icon: null,
          link: "/adminpanel/shop/reports",
          permission : "Product.index",
        }
      ],
    },
    {
      menuId:6,
      name: "sidenav.messages",
      icon: <QuestionAnswerIcon />,
      link: "",
      permission : null,
      subMenus: [
        {
          name: "sidenavsub.tickets",
          icon: null,
          link: "/adminpanel/tickets",
          permission : "Ticket.index",
        },
        // {
        //   name: "پشتیبانی آنلاین",
        //   icon: null,
        //   link: "/",
        // },
      ],
    },
    {
      menuId:7,
      name: "sidenav.inventory",
      icon: <InventoryIcon />,
      link: "",
      permission : null,
      subMenus: [
        {
          name: "sidenavsub.inventoryManagement",
          icon: null,
          link: "/adminpanel/inventory",
          permission : "InOutLog.index"
        },
        {
          name: "sidenavsub.inventoryLogs",
          icon: null,
          link: "/adminpanel/inventory/report",
          permission : "InOutLog.index"
        },
      ],
    },
    {
      menuId:8,
      name: "sidenav.faq",
      icon: <QuizIcon />,
      link: "",
      permission : null,
      subMenus: [
        {
          name: "sidenavsub.faqList",
          icon: null,
          link: "/adminpanel/faq/faq-list",
          permission : "Faq.index"
        },
        {
          name: "sidenavsub.addFaq",
          icon: null,
          link: "/adminpanel/faq/add-faq",
          permission : "Faq.create"
        },
      ],
    },
    {
      menuId:9,
      name: "sidenav.settings",
      icon: <SettingsIcon />,
      link: "",
      permission : null,
      subMenus: [
        {
          name: "sidenavsub.siteSettings",
          icon: null,
          link: "/adminpanel/settings/site-settings",
          permission : "Setting.index",
        },
        {
          name: "sidenavsub.shopSettings",
          icon: null,
          link: "/adminpanel/settings/shop-settings",
          permission : "SettingShop.index",
        },
      ],
    },
    {
      menuId:10,
      name: "sidenav.other",
      icon: <AutoAwesomeMotionIcon />,
      link: "",
      permission : null,
      subMenus: [
        {
          name: "sidenavsub.otherSldiers",
          icon: null,
          link: "/adminpanel/other/sliders",
          permission: "Promotion.index"
        },
        {
          name: "sidenavsub.otherGalleries",
          icon: null,
          link: "/adminpanel/other/galleries",
          permission: "Gallery.index"
        },
        {
          name: "sidenavsub.otherTunder&Auction",
          icon: null,
          link: "/adminpanel/other/tenders",
          permission : "Tender.index"
        },
        {
          name: "sidenavsub.otherOrganizationChart",
          icon: null,
          link: "/adminpanel/other/organization-charts",
          permission : "Chart.index"
        },
        {
          name: "sidenavsub.otherNewsLetters",
          icon: null,
          link: "/adminpanel/other/newsletter",
          permission : "Newsletter.index"
        },
      ],
    },
  ];