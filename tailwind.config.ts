import type { Config } from "tailwindcss";
import tailwindAspectRatio from "@tailwindcss/aspect-ratio";
import tailwindTypography from "@tailwindcss/typography";

export default <Partial<Config>>{
  darkMode: "class",
  content: [],
  theme: {
    extend: {},
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [tailwindAspectRatio, tailwindTypography],
};
