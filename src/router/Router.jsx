import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import required components
import Master from "../layout/Master";
import Protected from "../layout/PrivateRoute";
import AuthState from "../context/AuthState";

// Lazy load pages
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const Login = lazy(() => import("../pages/LoginPage"));
const CustomerList = lazy(() => import("../pages/customer/CustomerList"));
const CreateCustomer = lazy(() => import("../pages/customer/CreateCustomer"));
const AddTanningAppointment = lazy(() =>
  import("../pages/tanningAppoinment/AddTanningAppointment")
);
const TanningAppointmentList = lazy(() =>
  import("../pages/tanningAppoinment/TanningAppointmentList")
);
const TanningTypeList = lazy(() =>
  import("../pages/tanningType/TanningTypeList")
);
const AddTanningType = lazy(() =>
  import("../pages/tanningType/AddTanningType")
);
const AddTanningPlanTemplate = lazy(() =>
  import("../pages/tanningPlanTemplate/AddTanningPlanTemplate")
);
const TanningPlanTemplateList = lazy(() =>
  import("../pages/tanningPlanTemplate/TanningPlanTemplateList")
);
const AddTanningPlan = lazy(() =>
  import("../pages/tanningPlan/AddTanningPlan")
);
const TanningPlanList = lazy(() =>
  import("../pages/tanningPlan/TanningPlanList")
);
const TanningSessionList = lazy(() =>
  import("../pages/tanningSession/TanningSessionList")
);
const AddTanningSession = lazy(() =>
  import("../pages/tanningSession/AddTanningSession")
);

const SalesInvoiceList = lazy(() =>
  import("../pages/sales-invoice/SalesInvoiceList")
);
const CreateSalesInvoice = lazy(() =>
  import("../pages/sales-invoice/CreateSalesInvoice")
);

const Router = () => {
  return (
    <AuthState>
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Master />}>
              <Route
                index
                path="/"
                element={
                  <Protected>
                    <DashboardPage />
                  </Protected>
                }
              />
              <Route
                path="/customer"
                element={
                  <Protected>
                    <CustomerList />
                  </Protected>
                }
              />
              {/* <Route path="/customer" element={<CustomerList />} /> */}
              <Route
                index
                path="/customer/create"
                element={
                  <Protected>
                    <CreateCustomer />
                  </Protected>
                }
              />
              <Route
                path="/sales-invoice"
                element={
                  <Protected>
                    <SalesInvoiceList />
                  </Protected>
                }
              />
              <Route
                index
                path="/sales-invoice/create"
                element={
                  <Protected>
                    <CreateSalesInvoice />
                  </Protected>
                }
              />
              <Route
                index
                path="/sales-invoice/edit"
                element={
                  <Protected>
                    <CreateSalesInvoice mode="edit" />
                  </Protected>
                }
              />
              <Route
                index
                path="/customer/edit"
                element={
                  <Protected>
                    <CreateCustomer mode="edit" />
                  </Protected>
                }
              />
              {/* <Route path="/tanning-appointment" element={<Protected><TanningAppointment /></Protected>} /> */}
              <Route
                path="/tanning-appointment"
                element={
                  <Protected>
                    <TanningAppointmentList />
                  </Protected>
                }
              />
              <Route
                path="/tanning-appointment/add"
                element={
                  <Protected>
                    <AddTanningAppointment />
                  </Protected>
                }
              />
              <Route
                path="/tanning-appointment/edit"
                element={
                  <Protected>
                    <AddTanningAppointment mode="edit" />
                  </Protected>
                }
              />
              <Route
                path="/tanning-type"
                element={
                  <Protected>
                    <TanningTypeList />
                  </Protected>
                }
              />
              <Route
                path="/tanning-type/add"
                element={
                  <Protected>
                    <AddTanningType />
                  </Protected>
                }
              />
              <Route
                path="/tanning-plan"
                element={
                  <Protected>
                    <TanningPlanList />
                  </Protected>
                }
              />
              <Route
                path="/tanning-plan/add"
                element={
                  <Protected>
                    <AddTanningPlan />
                  </Protected>
                }
              />
              <Route
                path="/tanning-plan/edit"
                element={
                  <Protected>
                    <AddTanningPlan mode="edit" />
                  </Protected>
                }
              />
              <Route
                path="/tanning-plan-template"
                element={
                  <Protected>
                    <TanningPlanTemplateList />
                  </Protected>
                }
              />
              <Route
                path="/tanning-plan-template/add"
                element={
                  <Protected>
                    <AddTanningPlanTemplate />
                  </Protected>
                }
              />
              <Route
                path="/tanning-session"
                element={
                  <Protected>
                    <TanningSessionList />
                  </Protected>
                }
              />
              <Route
                path="/tanning-session/add"
                element={
                  <Protected>
                    <AddTanningSession />
                  </Protected>
                }
              />
              <Route
                path="/tanning-session/edit"
                element={
                  <Protected>
                    <AddTanningSession mode="edit" />
                  </Protected>
                }
              />
            </Route>

            <Route
              path="*"
              element={
                <Protected>
                  <PageNotFound />
                </Protected>
              }
            />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </AuthState>
  );
};

export default Router;
