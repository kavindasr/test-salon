import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const AuthLayout = (props) => {
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const { loadUser } = authContext;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      loadUser();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <h1>Loading....</h1>
      ) : (
        <div className="flex">
          <main className="w-full bg-primary max-h-[100vh] overflow-scroll">
            {props?.children}
          </main>
          {/* <Footer /> */}
        </div>
      )}
    </>
  );
};

export default AuthLayout;
