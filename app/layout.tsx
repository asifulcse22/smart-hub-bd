import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
// @ts-ignore: CSS import type declarations are not available in this project setup
import './globals.css'

export const metadata: Metadata = {
  title: 'স্মার্ট হাব বিডি - Smart Hub BD',
  description: 'বাংলাদেশের স্মার্ট ডিজিটাল সেবা প্ল্যাটফর্ম। NID, স্মার্টকার্ড, TIN সহ ৪২টিরও বেশি সরকারি সেবা এক জায়গায়।',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="bn">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}