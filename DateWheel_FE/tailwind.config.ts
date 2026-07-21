import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        brand: 'var(--brand)',
        'brand-medium': 'var(--brand-medium)',
        'brand-strong': 'var(--brand-strong)',
        'neutral-primary-soft': 'var(--neutral-primary-soft)',
        'neutral-secondary-medium': 'var(--neutral-secondary-medium)',
        'neutral-tertiary-medium': 'var(--neutral-tertiary-medium)',
        'glass-bg': 'var(--glass-bg)',
        'glass-bg-hover': 'var(--glass-bg-hover)',
        'glass-border': 'var(--glass-border)',
        'glass-border-subtle': 'var(--glass-border-subtle)',
        'body': 'var(--body)',
        'heading': 'var(--heading)',
        'body-subtle': 'var(--body-subtle)',
        'danger': 'var(--danger)',
        'danger-medium': 'var(--danger-medium)',
        'danger-strong': 'var(--danger-strong)',
        'success': 'var(--success)',
        'success-medium': 'var(--success-medium)',
        'success-strong': 'var(--success-strong)',
        'warning': 'var(--warning)',
        'warning-medium': 'var(--warning-medium)',
        'warning-strong': 'var(--warning-strong)',
        'neutral-tertiary': 'var(--neutral-tertiary)',
        'border-default-medium': 'var(--border-default-medium)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        base: '20px',
      },
      boxShadow: {
        'glass': 'var(--glass-shadow)',
        'glint': '0 1px 2px 0 rgba(0, 0, 0, 0.05), inset var(--color-1-400) 0 6px 0px -5px, var(--color-1-700) 0 4px 10px -5px',
      }
    },
  },
  plugins: [],
}

export default config
