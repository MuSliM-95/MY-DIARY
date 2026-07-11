import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Твой Дневник — привычки, молитвы и личный прогресс",
  description:
    "Отслеживайте привычки, молитвы, чтение Корана, цели и ежедневный прогресс в одном приложении.",

  keywords: [
    "дневник",
    "трекер привычек",
    "ежедневник",
    "молитвы",
    "Коран",
    "исламский дневник",
    "саморазвитие",
    "личный прогресс",
    "трекер целей",
    "habit tracker",
  ],

  applicationName: "Твой Дневник",

  manifest: "/manifest.json",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Твой Дневник",
    description:
      "Привычки, молитвы, Коран, цели и личный прогресс в одном месте.",
    type: "website",
    locale: "ru_RU",
  },

  twitter: {
    card: "summary_large_image",
    title: "Твой Дневник",
    description:
      "Привычки, молитвы, Коран и личный прогресс.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Tracker" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
      </head>
      <body
        className={`${inter.className} ${geistSans.variable} bg-black ${geistMono.variable}`}
      >
        {/* <Toaster /> */}
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="next"
            enableSystem={false}
            themes={["next", "dark"]}
          >
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
