const fs = require("fs");

const filePath = "f:/myapp/Goldenloft/frontend/components/financial-pages.tsx";
let content = fs.readFileSync(filePath, "utf8");

// Replace all t("key") with t("key" as any)
content = content.replace(/t\("([^"]+)"\)/g, 't("$1" as any)');

fs.writeFileSync(filePath, content, "utf8");
console.log("Fixed all translation keys in financial-pages.tsx");
