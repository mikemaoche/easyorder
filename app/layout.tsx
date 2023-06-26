import './globals.css'
// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EasyOrder',
  description: 'Order Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
        /> */}
        <body suppressHydrationWarning={true}>{children}</body>
      {/* <body suppressHydrationWarning={true} className={inter.className}>{children}</body> */}
    </html>
  )
}
