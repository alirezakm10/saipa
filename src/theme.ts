'use client'
import { createContext, useState, useMemo } from "react";
import { createTheme, Theme } from "@mui/material/styles";

type ColorTokens = {
  grey: Record<number, string>;
  primary: Record<number, string>;
  greenAccent: Record<number, string>;
  redAccent: Record<number, string>;
  blue: Record<number, string>;
  themeAccent: Record<number, string>;
};



type ColorModeContextValue = {
  toggleColorMode: () => void;
};

type DirectionModeContextValue = {
  toggleDirectionMode: () => void;
};

type TokensFunction = (mode: PaletteMode) => ColorTokens;



type PaletteMode = "dark" | "light" | string;
type Direction = "ltr" | "rtl";
type PaletteColors = {
  primary: {
    main: string;
  };
  secondary: {
    main: string;
  };
  neutral: {
    dark: string;
    main: string;
    light: string;
  };
  background: {
    default: string;
  };
};


type MuiThemeSettings = (mode: PaletteMode) => {
  // direction: Direction;
  palette: PaletteColors;
  typography: {
    fontFamily: string;
    fontSize: number;
    h1: {
      fontFamily: string;
      fontSize: number;
    };
    h2: {
      fontFamily: string;
      fontSize: number;
    };
    h3: {
      fontFamily: string;
      fontSize: number;
    };
    h4: {
      fontFamily: string;
      fontSize: number;
    };
    h5: {
      fontFamily: string;
      fontSize: number;
    };
    h6: {
      fontFamily: string;
      fontSize: number;
    };
  };
};



// color design tokens export
export const tokens: TokensFunction = (mode) => ({
  ...(mode === "dark"
    ? {
      grey: {
        100: "#f5f5f5",
        200: "#eeeeee",
        300: "#e0e0e0",
        400: "#bdbdbd",
        500: "#9e9e9e",
        600: "#757575",
        700: "#616161",
        800: "#424242",
        900: "#212121",
      },
      primary: {
        100: "#d0d1d5",
        200: "#a1a4ab",
        300: "#727681",
        400: "#1F2A40",
        500: "#141b2d",
        600: "#101624",
        700: "#0c101b",
        800: "#080b12",
        900: "#040509",
      },
      greenAccent: {
        100: "#dbf5ee",
        200: "#b7ebde",
        300: "#94e2cd",
        400: "#70d8bd",
        500: "#4cceac",
        600: "#3da58a",
        700: "#2e7c67",
        800: "#1e5245",
        900: "#0f2922",
      },
      redAccent: {
        100: "#f8dcdb",
        200: "#f1b9b7",
        300: "#e99592",
        400: "#e2726e",
        500: "#db4f4a",
        600: "#af3f3b",
        700: "#832f2c",
        800: "#58201e",
        900: "#2c100f",
      },

      blue: {
        100: "#b2ebf2",
        200: "#80deea",
        300: "#4dd0e1",
        400: "#26c6da",
        500: "#00bcd4",
        600: "#00acc1",
        700: "#0097a7",
        800: "#00838f",
        900: "#006064"
      },


      themeAccent: {
        100: "#d1c4e9",
        200: "#b39ddb",
        300: "#9575cd",
        400: "#7e57c2",
        500: "#673ab7",
        600: "#5e35b1",
        700: "#512da8",
        800: "#4527a0",
        900: "#311b92"
      },
    }
    : {
      grey: {
        100: "#212121",
        200: "#424242",
        300: "#616161",
        400: "#757575",
        500: "#9e9e9e",
        600: "#bdbdbd",
        700: "#e0e0e0",
        800: "#eeeeee",
        900: "#f5f5f5",
      },
      primary: {
        100: "#040509",
        200: "#080b12",
        300: "#0c101b",
        400: "#f2f0f0", // manually changed
        500: "#141b2d",
        600: "#1F2A40",
        700: "#727681",
        800: "#a1a4ab",
        900: "#fff",
      },
      greenAccent: {
        100: "#0f2922",
        200: "#1e5245",
        300: "#2e7c67",
        400: "#3da58a",
        500: "#4cceac",
        600: "#70d8bd",
        700: "#94e2cd",
        800: "#b7ebde",
        900: "#dbf5ee",
      },
      redAccent: {
        100: "#2c100f",
        200: "#58201e",
        300: "#832f2c",
        400: "#af3f3b",
        500: "#db4f4a",
        600: "#e2726e",
        700: "#e99592",
        800: "#f1b9b7",
        900: "#f8dcdb",
      },
      blue: {
        100: "#006064",
        200: "#00838f",
        300: "#0097a7",
        400: "#00acc1",
        500: "#00bcd4",
        600: "#26c6da",
        700: "#4dd0e1",
        800: "#80deea",
        900: "#b2ebf2",
      },
      themeAccent: {
        100: "#311b92",
        200: "#4527a0",
        300: "#512da8",
        400: "#5e35b1",
        500: "#673ab7",
        600: "#7e57c2",
        700: "#9575cd",
        800: "#b39ddb",
        900: "#d1c4e9",
      },
    }),
});


  

// context for color mode
export const ColorModeContext = createContext<ColorModeContextValue>({
  toggleColorMode: () => { },
});

export const DirectionModeContext = createContext<DirectionModeContextValue>({
  toggleDirectionMode: () => {}
})

type UseModeReturnType = [Theme, ColorModeContextValue,DirectionModeContextValue];

type UseModeHook = () => UseModeReturnType 

export const useMode: UseModeHook = () => {
  const [mode, setMode] = useState("dark");
  const [direction, setDirection] = useState<"rtl" | "ltr">("rtl");


  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"))},
    }),
    []
  );

  const directionMode = useMemo(
    () => ({
      toggleDirectionMode: () => {
        setDirection((prev) => (prev === "rtl" ? "ltr" : "rtl"));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode,directionMode];

};

// mui theme settings
export const themeSettings: MuiThemeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    components: {
      mode: mode,
      ...(mode === "dark"
        ?
        {
          MuiMenu: {
            styleOverrides: {
              
                paper: {
                  '::before': {
                    backgroundColor: '#222F3E',  // Change the background color to your desired color
                  },
                },
              
            }
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: '10px',
                ":hover": {
                  background: colors.blue[600]
                }
              }
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                ":hover": {
                  background: colors.blue[600]
                }
              }
            }
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                background: '#222F3E'
              }
            }
          }
        }
        :
        {
          MuiButton: {
            styleOverrides: {
              root: {
                ":hover": {
                  background: colors.blue[600]
                }
              }
            }
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: '10px',
                background: colors.themeAccent[500],
                color: colors.primary[900]
              }
            }
          }
        })
    },
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
          // palette values for dark mode
          primary: {
            main: colors.grey[200],
          },
          secondary: {
            main: colors.greenAccent[500],
          },
          neutral: {
            dark: colors.grey[700],
            main: colors.grey[500],
            light: colors.grey[100],
          },
          background: {
            default: colors.primary[500],
          },
        }
        : {
          // palette values for light mode
          primary: {
            main: colors.primary[100],
          },
          secondary: {
            main: colors.greenAccent[500],
          },
          neutral: {
            dark: colors.grey[700],
            main: colors.grey[500],
            light: colors.grey[100],
          },
          background: {
            default: colors.primary[900],
          },
        }),
    },
    typography: {
      fontFamily: ['var(--font-iransanso)', "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};



