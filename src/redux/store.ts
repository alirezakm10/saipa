import { configureStore } from "@reduxjs/toolkit";
import componentReducer from "./features/componentSlice";
import configReducer from './features/configSlice'
import { apiSlice } from "./services/apiSlice";
import sidebarManagerReducer from './features/sidebarSlice'
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { filemanagerReducer, settingsReducer,editorReducer, productsClassificationReducer,menuClassificationReducer, contentsReducer, keywordsCatcherReducer, newsReducer, productReducer, postsClassificationReducer, newsClassificationReducer, docClassificationReducer, docReducer } from "./features"; 
import { productsClassificationApi } from "./services/shop/productsClassificationApi";
import { postClassificationApi } from "./services/contents/postCalssificationApi";
import { usersApi } from "./services/users/usersApi";
import {addressClassificationApi} from "./services/address/addressClassificationApi";
import { filemanagerApi } from "./services/filemanagerApi";
import { ordersApi } from "./services/shop/ordersApi";
import { contentApi } from "./services/contents/contentApi";
import { newsApi } from "./services/news/newsApi";
import { productsApi } from "./services/shop/productsApi";
import { userAddressApi } from "./services/address/userAddressApi";
import { profileApi } from "./services/profile/profileApi";
import { guaranteeApi } from "./services/shop/guaranteeApi";
import { commentsApi } from "./services/comments/commentsApi";
import { ticketsApi } from "./services/tickets/ticketApi";
import { roleApi } from "./services/roles/roleApi";
import { subjectApi } from "./services/tickets/subjectApi";
import { saleReportsApi } from "./services/shop/saleReportsApi";
import { inventoryApi } from "./services/inventoryApi";
import { visitLogsApi } from "./services/logs/visitLogsApi";
import { transportApi } from "./services/shop/transportApi";
import { faqApi } from "./services/faqApi";
import { shopSettingsApi } from "./services/settings/shopSettingsApi";
import { siteSettingsApi } from "./services/settings/siteSettingsApi";
import { galleriesApi } from "./services/other/galleriesApi";
import { slidersApi } from "./services/other/slidersApi";
import { permissionsApi } from "./services/permissions/permissionsApi";
import { tendersApi } from "./services/other/tenders/tendersApi";
import { organizationChartsApi } from "./services/other/organizationCharts/organizationChartsApi";
import { returnApi } from "./services/shop/returnApi";
import { newsletterApi } from "./services/newsletter/newsletterApi";
import { docsClassificationApi } from "./services/documents/docsClassificationApi";
import { docsApi } from "./services/documents/docsApi";
import { discountApi } from "./services/shop/discountApi";

//initializing middlewares
const middleware = (getDefaultMiddleware:any) => [
  ...getDefaultMiddleware({}), 
  apiSlice.middleware,
  productsClassificationApi.middleware,
]

export const store = configureStore({
  reducer: {
    sidebarManager: sidebarManagerReducer,
    fileManager: filemanagerReducer,
    componentStates: componentReducer,
    productsClassificationManager: productsClassificationReducer,
    postsClassificationManager: postsClassificationReducer,
    newsClassificationManager:newsClassificationReducer,
    docClassificationManager:docClassificationReducer,
    contentsManager: contentsReducer,
    newsManager: newsReducer,
    menusManager: menuClassificationReducer,
    docManager: docReducer,
    productManager: productReducer,
    editorManager: editorReducer,
    configs: configReducer,
    settings: settingsReducer,
    keywordsManager: keywordsCatcherReducer,
    [apiSlice.reducerPath] : apiSlice.reducer,
    [productsClassificationApi.reducerPath] : apiSlice.reducer,
    [addressClassificationApi.reducerPath] : apiSlice.reducer,
    [postClassificationApi.reducerPath] : apiSlice.reducer,
    [guaranteeApi.reducerPath] : apiSlice.reducer,
    [contentApi.reducerPath] : apiSlice.reducer,
    [newsApi.reducerPath] : apiSlice.reducer,
    [productsApi.reducerPath] : apiSlice.reducer,
    [ordersApi.reducerPath] : apiSlice.reducer,
    [usersApi.reducerPath] : apiSlice.reducer,
    [commentsApi.reducerPath] : apiSlice.reducer,
    [saleReportsApi.reducerPath] : apiSlice.reducer,
    [inventoryApi.reducerPath] : apiSlice.reducer,
    [filemanagerApi.reducerPath] : apiSlice.reducer,
    [userAddressApi.reducerPath] : apiSlice.reducer,
    [profileApi.reducerPath] : apiSlice.reducer,
    [ticketsApi.reducerPath] : apiSlice.reducer,
    [roleApi.reducerPath] : apiSlice.reducer,
    [faqApi.reducerPath] : apiSlice.reducer,
    [subjectApi.reducerPath] : apiSlice.reducer,
    [transportApi.reducerPath] : apiSlice.reducer,
    [shopSettingsApi.reducerPath] : apiSlice.reducer,
    [siteSettingsApi.reducerPath] : apiSlice.reducer,
    [galleriesApi.reducerPath] : apiSlice.reducer,
    [slidersApi.reducerPath] : apiSlice.reducer,
    [permissionsApi.reducerPath] : apiSlice.reducer,
    [tendersApi.reducerPath] : apiSlice.reducer,
    [organizationChartsApi.reducerPath] : apiSlice.reducer,
    [returnApi.reducerPath] : apiSlice.reducer,
    [newsletterApi.reducerPath] : apiSlice.reducer,
    [docsClassificationApi.reducerPath] : apiSlice.reducer,
    [docsApi.reducerPath] : apiSlice.reducer,
    [discountApi.reducerPath] : apiSlice.reducer,

  },
// devTools: process.env.NODE_ENV !== "production",
middleware
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch