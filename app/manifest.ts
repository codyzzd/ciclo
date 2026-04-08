import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Meu Ciclo',
    short_name: 'Meu Ciclo',
    description: 'Acompanhe seu ciclo menstrual',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#FF385C',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
