import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { profile } from "@/content/profile";
import "./globals.css";

const dmSans = localFont({ src: "../../public/fonts/dm-sans.ttf", variable: "--font-dm-sans", display: "swap", weight: "100 1000" });
const description = "Nishant Porwal’s portfolio: real-time applications, backend systems, and applied AI. Computer Science at NIT Delhi, class of 2027.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: { default: "Nishant Porwal — Software Developer", template: "%s | Nishant Porwal" },
  description,
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  authors: [{ name: profile.name }],
  openGraph: { title: "Nishant Porwal — Software Developer", description, siteName: "Nishant Porwal", type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image", title: "Nishant Porwal — Software Developer", description },
};

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F6F2F2" }, { media: "(prefers-color-scheme: dark)", color: "#0C1013" }] };

// Resolve the theme before paint; the button uses the same attribute and storage key.
const themeScript = `(function(){var m=matchMedia('(prefers-color-scheme:dark)');var saved;try{saved=localStorage.getItem('portfolio-theme')}catch(e){}function apply(){document.documentElement.dataset.theme=saved==='dark'||saved==='light'?saved:m.matches?'dark':'light';window.dispatchEvent(new Event('portfolio-theme'))}apply();m.addEventListener('change',apply);window.addEventListener('storage',function(e){if(e.key==='portfolio-theme'){saved=e.newValue;apply()}});window.addEventListener('portfolio-theme',function(){try{saved=localStorage.getItem('portfolio-theme')}catch(e){}})})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={dmSans.variable}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <NavBar />
        <main id="main" className="container" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
