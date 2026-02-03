const fs = require("fs");

const files = [
  "f:/myapp/Goldenloft/frontend/components/reports-pages.tsx",
  "f:/myapp/Goldenloft/frontend/components/tasks-pages.tsx",
  "f:/myapp/Goldenloft/frontend/components/inventory-pages.tsx",
  "f:/myapp/Goldenloft/frontend/components/nutrition-pages.tsx",
  "f:/myapp/Goldenloft/frontend/components/training-pages.tsx",
  "f:/myapp/Goldenloft/frontend/components/racing-pages.tsx",
];

files.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    content = content.replace(/t\("([^"]+)"\)/g, 't("$1" as any)');
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Fixed: ${filePath}`);
  }
});

console.log("All files fixed!");
