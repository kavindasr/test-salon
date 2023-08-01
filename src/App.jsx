import { ThemeProvider } from "@emotion/react";
import "./App.css";
import { createTheme } from "@mui/material";
import Router from "./router/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ThemeProvider
        theme={createTheme({
          mode: "light",
        })}
      >
        <div className="max-w-[100vw] h-[100vh]">
          <ToastContainer />
          <Router />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
