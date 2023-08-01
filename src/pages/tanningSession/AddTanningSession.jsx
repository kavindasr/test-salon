import { Divider, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosPrivate from "../../api/BaseURL";
import Input from "../../component/common/Input";
import Titlebar from "../../component/common/Titlebar";
import { getErrorMessage } from "../../utils/Functions";

const AddTanningSession = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [customerData, setCustomerData] = useState({
    appointment: "",
    company: "",
    therapy_plan: "",
    therapy_type: "",
    patient: "",
    tanning_machine: "",
    patient_name: "",
    gender: "",
    duration: "",
    start_date: "",
    rate: "",
    start_time: "",
    total_counts_targeted: "",
    total_counts_completed: "",
  });
  const [sessionData, setSessionData] = useState([]);

  const customerForm = [
    {
      id: "appointment",
      label: "Appointment",
      type: "select",
      endpoint: "Patient Appointment?limit_page_length=0",
    },
    {
      id: "company",
      label: "Company",
      type: "text",
      required: true,
    },
    {
      id: "therapy_plan",
      label: "Tanning Plan",
      type: "select",
      endpoint: "Therapy Plan?limit_page_length=0",
      required: true,
    },
    {
      id: "therapy_type",
      label: "Session",
      type: "select",
      data: sessionData,
      required: true,
    },
    {
      id: "patient",
      label: "Salon Customer",
      type: "select",
      endpoint: "Patient?limit_page_length=0&limit_start=0",
      required: true,
    },
    {
      id: "tanning_machine",
      label: "Tanning machine",
      type: "select",
      endpoint: "Healthcare Practitioner?limit_page_length=0",
    },
    // {
    //   id: "patient_name",
    //   label: "Customer Name",
    //   type: "text",
    // },
    // {
    //   id: "gender",
    //   label: "Gender",
    //   type: "text",
    // },
  ];

  const detailsForm = [
    {
      id: "duration",
      label: "Session Duration",
      type: "text",
      required: true,
    },
    {
      id: "start_date",
      type: "date",
      required: true,
    },
    {
      id: "rate",
      label: "Rate",
      type: "text",
    },
    {
      id: "start_time",
      type: "time",
    },
  ];
  const totalCountForm = [
    {
      id: "total_counts_targeted",
      label: "Total Count Targeted",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      id: "total_counts_completed",
      label: "Total Count Completed",
      type: "text",
      required: true,
      disabled: true,
    },
  ];

  const getTheraPlanDetails = async (val) => {
    const therapyPlanes = await axiosPrivate
      .get(`api/resource/Therapy Plan/${val}`)
      .then((res) => {
        setCustomerData((prev) => ({
          ...prev,
          patient_name: res.data.data?.customer_name,
          gender: res.data.data?.gender,
        }));
        return res;
      })
      .then((getTherapy) => getTherapySessionData(getTherapy));
    return therapyPlanes;
  };

  const getTherapySessionData = async (getTherapy) => {
    await axiosPrivate
      .get(
        `api/resource/Therapy Plan Template/${getTherapy.data.data?.therapy_plan_template}`
      )
      .then((therapyRes) => {
        const sessionList = therapyRes.data.data?.therapy_types.map((item) => {
          return item.therapy_type;
        });
        setSessionData(sessionList);
      });
  };
  const formatTime = (timeString) => {
    const timeComponents = timeString.split(":");
    const hour = parseInt(timeComponents[0]);
    const minute = parseInt(timeComponents[1]);

    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;

    return `${formattedHour}:${formattedMinute}`;
  };

  useEffect(() => {
    if (mode === "edit") {
      axiosPrivate
        .get(`api/resource/Therapy Session/${location.state}`)
        .then((res) => {
          getTheraPlanDetails(res.data.data?.therapy_plan);
          setCustomerData((prev) => ({
            ...prev,
            ...res?.data?.data,
            appointment: res.data?.data?.appointment,
            patient: res.data?.data?.patient,
            patient_name: res.data?.data?.patient_name,
            gender: res.data?.data?.gender,
            tanning_machine: res.data?.data?.practitioner,
            start_time: formatTime(res.data.data?.start_time),
          }));
          return res;
        });
      // .then((final_res) => {
      //   axiosPrivate
      //     .get(`api/resource/Patient/${final_res.data?.data?.patient}`)
      //     .then((res) => {

      //       setCustomerData((prev) => ({
      //         ...prev,
      //         patient: res.data.data?.name,
      //         patient_name: res.data.data?.patient_name,
      //         gender: res.data.data?.sex,
      //       }));
      //       return res;
      //     });
      // });
    }
  }, [location, mode]);

  // const customer_type = ["Individual", "Company"];

  // const customer_group = [
  //   "All Customer Group",
  //   "Commercial",
  //   "Government",
  //   "Individual",
  //   "Non Profit",
  // ];
  // const territory = ["All Territories", "Kuwait"];

  const handleSubmitData = () => {
    {
      mode === "edit"
        ? axiosPrivate
            .put(`api/resource/Therapy Session/${location.state}`, "", {
              params: {
                ...customerData,
              },
            })
            .then(() => {
              toast.success("Data Saved Successfully");
            })
            .catch((err) => {
              const errMessage = getErrorMessage(err.response.data.exception);
              toast.error(errMessage);
            })
        : axiosPrivate
            .post("api/resource/Therapy Session", "", {
              params: {
                ...customerData,
              },
            })
            .then(() => {
              toast.success("Data Saved Successfully");
            })
            .catch((err) => {
              const errMessage = getErrorMessage(err.response.data.exception);
              toast.error(errMessage);
            });
    }
  };

  const handleInputChange = async (val, field) => {
    if (field.id === "appointment") {
      await axiosPrivate
        .get(`api/resource/Patient Appointment/${val}`)
        .then((res) => {
          setCustomerData((prev) => ({
            ...prev,
            appointment: res.data.data?.name,
            patient: res.data.data?.patient,
            patient_name: res.data.data?.patient_name,
            gender: res.data.data?.patient_sex,
            company: res.data.data?.company,
            tanning_machine: res.data.data?.practitioner,
            duration: res.data.data?.duration,
            therapy_plan: res.data.data?.therapy_plan,
            start_date: res.data.data?.appointment_date,
            start_time: formatTime(res.data.data?.appointment_time),
          }));
          return res;
        })
        .then(async (res) => {
          await axiosPrivate
            .get(`api/resource/Therapy Plan/${res.data.data?.therapy_plan}`)
            .then((sessionRes) => {
              setCustomerData((prev) => ({
                ...prev,
                total_counts_targeted: sessionRes.data.data?.total_sessions,
                total_counts_completed:
                  sessionRes.data.data?.total_sessions_completed,
              }));
              return sessionRes;
            })
            .then(async (getTherapy) => {
              //therapy_plan_template
              getTherapySessionData(getTherapy);
            });
        });
    } else if (field.id === "therapy_type") {
      await axiosPrivate.get(`api/resource/Therapy Type/${val}`).then((res) => {
        setCustomerData((prev) => ({
          ...prev,
          therapy_type: res.data.data?.name,
          duration: res.data.data?.default_duration,
          rate: res.data.data?.rate,
        }));
        return res;
      });
    } else if (field.id === "therapy_plan") {
      await axiosPrivate
        .get(`api/resource/Therapy Plan/${val}`)
        .then((res) => {
          setCustomerData((prev) => ({
            ...prev,
            therapy_plan: res.data.data?.name,
            patient_name: res.data.data?.customer_name,
            gender: res.data.data?.gender,
          }));
          return res;
        })
        .then((getTherapy) => getTherapySessionData(getTherapy));
    } else if (field.id === "patient") {
      await axiosPrivate.get(`api/resource/Patient/${val}`).then((res) => {
        setCustomerData((prev) => ({
          ...prev,
          patient: res.data.data?.name,
          patient_name: res.data.data?.patient_name,
          gender: res.data.data?.sex,
        }));
        return res;
      });
    } else {
      setCustomerData((prev) => ({ ...prev, [field.id]: val }));
    }
  };

  return (
    <div className="m-2">
      <Titlebar
        text="Tanning Session"
        buttonText={mode === "edit" ? "Update" : "Save"}
        handleClick={handleSubmitData}
        showActionButton
        showGoBack
        showRefresh
      />
      <div>
        <div className="grid gap-6 lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 card">
          {customerForm.map((field, index) => (
            <React.Fragment key={index}>
              <Input
                label={field.label}
                className="w-full rounded-2xl"
                disabled={field.disabled}
                type={field.type}
                required={field.required}
                value={customerData[field.id]}
                setValue={(val) => handleInputChange(val, field)}
                data={field.data}
                endpoint={field.endpoint}
              />
            </React.Fragment>
          ))}
          <TextField
            label={"Customer name"}
            value={customerData.patient_name}
          />
          <TextField label={"gender"} value={customerData.gender} />
        </div>
        <Divider className="!my-8 !border-white" />
      </div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl text-white ">Details</h3>
      </div>
      <div>
        <div className="grid gap-6 lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 card">
          {detailsForm.map((field, index) => (
            <React.Fragment key={index}>
              <Input
                label={
                  field.id === "fullName" &&
                  (customerData["first_name"].length > 0 ||
                    customerData["last_name"].length > 0)
                    ? null
                    : field.label
                }
                className="w-full rounded-2xl"
                disabled={field.disabled}
                type={field.type}
                required={field.required}
                value={customerData[field.id]}
                setValue={(val) =>
                  setCustomerData((prev) => ({ ...prev, [field.id]: val }))
                }
                data={field.data}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
      <Divider className="!my-8 !border-white" />

      <div>
        <div className="grid gap-6 lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 card">
          {totalCountForm.map((field, index) => (
            <React.Fragment key={index}>
              <Input
                label={
                  field.id === "fullName" &&
                  (customerData["first_name"].length > 0 ||
                    customerData["last_name"].length > 0)
                    ? null
                    : field.label
                }
                className="w-full rounded-2xl"
                disabled={field.disabled}
                type={field.type}
                required={field.required}
                value={customerData[field.id]}
                setValue={(val) =>
                  setCustomerData((prev) => ({ ...prev, [field.id]: val }))
                }
                data={field.data}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddTanningSession;
