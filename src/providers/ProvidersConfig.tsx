"use client";
import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { I18nextProvider } from "react-i18next";
// import i18n from "../../i18next";
import { Container, Box, IconButton, useTheme } from "@mui/material";
import { ColorModeContext, tokens, useMode, DirectionModeContext } from "@/theme";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { SessionProvider } from "next-auth/react";
import AuthenticationLogics from "./AuthenticationLogics";
// all global components should add here like modals and file manager
interface Props {
  children: ReactNode;
}

const ProvidersConfig: React.FC<Props> = ({ children }) => {
  // const colors = tokens(theme.palette.mode);
  // language setter is in /components/buttons/langBtn.tsx
  const [theme, colorMode, directionMode] = useMode();
  const backgroundColorType = theme.palette.mode;

  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  return (
    <SessionProvider  >
      <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <DirectionModeContext.Provider value={directionMode} >
              {/* <I18nextProvider i18n={i18n}> */}
                    <AuthenticationLogics>{children}</AuthenticationLogics>
              {/* </I18nextProvider> */}
          </DirectionModeContext.Provider>
        </ColorModeContext.Provider>
            </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
};

export default ProvidersConfig;
