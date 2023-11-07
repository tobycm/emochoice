export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

export function setDocumentTitle(title: string = "") {
  document.title = title !== "" ? `${title} - Emochoice` : "Emochoice";
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
