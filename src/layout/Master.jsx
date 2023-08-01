import SidebarComponent from "../component/common/Sidebar";
import { Outlet } from "react-router-dom";

const Master = () => {
  return (
    <div className="flex">
      <aside className="max-h-[100vh]">
        <SidebarComponent />
      </aside>
      <main className="w-full px-3 bg-primary max-h-[100vh] overflow-scroll">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Master;
