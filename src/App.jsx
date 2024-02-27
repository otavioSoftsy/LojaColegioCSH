import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LojaProvider from "./contexts/LojaProvider";


export default function App() {
  return (
      <LojaProvider>
        <ToastContainer autoClose={3000} />
        <RouterProvider router={router} />
      </LojaProvider>
  );
}
