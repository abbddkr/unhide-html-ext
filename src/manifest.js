import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'Unhide HTML & More',
  description: 'Unhide HTML Code and scan bundled javascript for critical information',
  version: '1.0.0',
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png',
    32: 'img/logo-34.png',
    48: 'img/logo-48.png',
    128: 'img/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  options_page: 'options.html',
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/index.js'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-34.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: ['scripting','activeTab','tabs'],
})
