import '@fontsource-variable/manrope';
import './globals.css';
import Providers from './providers';

export const metadata = {
  title: { default: 'Doctor Tracker', template: '%s | Doctor Tracker' },
  description: 'Manage doctors and their patients, and see how your practice is doing.',
  icons: { icon: '/favicon.svg' },
};

export const viewport = {
  themeColor: '#0a2a29',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
