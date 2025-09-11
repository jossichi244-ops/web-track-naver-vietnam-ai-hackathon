import { useEffect, useState } from "react";
import AppRoutes from "./routes";
import { loadWasm } from "./wasmLoader";

export default function App() {
  const [wasmReady, setWasmReady] = useState(false);

  useEffect(() => {
    loadWasm().then((instance) => {
      console.log("WASM loaded:", instance);
      setWasmReady(true);
    });
  }, []);

  if (!wasmReady) {
    return <div>Loading WebAssembly...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-start p-6">
        <AppRoutes />
      </div>
    </div>
  );
}
