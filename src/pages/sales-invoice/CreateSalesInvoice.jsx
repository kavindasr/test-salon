import React, { useEffect, useState } from "react";
import Input from "../../component/common/Input";
import axiosPrivate from "../../api/BaseURL";
import { useLocation, useNavigate } from "react-router-dom";
import Titlebar from "../../component/common/Titlebar";
import { toast } from "react-toastify";
import { Divider } from "@mui/material";
import BillTable from "./BillTable";
import axios from "axios";
import { getErrorMessage } from "../../utils/Functions";
import { Checkbox } from "@mantine/core";

const CreateSalesInvoice = ({ mode }) => {
  const params = useLocation();

  const [customerData, setCustomerData] = useState({
    series: "",
    posting_date: "",
    patient: "",
    posting_time: "",
    patient_name: "",
  });

  const rowFormData = { no: "", item: "", qty: "", rate: "", amount: "" };
  const [selectedRows, setSelectedRows] = useState([]);
  const [avaibaleRows, setAvaibaleRows] = useState([rowFormData]);
  const [rowFormFields, setRowFormFields] = useState([rowFormData]);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [barcodeValue, setBarcodeValue] = useState("");

  // const [cashSale, setCashSale] = useState(true);
  // const [cashSalesValue, setCashSalesValue] = useState("Profile - I");

  const invoiceForm = [
    // {
    //   id: "series",
    //   label: "Series",
    //   type: "text",
    //   required: true,
    // },
    {
      id: "posting_date",
      type: "date",
      required: true,
    },
    {
      id: "patient",
      label: "Salon Customer",
      type: "select",
      endpoint: "Customer?limit_page_length=0&limit_start=0",
    },
    {
      id: "posting_time",
      label: "Posting Time",
      type: "time",
    },
    {
      id: "patient_name",
      label: "Customer Name",
      type: "text",
      disabled: true,
    },
  ];

  useEffect(() => {
    const finalQty = rowFormFields
      .map((row) => row["qty"])
      .reduce((sum, value) => +sum + +value, 0);
    setTotalQuantity(finalQty.toFixed(3));
    const finalAmt = rowFormFields
      .map((row) => row["amount"])
      .reduce((sum, value) => +sum + +value, 0);
    setTotalAmount(finalAmt.toFixed(3));
    setPaidAmount(finalAmt.toFixed(3));
  }, [rowFormFields]);

  useEffect(() => {
    if (mode === "edit") {
      axiosPrivate
        .get(`api/resource/Sales Invoice/${params.state}`)
        .then((res) => {
          setCustomerData((prev) => ({
            ...prev,
            ...res?.data?.data,
            posting_time: formatTime(res.data.data.posting_time),
          }));
          const data = res.data.data?.items?.map((item) => {
            return {
              no: item.idx,
              item: item.item_name,
              qty: item.qty,
              rate: item.rate,
              amount: item.amount,
            };
          });
          setAvaibaleRows(data);
          setRowFormFields(data);
        });
    }
  }, [params, mode]);

  const printBody = {
    name: customerData?.name,
    format: "Standard",
    doctype: "Sales Invoice",
  };

  const printConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    auth: {
      username: "6bbb2047296999e",
      password: "9b4929bd91ae929",
    },
    responseType: "blob",
    withCredentials: true,
  };

  const handlePrint = ({
    url = "https://megasun.bestoerp.com/api/method/frappe.utils.print_format.download_pdf",
    body = printBody,
    config = printConfig,
  }) => {
    axios.post(url, body, config).then((res) => {
      const resBlob = new Blob([res.data], {
        type: "application/pdf",
      });
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(resBlob);
      // link.download = body.name + ".pdf";
      link.target = "_blank"; // Open link in a new tab
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.addEventListener("DOMContentLoaded", () => {
        // Call the print function after a short delay to ensure the content is loaded
        setTimeout(() => {
          window.print();
        }, 1000); // Adjust the delay as needed
      });
    });
  };

  const handleClear = () => {
    setCustomerData({});
    setRowFormFields([rowFormData]);
  };

  const handleSubmitData = async () => {
    const rowFields = rowFormFields.map((ele) => ({
      ...ele,
      qty: ele.qty,
      income_account: "Sales - Megasun",
      item_name: ele.item,
      description: ele.item,
      doctype: "Sales Invoice Item",
    }));
    const temp = {
      patient_name: customerData.patient,
      patient: customerData.patient,
      customer: customerData.patient_name,
      customer_name: customerData.patient_name,
      posting_date: customerData.posting_date,
      due_date: customerData.posting_date,
      naming_series: "ACC-SINV-.YYYY.-",
      items: rowFields,
      against_income_account: "Sales - Megasun",
      // posting_time: customerData.posting_time,
    };
    axios
      .post("https://megasun.bestoerp.com/api/resource/Sales Invoice", temp, {
        auth: {
          username: "6bbb2047296999e",
          password: "9b4929bd91ae929",
        },
      })
      .then((res) => {
        const handlebody = {
          name: res.data.data.name,
          format: "Standard",
          doctype: "Sales Invoice",
        };
        toast.success("Data Added Successfully");
        handlePrint({ body: handlebody });
        handleClear();
        // document.location.reload();
      })
      .catch((err) => {
        const errMessage = getErrorMessage(err.response.data.exception);
        toast.error(errMessage);
      });
  };

  const handleInputChange = async (val, field) => {
    if (field.id === "patient") {
      await axiosPrivate.get(`api/resource/Customer/${val}`).then((res) => {
        setCustomerData((prev) => ({
          ...prev,
          patient: res.data.data?.name,
          patient_name: res.data.data?.name,
        }));
      });
    } else {
      setCustomerData((prev) => ({ ...prev, [field.id]: val }));
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeString) => {
    const timeComponents = timeString.split(":");
    const hour = parseInt(timeComponents[0]);
    const minute = parseInt(timeComponents[1]);

    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;

    return `${formattedHour}:${formattedMinute}`;
  };

  const formatCurrentTime = (timeInMillis) => {
    const date = new Date(timeInMillis);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  // const handleBarcodeChange = async (val) => {
  //   if (val) {
  //     console.log("fun", val, rowFormFields);
  //     await axiosPrivate
  //       .get(`/api/method/erpnext.stock.utils.scan_barcode?search_value=${val}`)
  //       .then((res) => {
  //         const newItem = {
  //           item: res.data.message.item_code,
  //           qty: 1,
  //         };
  //         console.log("res", res.data.message, rowFormFields, [
  //           ...rowFormFields,
  //           newItem,
  //         ]);
  //         console.log(
  //           rowFormFields.findIndex(
  //             (el) => el.item === res.data.message.item_code
  //           )
  //         );
  //       });
  //   }
  // };

  const handleKeyDown = async (event, val) => {
    if (event.key === "Enter") {
      await axiosPrivate
        .get(`/api/method/erpnext.stock.utils.scan_barcode?search_value=${val}`)
        .then((res) => {
          if (res.data.message.item_code) {
            const newItem = {
              item: res.data.message.item_code,
              qty: Number(1).toFixed(3),
              rate: "",
              amount: "",
            };
            const ifExsist = rowFormFields.findIndex(
              (el) => el.item === res.data.message.item_code
            );
            const updatedFormFields = [...rowFormFields];

            if (ifExsist === -1) {
              setRowFormFields([newItem, ...updatedFormFields]);
            } else {
              updatedFormFields[ifExsist] = {
                ...updatedFormFields[ifExsist],
                qty: Number(
                  Number(updatedFormFields[ifExsist].qty) + 1
                ).toFixed(3),
              };
              setRowFormFields(updatedFormFields);
            }
          } else {
            toast.error("Barcode not found");
          }
        });
    }
  };

  return (
    <div>
      <Titlebar
        text="Sales Invoice"
        handleClick={() => {
          handleSubmitData();
        }}
        buttonText={mode === "edit" ? "Update" : "Save"}
        showActionButton={mode === "edit"}
        showPrint={mode === "edit"}
        body={mode === "edit" && printBody}
        config={printConfig}
        handlePrint={handlePrint}
      />
      <div className="my-4">
        <div className="grid gap-6 card lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2">
          {invoiceForm.map((field, index) => (
            <React.Fragment key={index}>
              <Input
                label={field.label}
                // className="w-full rounded-2xl"
                disabled={field.disabled}
                type={field.type}
                required={field.required}
                value={
                  field.id === "posting_date"
                    ? (customerData["posting_date"] = formatDate(new Date()))
                    : field.id === "posting_time"
                    ? (customerData["posting_time"] = formatCurrentTime(
                        new Date().getTime()
                      ))
                    : customerData[field.id]
                }
                setValue={(val) => handleInputChange(val, field)}
                data={field.data}
                endpoint={field.endpoint}
                customClass="MuiInputBase-input:!border-primary"
              />
            </React.Fragment>
          ))}
          {/* <div className="flex items-center justify-start">
            <Checkbox
              value={Boolean(cashSale)}
              defaultChecked
              label="Is Cash Sale"
              onChange={(e) => {
                setCashSale(e.target.checked);
              }}
            />
          </div>
          {cashSale && (
            <Input
              label="Cash Sale"
              type="select"
              endpoint="POS Profile"
              value={cashSalesValue}
              setValue={(val) => setCashSalesValue(val)}
            />
          )} */}
        </div>
      </div>
      <Divider className="!my-8 !border-white" />

      <div className="grid gap-6 card lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2">
        {/* <div className="w-1/2"> */}
        <Input
          label={"Barcode item"}
          value={barcodeValue}
          setValue={(val) => setBarcodeValue(val)}
          props={{ onKeyDown: (e) => handleKeyDown(e, e.target.value) }}
        />
        {/* </div> */}
      </div>
      <Divider className="!my-8 !border-white" />
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl text-white ">Items</h3>
      </div>

      <div className="card">
        <BillTable
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          avaibaleRows={avaibaleRows}
          setAvaibaleRows={setAvaibaleRows}
          rowFormFields={rowFormFields}
          setRowFormFields={setRowFormFields}
          rowFormData={rowFormData}
          totalQuantity={totalQuantity}
          setTotalQuantity={setTotalQuantity}
          totalAmount={totalAmount}
          setTotalAmount={setTotalAmount}
        />
      </div>
      <div className="my-4">
        <div className="grid gap-6 card lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2">
          <Input
            label={"Total Quantity"}
            value={totalQuantity}
            disabled={true}
          />
          <Input label={"Total Amount"} value={totalAmount} disabled={true} />
        </div>
        {/* {cashSale && ( */}
        <div className="my-4">
          <h2 className="text-xl text-white">Payment</h2>
          <div className="grid gap-6 card lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2">
            <Input label={"Paid Amount"} value={paidAmount} disabled={true} />
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default CreateSalesInvoice;
