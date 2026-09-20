import "./contract-core.js";

const contract = globalThis.RamaRendererContract;

export const RENDERER_IDS = contract.RENDERER_IDS;
export const OUTPUT_KINDS = contract.OUTPUT_KINDS;
export const ACTION_TYPES = contract.ACTION_TYPES;
export const UI_MODES = contract.UI_MODES;
export const assertSemanticAction = contract.assertSemanticAction;
export const assertRendererFrame = contract.assertRendererFrame;
export const assertOutputRecords = contract.assertOutputRecords;
export const defineRenderer = contract.defineRenderer;
export const createRendererHost = contract.createRendererHost;
