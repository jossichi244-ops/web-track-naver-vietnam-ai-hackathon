import AppRoutes from "./routes";
// import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <div className="flex-1 flex flex-col items-center justify-start p-6">
        <AppRoutes />
      </div>
    </div>
  );
}
