import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { AppProps } from "next/app";
import "../styles/globals.css";
import { SpotlightProvider } from "@mantine/spotlight";
import { IconMoonStars, IconSunHigh } from "@tabler/icons";
import { Header } from "../components/header";
import { NotificationsProvider } from "@mantine/notifications";
import { motion, AnimatePresence } from "framer-motion";
import { RouterTransition } from "@components/router";
import { UserProvider } from "../context/user";

export default function App(props: AppProps) {
  const { Component, ...pageProps } = props;
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <UserProvider>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <style global jsx>
          {`
            body {
              color: ${colorScheme === "dark" ? "#ffffff" : "unset"} !important;
            }
          `}
        </style>
        <MantineProvider
          theme={{
            colorScheme,
            fontFamily: "Inter",
            white: "#ffffff",
          }}
          withGlobalStyles
          withNormalizeCSS
          withCSSVariables
        >
          <SpotlightProvider
            actions={[
              {
                title: "Toggle Theme",
                onTrigger: () => toggleColorScheme(),
                description: "Toggle Theme Between Light and Dark Mode",
                icon:
                  colorScheme === "dark" ? (
                    <IconSunHigh size={24} />
                  ) : (
                    <IconMoonStars size={24} />
                  ),
                keywords: ["theme", "dark", "light"],
              },
            ]}
            shortcut="mod + J"
          >
            <NotificationsProvider>
              <Header />
              <RouterTransition />
              <AnimatePresence mode="wait">
                <motion.div
                  variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  key={pageProps.router.pathname}
                >
                  <Component {...pageProps} />
                </motion.div>
              </AnimatePresence>
            </NotificationsProvider>
          </SpotlightProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </UserProvider>
  );
}
