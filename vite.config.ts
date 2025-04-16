import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import {VitePWA} from "vite-plugin-pwa"

const manifestForPlugin = {
  registerType:'prompt',
  includeAssets:["logo.svg"],
  manifest:{
    name:"Phone Flipper",
    short_name:"Phone Flipper",
    description:"Phone Flipper",
    icons:[{
        src: '/Phone-Flinger/logo.svg',
        sizes:"48x48 72x72 96x96 128x128 256x256 512x512",
        type:'image/svg+xml',
        purpose:'any'
      }],
    theme_color:'#171717',
    background_color:'#f0e7db',
    display:"standalone",
    scope:'/Phone-Flinger/',
    start_url:"/Phone-Flinger/",
    orientation:'portrait'
  }
}

export default defineConfig({
  base: '/Phone-Flinger/',
  plugins: [react(), VitePWA(manifestForPlugin as any)],
})
