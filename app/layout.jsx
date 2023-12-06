import Provider from './components/Provider'
import './globals.css'
import { Toaster } from "react-hot-toast"

export const metadata = {
  title: 'Pearls Collections',
  description: 'Created by Ritta Sweta',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-left" />
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
