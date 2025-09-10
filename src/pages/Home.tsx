import "../App.css";
import hackathonGraphic from "../assets/hackathon-graphic.svg";
import naverLogo from "../assets/naver-logo.svg";
// import AppRoutes from "./routes";
function App() {
  return (
    <div className="container">
      <div className="content">
        <img
          src={naverLogo}
          alt="NAVER Vietnam AI Hackathon"
          className="logo"
        />

        <div className="greeting">
          <p className="hello">Xin chào! 안녕하세요!</p>
          <p className="subtitle">Hello World</p>
        </div>
      </div>

      <img className="graphic" src={hackathonGraphic} alt="" />
      {/* <div className="flex-1 flex flex-col items-center justify-start p-6">
        <AppRoutes />
      </div> */}
    </div>
  );
}

export default App;
