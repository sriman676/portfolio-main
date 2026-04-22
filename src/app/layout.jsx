import React from 'react';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import '../index.css';
import FuturisticCursor from '../components/FuturisticCursor';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'V. Sriman Rutvik | Cybersecurity Portfolio',
  description: 'Immersive deep-space engineering showcase and advanced SOC Analyst command interface built for threat detection and operational resilience.',
  keywords: ['Cybersecurity', 'SOC Analyst', 'Threat Hunting', 'SIEM', 'Splunk', 'Network Security', 'React', 'Next.js'],
  authors: [{ name: 'Sriman Rutvik' }],
  creator: 'Sriman Rutvik',
  openGraph: {
    title: 'V. Sriman Rutvik | SOC Cybersecurity Professional',
    description: 'Immersive cybersecurity portfolio & engineering showcase.',
    url: 'https://sriman-rutvik.com/',
    siteName: 'BioSec Orbital Station',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sriman Rutvik | Cyber Specialist',
    description: 'SOC Analyst command interface.',
  },
};

// JSON-LD structured data (safe: no user input, pure static config)
const jsonLd = (() => {
  try {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Voddiraju Sriman Rutvik',
      jobTitle: 'Lead SOC Analyst | Cybersecurity Specialist',
      url: 'https://sriman-rutvik.com/',
      sameAs: [
        'https://linkedin.com/in/Sriman-Rutvik',
        'https://github.com/sriman676',
      ],
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'SRM University AP',
      },
      knowsAbout: [
        'Cybersecurity', 'SOC Operations', 'Splunk', 'SIEM', 'Threat Hunting', 'Wireshark',
      ],
    };
  } catch {
    return {};
  }
})();

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <FuturisticCursor />
        {children}
      </body>
    </html>
  );
}
