import './globals.css';

export const metadata = {
  title: 'Socialpower Portal',
  description: 'Secure customer portal for Socialpowerv1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}