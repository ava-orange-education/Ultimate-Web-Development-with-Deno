// main.ts
/**
 * WebAssembly Example in Deno
 * 
 * This script demonstrates how to load and instantiate a WebAssembly module in Deno.
 * Note: You would typically generate the .wasm file from Rust or Go.
 */

async function loadWasm(filePath: string) {
  try {
    const wasmBytes = await Deno.readFile(filePath);
    const wasmModule = new WebAssembly.Module(wasmBytes);
    const wasmInstance = new WebAssembly.Instance(wasmModule);
    return wasmInstance.exports;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`File ${filePath} not found. Please compile your Wasm first.`);
    } else {
      console.error("Error loading Wasm:", error);
    }
    return null;
  }
}

// Example usage simulation
if (import.meta.main) {
  console.log("Attempting to load math.wasm...");
  const exports = await loadWasm("./math.wasm");
  
  if (exports) {
    // Assuming the wasm has an 'add' function
    // const result = (exports as any).add(5, 7);
    // console.log("5 + 7 =", result);
    console.log("Wasm loaded successfully (simulated)");
  }
}
