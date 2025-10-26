import './globals.css'
import { ThemeProvider } from 'next-themes'

export const metadata = {
  title: 'Crypto Price Tracker Dashboard',
  description: 'Real-time cryptocurrency price tracking dashboard with live data from CoinGecko',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}