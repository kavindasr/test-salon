import { useState } from "react";
import { Box } from "@mui/material";
import Input from "../../component/common/Input";
import axiosPrivate from "../../api/BaseURL";
import Titlebar from "../../component/common/Titlebar";
import { toast } from "react-toastify";
import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { getErrorMessage } from "../../utils/Functions";

const AddTanningPlan = ({ mode }) => {
  const location = useLocation();
  const [tanningPlan, setTanningPlan] = useState({
    naming_series: "",
    salon_customer: "",
    company: "Megasun Saloon",
    status: "Not Started",
    customer_name: "",
    start_date: "",
    therapy_plan_template: "",
  });
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const itemDetails = [
    {
      id: "naming_series",
      label: "Naming Series",
      type: "select",
      endpoint: "Healthcare Practitioner?limit_page_length=0",
    },
    {
      id: "salon_customer",
      label: "Salon Customer",
      required: true,
      type: "select",
      endpoint: "Patient?limit_page_length=0",
    },
    {
      id: "customer_name",
      label: "Customer Name",
      type: "text",
      disabled: true,
    },
    {
      id: "start_date",
      type: "date",
    },
    {
      id: "therapy_plan_template",
      label: "Tanning Plan Template",
      type: "select",
      endpoint: "Therapy Plan Template?limit_page_length=0",
    },
  ];

  const columns = useMemo(
    () => [
      {
        id: "customer", //id used to define `group` column
        header: "Customer Information",
        columns: [
          {
            accessorFn: (row) => `${row.idx}`, //accessorFn used to join multiple data into a single cell
            id: "idx", //id is still required when using accessorFn instead of accessorKey
            header: "ID",
            size: 250,
            filterVariant: "autocomplete",
          },
          {
            accessorFn: (row) => `${row.therapy_type}`, //accessorFn used to join multiple data into a single cell
            id: "therapy_type", //id is still required when using accessorFn instead of accessorKey
            header: "Tanning Type",
            size: 250,
            filterVariant: "autocomplete",
            Cell: ({ renderedCellValue }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div>{renderedCellValue}</div>
              </Box>
            ),
          },
          {
            accessorFn: (row) => `${row.no_of_sessions}`, //accessorFn used to join multiple data into a single cell
            id: "no_of_sessions", //id is still required when using accessorFn instead of accessorKey
            header: "Session",
            size: 250,
            filterVariant: "autocomplete",
          },
          {
            accessorFn: (row) => `${row.duration}`, //accessorFn used to join multiple data into a single cell
            id: "duration", //id is still required when using accessorFn instead of accessorKey
            header: "Sessions Completed",
            size: 250,
            filterVariant: "autocomplete",
          },
        ],
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    // enableColumnFilterModes: true,
    // enableColumnOrdering: true,
    // enableFacetedValues: true,
    // enableGrouping: true,
    // enablePinning: true,
    enableRowSelection: false,
    initialState: { showColumnFilters: true },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    state: {
      // columnFilters,
      // globalFilter,
      isLoading,
      // pagination,
      // showAlertBanner: isError,
      showProgressBars: isRefetching,
      // sorting,
    },
  });

  const handleSubmit = () => {
    if (mode === "edit") {
      const temp = {
        patient: tanningPlan.salon_customer,
        patient_name: tanningPlan.salon_customer,
        company: tanningPlan.company,
        status: tanningPlan.status,
        start_date: tanningPlan.start_date,
        therapy_plan_details: data,
        therapy_plan_template: tanningPlan.therapy_plan_template,
        title: tanningPlan.salon_customer,
        invoiced: 0,
        docType: "Therapy Plan",
      };
      axios
        .put(
          `https://megasun.bestoerp.com/api/resource/Therapy Plan/${location.state}`,
          temp,
          {
            auth: {
              username: "6bbb2047296999e",
              password: "9b4929bd91ae929",
            },
            responseType: "json",
            withCredentials: true,
          }
        )
        .then(() => {
          toast.success("Data Added Successfully");
          setTanningPlan({
            naming_series: "",
            salon_customer: "",
            company: "Megasun Saloon",
            status: "Not Started",
            customer_name: "",
            start_date: "",
            therapy_plan_template: "",
          });
          setData([]);
        })
        .catch((err) => {
          const errMessage = getErrorMessage(err.response.data.exception);
          toast.error(errMessage);
        });
    } else {
      const temp = {
        patient: tanningPlan.salon_customer,
        patient_name: tanningPlan.salon_customer,
        company: tanningPlan.company,
        status: tanningPlan.status,
        start_date: tanningPlan.start_date,
        therapy_plan_details: data,
        therapy_plan_template: tanningPlan.therapy_plan_template,
        title: tanningPlan.salon_customer,
        invoiced: 0,
        docType: "Therapy Plan",
      };
      axios
        .post("https://megasun.bestoerp.com/api/resource/Therapy Plan", temp, {
          auth: {
            username: "6bbb2047296999e",
            password: "9b4929bd91ae929",
          },
          responseType: "json",
          withCredentials: true,
        })
        .then(() => {
          toast.success("Data Added Successfully");
          setTanningPlan({
            naming_series: "",
            salon_customer: "",
            company: "Megasun Saloon",
            status: "Not Started",
            customer_name: "",
            start_date: "",
            therapy_plan_template: "",
          });
          setData([]);
        })
        .catch((err) => {
          const errMessage = getErrorMessage(err.response.data.exception);
          toast.error(errMessage);
        });
    }
  };

  const handleInputChange = async (val, field) => {
    if (field.id === "salon_customer") {
      await axiosPrivate.get(`api/resource/Customer/${val}`).then((res) => {
        setTanningPlan((prev) => ({
          ...prev,
          customer_name: res.data.data?.name,
          salon_customer: res.data.data?.name,
        }));
      });
    } else if (field.id === "therapy_plan_template") {
      await axiosPrivate
        .get(`api/resource/Therapy Plan Template/${val}`)
        .then((res) => {
          setTanningPlan((prev) => ({
            ...prev,
            therapy_plan_template: res.data.data?.name,
          }));
          if (!data.length) {
            setIsLoading(true);
          } else {
            setIsRefetching(true);
          }
          setData(res.data.data?.therapy_types);
        });
    } else {
      setTanningPlan((prev) => ({ ...prev, [field.id]: val }));
    }
  };

  useEffect(() => {
    if (data.length > 1) {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [data]);

  useEffect(() => {
    if (mode === "edit") {
      axiosPrivate
        .get(`api/resource/Therapy Plan/${location.state}`)
        .then((res) => {
          setTanningPlan((prev) => ({
            ...prev,
            ...res?.data?.data,
            salon_customer: res?.data?.data?.patient_name,
            customer_name: res?.data?.data?.patient_name,
          }));
          setData(res?.data?.data?.therapy_plan_details);
        });
    }
  }, [location, mode]);

  return (
    <div className="my-6">
      <Titlebar
        text="New Tanning Plan"
        handleClick={() => {
          handleSubmit();
        }}
        buttonText={mode === "edit" ? "Update" : "Save"}
        showActionButton
        showGoBack
        showRefresh
      />
      <div className="w-full">
        <div className="grid gap-6 lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-2 card">
          {itemDetails.map((ele) => (
            <Input
              className="col-span-1"
              key={ele.id}
              label={ele.label}
              type={ele.type}
              value={tanningPlan[ele.id]}
              data={ele.data}
              disabled={ele.disabled}
              required={ele.required}
              setValue={(val) => handleInputChange(val, ele)}
              endpoint={ele.endpoint}
            />
          ))}
        </div>
        <hr className="my-4" />
        {data.length > 1 && <MantineReactTable table={table} />}
      </div>
    </div>
  );
};

export default AddTanningPlan;
