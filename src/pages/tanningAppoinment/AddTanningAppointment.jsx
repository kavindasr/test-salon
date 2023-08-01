import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Input from "../../component/common/Input";
import CloseIcon from "@mui/icons-material/Close";
import Titlebar from "../../component/common/Titlebar";
import axiosPrivate from "../../api/BaseURL";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { getErrorMessage } from "../../utils/Functions";

const TanningAppointment = ({ mode }) => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    series: "HLC-APP-.YYYY.-",
    company: "Megasun Saloon",
    patient: "",
    machineType: "",
    customerName: "",
    machineName: "",
    gender: "",
    department: "",
    patient_age: "",
  });

  const [availableSlotsFormData, setAvailableSlotsFormData] = useState({
    practitioner: "",
    appointment_date: "",
    salon_type: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState({});

  const [appointmentDetails, setAppointmentDetails] = useState({
    appointment_date: "",
    appointment_time: "",
    service_unit: "",
  });

  const appointmentForm = [
    {
      id: "series",
      label: "Series",
      type: "text",
      disabled: true,
    },
    {
      id: "company",
      label: "Company",
      required: true,
      type: "text",
      disabled: true,
    },
    {
      id: "patient",
      label: "Salon Customer",
      type: "select",
      endpoint: "Patient?limit_page_length=0",
    },
    {
      id: "machineType",
      label: "Machine Type",
      type: "select",
      required: true,
      endpoint: "Healthcare Practitioner?limit_page_length=0",
    },
    {
      id: "customerName",
      label: "Customer Name",
      type: "text",
      disabled: true,
    },
    {
      id: "machineName",
      label: "Machine Name",
      type: "text",
      disabled: true,
    },
    {
      id: "gender",
      label: "Gender",
      type: "text",
      disabled: true,
    },
    {
      id: "department",
      label: "Department",
      type: "select",
      endpoint: "Medical Department?limit_page_length=0",
      disabled: true,
    },
    {
      id: "patient_age",
      label: "Patient Age",
      type: "text",
      disabled: true,
    },
  ];

  const appointmentDetailsForm = [
    {
      id: "appointment_date",
      label: "Date",
      type: "date",
      disabled: true,
    },
    {
      id: "appointment_time",
      label: "Time",
      type: "text",
      disabled: true,
    },
  ];

  const availableSlotsForm = [
    // {
    //     id: "salon_type",
    //     label: "Salon type",
    //     type: "text",
    //     disabled: true,
    // },
    // {
    //     id: "practitioner",
    //     label: "Tanning Machine",
    //     type: "text",
    //     disabled: true,
    // },
    {
      id: "appointment_date",
      type: "date",
    },
  ];

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

  const getAvailableSlots = async () => {
    await axiosPrivate
      .post(
        `api/method/healthcare.healthcare.doctype.patient_appointment.patient_appointment.get_availability_data`,
        {
          ...availableSlotsFormData,
          date: availableSlotsFormData.appointment_date,
        }
      )
      .then((res) => {
        if (mode === "edit") {
          const service_unit = appointmentDetails.service_unit;
          const selSlot = res.data.message.slot_details
            .find((el) => el.service_unit === appointmentDetails.service_unit)
            .avail_slot.find(
              (el) => el.from_time === appointmentData.appointment_time
            );

          setSelectedSlot({
            service_unit: service_unit,
            ...selSlot,
          });
        }
        setAvailableSlots(res.data.message.slot_details);
        const setBookedArray = res.data.message.slot_details.map((item) => {
          return item.appointments;
        });
        setBookedSlots(setBookedArray);
      });
  };

  useEffect(() => {
    if (mode === "edit") {
      axiosPrivate
        .get(`api/resource/Patient Appointment/${location.state}`)
        .then((res) => {
          delete res.data?.data.duration;
          setAppointmentData((prev) => ({
            ...prev,
            ...res?.data?.data,
            machineType: res.data?.data.practitioner,
            machineName: res.data?.data.practitioner_name,
            customerName: res.data?.data.patient_name,
            gender: res.data?.data.patient_sex,
            department: res.data?.data.department,
          }));
          setAppointmentDetails({
            appointment_date: res.data?.data.appointment_date,
            appointment_time: res.data?.data.appointment_time,
            service_unit: res.data?.data.service_unit,
          });
          setAvailableSlotsFormData({
            practitioner: res.data?.data.practitioner,
            appointment_date: res.data?.data.appointment_date,
            salon_type: res.data?.data.department,
          });
          setSelectedSlot({});
        });
    }
  }, [location, mode]);

  const handleResetForm = () => {
    setAppointmentData({
      series: "HLC-APP-.YYYY.-",
      company: "Megasun Saloon",
      patient: "",
      machineType: "",
      customerName: "",
      machineName: "",
      gender: "",
      department: "",
      patient_age: "",
    });
    setAvailableSlotsFormData({
      practitioner: "",
      appointment_date: "",
      salon_type: "",
    });
    setAppointmentDetails({
      appointment_date: "",
      appointment_time: "",
      service_unit: "",
    });
  };

  const handleInputChange = async (val, field) => {
    if (field.id === "patient") {
      await axiosPrivate.get(`api/resource/Patient/${val}`).then((res) => {
        setAppointmentData((prev) => ({
          ...prev,
          patient: res.data.data?.name,
          customerName: res.data.data?.name,
          gender: res.data.data?.sex,
          patient_age: calculateAge(res.data.data?.dob),
        }));
      });
    } else if (field.id === "machineType") {
      await axiosPrivate
        .get(`api/resource/Healthcare Practitioner/${val}`)
        .then((res) => {
          setAppointmentData((prev) => ({
            ...prev,
            machineType: res.data.data?.name,
            machineName: res.data.data?.practitioner_name,
            department: res.data.data?.department,
          }));
          setAvailableSlotsFormData((prev) => ({
            ...prev,
            practitioner: res.data.data?.name,
            salon_type: res.data.data?.department,
          }));
        });
    } else {
      setAppointmentData((prev) => ({ ...prev, [field.id]: val }));
    }
  };

  const bookSlot = async () => {
    if (!selectedSlot.name) {
      return;
    }
    if (mode === "edit") {
      await axiosPrivate
        .put(`api/resource/Patient Appointment/${appointmentData?.name}`, "", {
          params: {
            ...appointmentData,
            ...availableSlotsFormData,
            appointment_time: selectedSlot.from_time,
            service_unit: selectedSlot.service_unit,
          },
        })
        .then((res) => {
          setShowModal(false);

          toast.success("Timeslot booked successfully");
          handleResetForm();
        });
    } else {
      await axiosPrivate
        .post(`api/resource/Patient Appointment`, "", {
          params: {
            ...appointmentData,
            ...availableSlotsFormData,
            appointment_time: selectedSlot.from_time,
            service_unit: selectedSlot.service_unit,
          },
        })
        .then((res) => {
          setShowModal(false);
          toast.success("Timeslot booked successfully");
          handleResetForm();
          setAvailableSlotsFormData({
            practitioner: "",
            appointment_date: "",
            salon_type: "",
          });
          setAvailableSlots([]);
          setSelectedSlot({});
        })
        .catch((err) => {
          const errMessage = getErrorMessage(err.response.data.exception);
          toast.error(errMessage);
        });
    }
  };

  const handleSlotsInputChange = async (val, field) => {
    setAvailableSlotsFormData((prev) => ({ ...prev, [field.id]: val }));
  };

  useEffect(() => {
    if (availableSlotsFormData) {
      if (
        availableSlotsFormData.appointment_date &&
        availableSlotsFormData.practitioner
      ) {
        getAvailableSlots();
      }
    }
  }, [
    availableSlotsFormData.appointment_date,
    availableSlotsFormData.practitioner,
  ]);

  const handleCancelAppointment = async () => {
    await axiosPrivate
      .put(`api/resource/Patient Appointment/${appointmentData?.name}`, "", {
        params: {
          // appointment_id: appointmentData?.name,
          status: "Cancelled",
        },
      })
      .then((res) => {
        toast.success("Timeslot Canceled successfully");
        handleResetForm();
      });
  };

  return (
    <div className="m-2">
      <Titlebar
        text="New Tanning Appointment"
        handleClick={() => setShowModal(true)}
        buttonText={mode === "edit" ? "Reschedule" : "Check Avilability"}
        disabled={!appointmentData.customerName || !appointmentData.machineName}
        secondaryButton={
          mode === "edit" && (
            <Button
              // className="!bg-primary"
              variant="outlined"
              onClick={() => {
                handleCancelAppointment();
              }}
            >
              <Typography>Cancel</Typography>
            </Button>
          )
        }
        showActionButton
        showGoBack
        showRefresh
      />
      <div>
        <div className="grid gap-6 lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 card">
          {appointmentForm.map((field, index) => (
            <React.Fragment key={index}>
              <Input
                label={field.label}
                className="w-full rounded-2xl"
                disabled={field.disabled}
                type={field.type}
                required={field.required}
                value={appointmentData[field.id]}
                setValue={(val) => handleInputChange(val, field)}
                endpoint={field.endpoint}
              />
            </React.Fragment>
          ))}
        </div>
        <hr className="my-8" />

        {(appointmentDetails.service_unit || mode === "edit") && (
          <div>
            <h3 className="mb-6 text-xl text-white">Appointment Details</h3>
            <div className="grid gap-6 lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 card">
              {appointmentDetailsForm.map((field, index) => (
                <React.Fragment key={index}>
                  <Input
                    label={field.label}
                    className="w-full rounded-2xl"
                    disabled={field.disabled}
                    type={field.type}
                    required={field.required}
                    value={appointmentDetails[field.id]}
                    setValue={(val) =>
                      setAppointmentDetails((prev) => ({
                        ...prev,
                        [field.id]: val,
                      }))
                    }
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth>
        <DialogTitle className="flex items-center justify-between">
          Available Slots
          <div className="cursor-pointer" onClick={() => setShowModal(false)}>
            <CloseIcon />
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <div className="">
            <div className="grid gap-8">
              {availableSlotsForm.map((field) => (
                <Input
                  key={field.id}
                  label={field.label}
                  className="w-full rounded-2xl"
                  disabled={field.disabled}
                  type={field.type}
                  required={field.required}
                  value={availableSlotsFormData[field.id]}
                  setValue={(val) => handleSlotsInputChange(val, field)}
                />
              ))}
            </div>
            <Divider className="!my-6" />
            <div>
              {availableSlots.map((item, index) => (
                <div className="mb-10" key={`${item.service_unit}_${index}`}>
                  <div className="text-center">
                    <h3>
                      <b> {item.slot_name}:</b>
                    </h3>
                  </div>
                  <div className="mt-3">
                    <div className="grid grid-cols-6 gap-6">
                      {item.avail_slot.map((slot, index) => {
                        return (
                          <div key={index}>
                            <div
                              className={`py-2 cursor-pointer text-center border rounded-lg ${
                                selectedSlot.name === slot.name
                                  ? "bg-[#1976d2] text-white"
                                  : ""
                              } ${
                                bookedSlots[0].find(
                                  (item) =>
                                    item.appointment_time === slot.from_time
                                )
                                  ? "border-slate-300 bg-gray-200 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() =>
                                bookedSlots[0].find(
                                  (item) =>
                                    item.appointment_time === slot.from_time
                                )
                                  ? null
                                  : setSelectedSlot({
                                      service_unit: item.service_unit,
                                      ...slot,
                                    })
                              }
                            >
                              {slot.from_time.slice(0, -3)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="contained" onClick={bookSlot}>
            Book
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TanningAppointment;
