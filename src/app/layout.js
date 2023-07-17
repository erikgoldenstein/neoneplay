import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ne:One Play',
  description: 'Play around with your OneRecord Database',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ overflow: "hidden" }}>{children}</body>
    </html >
  )
}
