import { RENDERER_IDS } from "./contract.mjs";

const descriptors = [
  {
    id: "text",
    label: "Text Edition",
    status: "active",
    entry: "rama/editions/text/ui/adapter.js",
    seam: "wired"
  },
  {
    id: "illustrated",
    label: "Illustrated Edition",
    status: "opening-arc-production",
    entry: "rama/editions/illustrated/ui/renderer.js",
    seam: "wired-launcher-production"
  },
  {
    id: "era-1989",
    label: "1989 Edition",
    status: "early-access",
    entry: "rama/editions/era-1989/ui/renderer.js",
    seam: "wired-static-graphical"
  },
  {
    id: "era-1994",
    label: "1994 Edition",
    status: "early-access",
    entry: "rama/editions/era-1994/ui/renderer.js",
    seam: "wired-static-graphical"
  }
];

export const RENDERER_CATALOG = Object.freeze(descriptors.map(descriptor => Object.freeze({ ...descriptor })));

if (RENDERER_CATALOG.map(renderer => renderer.id).join("|") !== RENDERER_IDS.join("|")) {
  throw new Error("Renderer catalog must contain the four canonical renderer ids in order");
}

export function rendererDescriptor(id) {
  return RENDERER_CATALOG.find(renderer => renderer.id === id) || null;
}
