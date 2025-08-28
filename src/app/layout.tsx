// app/layout.tsx
import { Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './provider'; // import wrapper client component

const outfit = Outfit({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
