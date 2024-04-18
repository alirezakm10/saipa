
import "./globals.css";
import { Inter } from "next/font/google";
import { CssBaseline } from "@mui/material";
import { ReduxProvider } from "@/redux/ReduxProvider";
import ProvidersConfig from "@/providers/ProvidersConfig";
import localFont from "next/font/local";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import DesignerContextProvider from "@/components/formBuilder/context/DesignerContext";


const inter = Inter({ subsets: ["latin"] });
const Iransans = localFont({
  variable: "--font-iransans",
  src: [
    {
      path: "./adminpanel/fonts/iransans/ultralight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./adminpanel/fonts/iransans/light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./adminpanel/fonts/iransans/medium.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./adminpanel/fonts/iransans/bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa"  >
      <body className={Iransans.className}>
        <ReduxProvider>
          <ProvidersConfig  >
            <CssBaseline />
            <DesignerContextProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </DesignerContextProvider>
          </ProvidersConfig>
        </ReduxProvider>
      </body>
    </html>
  );
}
