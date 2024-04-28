import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import drizzlePlugin from "eslint-plugin-drizzle";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "@next/next": nextPlugin,
      drizzle: drizzlePlugin,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@next/next/no-img-element": "error",
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: "db" },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: "db" },
      ],
    },
  },
  { ignores: [".next/*"] }
);
