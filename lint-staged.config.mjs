/**
 * Checks the complete TypeScript project without appending staged file paths.
 * Takes no inputs and does not change or stage files.
 * @returns The command that generates Next.js route types and checks TypeScript.
 */
function checkProjectTypes() {
  return "npm run typecheck";
}

const config = {
  "*.{ts,tsx,js,jsx,mjs,cjs}": "eslint --max-warnings 0 --no-warn-ignored",
  "*.{ts,tsx,js,jsx,mjs,cjs,css,json,md}": "prettier --check",
  "*": checkProjectTypes,
};

export default config;
