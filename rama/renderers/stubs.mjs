import { defineRenderer } from "./contract.mjs";

function createStub(id) {
  return defineRenderer({
    id,
    status: "stub",
    mount() {},
    render() {},
    consume() {},
    destroy() {}
  });
}

export const era1989RendererStub = createStub("era-1989");
export const era1994RendererStub = createStub("era-1994");

export const GRAPHICAL_RENDERER_STUBS = Object.freeze([
  era1989RendererStub,
  era1994RendererStub
]);
