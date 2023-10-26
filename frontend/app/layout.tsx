import './globals.scss'
import { ReduxProvider } from '@/redux/provider'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Traffic Planner Gadget',
  description: 'An app for searching Göteborg public transport journeys.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
            {children}
        </ReduxProvider>
      </body>
    </html>
  )
}
