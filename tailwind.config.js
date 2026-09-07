/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#004ac6',
        'primary-dim': '#003ea8',
        'primary-fixed': '#dbe1ff',
        'primary-fixed-dim': '#b4c5ff',
        'on-primary': '#ffffff',
        'on-primary-fixed': '#00174b',
        'on-primary-fixed-variant': '#003ea8',
        secondary: '#0058be',
        'secondary-container': '#2170e4',
        'on-secondary-container': '#fefcff',
        tertiary: '#00569c',
        'tertiary-container': '#196fc0',
        'on-tertiary': '#ffffff',
        background: '#f9f9fe',
        surface: '#f9f9fe',
        'surface-dim': '#d9dadf',
        'surface-container': '#ededf3',
        'surface-container-low': '#f3f3f9',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e8e8ed',
        'surface-container-highest': '#e2e2e7',
        'surface-variant': '#e2e2e7',
        'on-surface': '#1a1c20',
        'on-background': '#1a1c20',
        'on-surface-variant': '#434655',
        outline: '#737686',
        'outline-variant': '#c3c6d7',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
}