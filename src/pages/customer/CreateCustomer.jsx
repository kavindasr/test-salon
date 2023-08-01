import React, { useEffect, useState } from "react";
import Input from "../../component/common/Input";
import axiosPrivate from "../../api/BaseURL";
import { useLocation, useNavigate } from "react-router-dom";
import Titlebar from "../../component/common/Titlebar";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { getErrorMessage } from "../../utils/Functions";

const Customer = ({ mode }) => {
  const params = useLocation();
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState({
    customer_primary_address: "",
    phone: "",
    email_id: "",
    mobile: "",
    salutation: "",
    sex: "",
    first_name: "",
    last_name: "",
    blood_group: "",
    patient_name: "",
    customer_type: "Individual",
    customer_group: "All Customer Groups",
    territory: "All Territories",
    dob: "",
    uid: "",
    customer_age: "",
  });

  const [showDelete, setshowDelete] = useState(false);
  const [deleteDataName, setDeleteDataName] = useState("");

  const customer_type = ["Individual", "Company"];

  const bloodGroups = [
    "O Positive",
    "O Negative",
    "A Positive",
    "A Negative",
    "B Positive",
    "B Negative",
    "AB Positive",
    "AB Negative",
  ];

  const customerForm = [
    {
      id: "salutation",
      label: "Salutation",
      type: "select",
      endpoint: "Salutation",
    },
    {
      id: "patient_name",
      label: "Customer Name",
      type: "text",
      required: true,
    },
    {
      id: "first_name",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      id: "last_name",
      label: "Last Name",
      type: "text",
      required: true,
    },
    {
      id: "email_id",
      label: "Email",
      type: "email",
    },
    {
      id: "phone",
      label: "Primary Number",
      type: "text",
    },
    {
      id: "mobile",
      label: "Mobile",
      type: "text",
    },
    {
      id: "sex",
      label: "Gender",
      type: "select",
      endpoint: "Gender",
    },
    {
      id: "blood_group",
      type: "select",
      data: bloodGroups,
      label: "Select blood group",
    },
    {
      id: "customer_type",
      type: "select",
      data: customer_type,
      label: "Select customer type",
      required: true,
      disabled: true,
    },
    {
      id: "customer_group",
      type: "select",
      label: "Select customer group",
      required: true,
      endpoint: "Customer Group",
      disabled: true,
    },
    {
      id: "territory",
      type: "select",
      label: "Select territory",
      required: true,
      endpoint: "Territory",
      disabled: true,
    },
    {
      id: "dob",
      label: "Date of Birth",
      type: "date",
    },
    {
      id: "uid",
      label: "Civil ID",
      type: "text",
    },
    {
      id: "customer_age",
      label: "Customer Age",
      type: "text",
      disabled: true,
    },
  ];

  // const addressForm = [
  //   {
  //     id: "customer_primary_address",
  //     label: "Address",
  //     type: "textarea",
  //   },
  // ];

  function calculateAge(birthDate) {
    const birthDateObj = new Date(birthDate);
    const currentDate = new Date();

    let ageYears = currentDate.getFullYear() - birthDateObj.getFullYear();
    let ageMonths = currentDate.getMonth() - birthDateObj.getMonth();
    let ageDays = currentDate.getDate() - birthDateObj.getDate();

    if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
      ageYears--;
      ageMonths += 12;
    }

    if (ageDays < 0) {
      const lastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        0
      );
      ageDays += lastMonth.getDate();
      ageMonths--;
    }
    const dateInString = `${ageYears} Years, ${ageMonths} Month and ${ageDays} Day`;

    return dateInString;
  }

  useEffect(() => {
    if (mode === "edit") {
      axiosPrivate.get(`api/resource/Patient/${params.state}`).then((res) => {
        setCustomerData((prev) => ({
          ...prev,
          ...res?.data?.data,
          customer_age: calculateAge(res?.data?.data?.dob),
        }));
      });
    }
  }, [params, mode]);

  const handleResetForm = () => {
    setCustomerData({
      customer_primary_address: "",
      phone: "",
      email_id: "",
      mobile: "",
      salutation: "",
      sex: "",
      first_name: "",
      last_name: "",
      blood_group: "",
      patient_name: "",
      customer_type: "Individual",
      customer_group: "All Customer Groups",
      territory: "All Territories",
      dob: "",
      uid: "",
      customer_age: "",
    });
  };

  const handleSubmitData = async () => {
    axiosPrivate
      .post("api/resource/Patient", "", {
        params: {
          ...customerData,
        },
      })
      .then(() => {
        toast.success("Data Saved Successfully");
        handleResetForm();
      })
      .catch((err) => {
        const errMessage = getErrorMessage(err.response.data.exception);
        toast.error(errMessage);
      });
  };

  const handleUpdateData = () => {
    axiosPrivate
      .put(`api/resource/Patient/${params.state}`, {
        ...customerData,
      })
      .then(() => {
        toast.success("Data Saved Successfully");
        handleResetForm();
      })
      .catch((err) => {
        const errMessage = getErrorMessage(err.response.data.exception);
        toast.error(errMessage);
      });
  };

  const handleDeleteModal = (name) => {
    setshowDelete(true);
    setDeleteDataName(name);
  };

  const handleDeleteData = () => {
    axiosPrivate
      .delete(`api/resource/Patient/${deleteDataName}`)
      .then(() => {
        toast.warning("Data Deleted!");
        setshowDelete(false);
        setDeleteDataName("");
      })
      .catch((err) => {
        const errMessage = getErrorMessage(err.response.data.exception);
        toast.error(errMessage);
        setshowDelete(false);
        setDeleteDataName("");
      });
  };

  const handleInputChnage = (val, field) => {
    if (field.id === "dob") {
      setCustomerData((prev) => ({
        ...prev,
        customer_age: calculateAge(val),
        [field.id]: val,
      }));
    } else {
      setCustomerData((prev) => ({ ...prev, [field.id]: val }));
    }
  };

  return (
    <div>
      <Titlebar
        text="Salon Customer"
        handleClick={mode === "edit" ? handleUpdateData : handleSubmitData}
        buttonText={mode === "edit" ? "Update" : "Save"}
        secondaryButton={
          mode === "edit" && (
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteModal(params.state)}
              >
                Delete
              </Button>
            </>
          )
        }
        showActionButton
        showGoBack
        showRefresh
      />
      <div className="my-4">
        <div className="grid gap-6 card lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2">
          {customerForm.map((field, index) => (
            <React.Fragment key={index}>
              <Input
                label={
                  field.id === "patient_name" &&
                  (customerData["first_name"].length > 0 ||
                    customerData["last_name"].length > 0)
                    ? null
                    : field.label
                }
                // className="w-full rounded-2xl"
                disabled={field.disabled}
                type={field.type}
                required={field.required}
                value={
                  field.id === "patient_name"
                    ? customerData["first_name"] +
                      " " +
                      customerData["last_name"]
                    : customerData[field.id]
                }
                setValue={(val) => handleInputChnage(val, field)}
                data={field.data}
                endpoint={field.endpoint}
                customClass="MuiInputBase-input:!border-primary"
              />
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* <hr className="my-8" />
      <div>
        <h3 className="mb-6 text-xl text-white">More Information</h3>
        <div className="my-4">
          <div className="grid gap-6 card ">
            {addressForm.map((field, index) => (
              <React.Fragment key={index}>
                <Input
                  label={field.label}
                  // className="w-full rounded-2xl"
                  disabled={field.disabled}
                  type={field.type}
                  required={field.required}
                  value={customerData[field.id]}
                  setValue={(val) =>
                    setCustomerData((prev) => ({ ...prev, [field.id]: val }))
                  }
                  data={field.data}
                  customClass="MuiInputBase-input:!border-primary"
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div> */}

      <Dialog open={showDelete}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this data?
        </DialogContent>
        <DialogActions>
          <Button>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteData()}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Customer;
