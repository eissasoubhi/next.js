import Link from 'next/link'

import { Ticker } from './components/Ticker'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">home</Link>
        </nav>
        <Ticker />
        {children}
      </body>
    </html>
  )
}
