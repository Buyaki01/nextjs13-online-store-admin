import Provider from './components/Provider'
import './globals.css'

export const metadata = {
  title: 'Pearls Collections',
  description: 'Created by Ritta Sweta',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  )
}
