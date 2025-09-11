export async function loadWasm() {
  const response = await fetch("/mymodule.wasm");
  const bytes = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes);
  return instance;
}
