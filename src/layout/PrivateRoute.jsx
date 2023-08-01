import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Protected({ children }) {
  const authContext = useContext(AuthContext);
  const { isAuth } = authContext;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
export default Protected;
