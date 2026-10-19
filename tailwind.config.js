/**
 * Thème : celui de kode-rca.vercel.app (bruns, beiges), avec le rouge du logo LIAM
 * à la place de l'orange comme couleur d'accent.
 */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "DM Serif Display", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Roboto Mono", "ui-monospace", "monospace"],
      },
      colors: {
        accent: { DEFAULT: "#E3000F", vif: "#FF2A2F", sombre: "#A8000B", pale: "#FBE7E4" },
        brun: "#5B2904",
        encre: "#2A1A10",
        "noir-doux": "#2A1201",
        creme: "#F6F4DD",
        "gris-clair": "#F3ECE0",
        bordure: "#E6D9C7",
        attenue: "#C9B49B",
        "attenue-clair": "#F6F4DDCC",
        whatsapp: "#25D366",
      },
      maxWidth: { site: "1280px" },
      transitionTimingFunction: { signature: "cubic-bezier(.62,.83,.34,.93)" },
    },
  },
  plugins: [],
};
