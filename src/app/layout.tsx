import type { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import "./styles/typography.css";

import { cn } from "@raight/utils";
import { ThemeSync } from "@raight/components/theme-sync";
import { ThemeSyncScript } from "@raight/components/theme-sync-script";
import { Settings } from "@raight/lib/settings";
import { AppContextProvider } from "@raight/components/context";
import { SideBar } from "@raight/components/side-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(Settings.site.host),
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
      sizes: "192x192",
      type: "image/x-icon",
    },
    {
      rel: "apple-touch-icon",
      url: "/assets/icons/logo.192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      url: "/assets/icons/logo.32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      url: "/assets/icons/logo.64x64.png",
      sizes: "64x64",
      type: "image/png",
    },
    {
      url: "/assets/icons/logo.72x72.png",
      sizes: "72x72",
      type: "image/png",
    },
    {
      url: "/assets/icons/logo.152x152.png",
      sizes: "152x152",
      type: "image/png",
    },
    {
      url: "/assets/icons/logo.384x384.png",
      sizes: "384x384",
      type: "image/png",
    },
  ],
  title: {
    default: "Raight",
    template: "%s · Raight",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Babble",
    statusBarStyle: "black-translucent",
  },
  description: "Ai assisted writing.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "hsl(0 0% 100%)" },
    { media: "(prefers-color-scheme: dark)", color: "hsl(0 0% 3.9%)" },
  ],
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className="h-full w-full antialiased overflow-hidden"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark.min.css"
        />
        <ThemeSyncScript />
      </head>
      <body
        className={cn(
          inter.className,
          "h-full w-full bg-secondary text-foreground",
          "relative"
        )}
      >
        <AppContextProvider>
          <div className="flex h-full w-full flex-nowrap">
            <SideBar />
            <div
              className={cn(
                "grow transition-all",
                "pt-4 m-2 rounded-md",
                "flex flex-col flex-nowrap"
              )}
            >
              {children}
            </div>
          </div>
        </AppContextProvider>
      </body>
      <ThemeSync />
    </html>
  );
}
