module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderColor: {
        border: '#e5e7eb', // Classe border-border
      },
      outlineColor: {
        ring: '#93c5fd', // Classe outline-ring
      },
      backgroundColor: {
        background: '#f9fafb', // Classe bg-background
      },
      textColor: {
        primary: '#1f2937', // Classe text-primary
        secondary: '#4b5563', // Classe text-secondary
        foreground: '#374151', // Classe text-foreground
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.1)', // Classe shadow-card
      },
      ringColor: {
        focus: '#2563eb', // Classe ring-focus
      },
    },
  },
  plugins: [],
};