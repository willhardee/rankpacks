import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RankPacks',
  description: 'Create ranking packs with friends and reveal consensus results.',
  manifest: '/manifest.webmanifest',
  themeColor: '#5b21b6'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
