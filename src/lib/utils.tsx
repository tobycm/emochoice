/* eslint-disable react-refresh/only-export-components */
import { Box, Loader } from "@mantine/core";
import { Color, DropdownMenuItem, Product, ProductCategory } from "./database/models";

export function toTitleCase(str: string = "") {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

export function setDocumentTitle(title: string = "") {
  document.title = title !== "" ? `${title} - Emochoice` : "Emochoice";
}

export function HTMLtoText(html: string) {
  const element = document.createElement("DIV");
  element.innerHTML = html;
  return element.textContent || element.innerText || "";
}

export const monthsKey = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
} as const;

export function pasteImage(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  coords: { xOffset: number; maxWidth: number; maxHeight?: number; yOffset?: number },
  backgroundImageHeight: number,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (!coords.maxHeight) coords.maxHeight = 0;
  if (!coords.yOffset) coords.yOffset = 0;

  ctx.drawImage(
    img,
    coords.xOffset,
    img.height <= coords.maxHeight ? backgroundImageHeight / 2 - ((img.height / img.width) * coords.maxWidth) / 2 : coords.yOffset,
    coords.maxWidth,
    img.height <= coords.maxHeight ? (img.height / img.width) * coords.maxWidth : coords.maxHeight,
  );
}

export default function LoaderBox() {
  return (
    <Box h="50vh" w="100%" display={"flex"} style={{ alignItems: "center", justifyContent: "center" }}>
      <Loader size="lg" />
    </Box>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replaceAll("#", ""));
  if (!result) return null;
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}

export function darkOrLight(hex: string): "light" | "dark" {
  const rgb = hexToRgb(hex);
  if (!rgb) return "dark";

  return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 0.5 ? "light" : "dark"; // copilot
}

export function filterProducts(products: Product[], categoriesId: string[], offsetLast: number = 0): Product[] {
  const iterations = [[...products]];

  for (const categoryId of categoriesId) {
    if (iterations[iterations.length - 1].length === 0) break;
    iterations.push(iterations[iterations.length - 1].filter((product) => product.category.some((cId) => cId === categoryId)));
  }

  return iterations[iterations.length - 1 - offsetLast] ?? [];
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", (event) => {
      if (event.target && event.target.result) return resolve(event.target.result.toString().split(",")[1]);
      reject(new Error("Failed to read the file."));
    });

    reader.addEventListener("error", reject);

    reader.readAsDataURL(file);
  });
}

export function linearBackgroundProperties(color: Color) {
  const colors = color.hex.split(",").map((hex) => hex.trim());

  return `linear-gradient(to bottom, ${colors
    .reduce(
      (last, color, index) =>
        `${last}${color} ${Math.ceil((100 / colors.length) * index)}%, ${color} ${Math.ceil((100 / colors.length) * (index + 1))}%, `,
      "",
    )
    .slice(0, -2)})`;
}

export function linearTextColorProperties(color: Color) {
  const colors = color.hex.split(",").map((hex) => hex.trim());

  return `linear-gradient(to bottom, ${colors
    .reduce(
      (last, color, index) =>
        `${last}${darkOrLight(color) == "dark" ? "#ffffff" : "#000000"} ${Math.ceil((100 / colors.length) * index)}%, ${
          darkOrLight(color) == "dark" ? "#ffffff" : "#000000"
        } ${Math.ceil((100 / colors.length) * (index + 1))}%, `,
      "",
    )
    .slice(0, -2)})`;
}

export function formatPhoneNumber(phoneNumber: string): string {
  phoneNumber = phoneNumber.replace("+1", "").trim();
  if (phoneNumber.length === 10 && !phoneNumber.includes("("))
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  if (phoneNumber.length === 12 && phoneNumber.match(/^\d{3} \d{3}-\d{4}$/))
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(8, 12)}`;
  if (phoneNumber.length === 12 && phoneNumber.match(/^\d{3}-\d{3}-\d{4}$/))
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  if (phoneNumber.length === 3) return `(${phoneNumber}) `;
  if (phoneNumber.length === 9) return `(${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(6, 9)}-`;
  if (phoneNumber.length === 14) return `(${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(6, 9)}-${phoneNumber.slice(10, 14)}`;
  return phoneNumber;
}

// https://i.imgur.com/fEXYCgz.jpg
// wtf

export class Tree extends Map<ProductCategory, Tree> {}

export function makeDropdownTree(currentItem: DropdownMenuItem, root: DropdownMenuItem[]): [Tree, string[]] {
  const tree = new Tree();

  const existingItems: string[] = [];

  for (const item of currentItem.expand?.children ?? []) {
    tree.set(item, new Tree());

    const dad = root.find((menuItem) => menuItem.expand?.parent?.id === item.id);

    if (dad?.expand?.children) {
      const [childTree, eItems] = makeDropdownTree(dad, root);

      tree.set(item, childTree);

      existingItems.push(...eItems);
    }

    existingItems.push(item.name);
  }

  return [tree, existingItems];
}

export function isNotEmpty(obj: unknown) {
  return obj !== null && typeof obj === "object" && Object.keys(obj).length > 0;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
