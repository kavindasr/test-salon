import { useEffect, useMemo, useState } from "react";
import axiosPrivate from "../../api/BaseURL";
import { useNavigate } from "react-router-dom";
import { Box } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import Titlebar from "../../component/common/Titlebar";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";

const CustomerList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  //Example
  //data and fetching state
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [showDelete, setshowDelete] = useState(false);
  const [deleteDataName, setDeleteDataName] = useState("");

  const fetchData = async () => {
    if (!data.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }
    try {
      const response = await axiosPrivate.get(
        `api/resource/Customer?fields=["name","customer_name","customer_group","customer_type"]&limit_page_length=1000000&limit_start=0`
      );
      setData(response.data.data);
      // setRowCount(json.meta.totalRowCount);
    } catch (error) {
      console.error(error);
      return;
    }
    setIsLoading(false);
    setLoading(false);
    setIsRefetching(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnFilters, //refetch when column filters change
    globalFilter, //refetch when global filter changes
    pagination.pageIndex, //refetch when page index changes
    pagination.pageSize, //refetch when page size changes
    sorting, //refetch when sorting changes
  ]);

  const handleEditPage = (name) => {
    navigate("edit", { state: name });
  };
  const handleDeletePage = (name) => {
    setshowDelete(true);
    setDeleteDataName(name);
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.customer_name}`, //accessorFn used to join multiple data into a single cell
        id: "customer_name", //id is still required when using accessorFn instead of accessorKey
        header: "Customer Name",
        size: 250,
        filterVariant: "autocomplete",
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              cursor: "pointer",
            }}
          >
            <div onClick={() => handleEditPage(row.original.name)}>
              {renderedCellValue}
            </div>
          </Box>
        ),
      },
      {
        accessorFn: (row) => `${row.customer_type}`, //accessorFn used to join multiple data into a single cell
        id: "customer_type", //id is still required when using accessorFn instead of accessorKey
        header: "Customer Type",
        size: 200,
        filterVariant: "autocomplete",
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              cursor: "pointer",
            }}
          >
            <div onClick={() => handleEditPage(row.original.name)}>
              {renderedCellValue}
            </div>
          </Box>
        ),
      },
      {
        accessorFn: (row) => `${row.customer_group}`, //accessorFn used to join multiple data into a single cell
        id: "customer_group", //id is still required when using accessorFn instead of accessorKey
        header: "Customer Group",
        size: 250,
        filterVariant: "autocomplete",
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              cursor: "pointer",
            }}
          >
            <div onClick={() => handleEditPage(row.original.name)}>
              {renderedCellValue}
            </div>
          </Box>
        ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableFacetedValues: true,
    enableGrouping: true,
    enablePinning: true,
    enableRowSelection: true,
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

  return (
    <div className="m-2">
      {loading ? (
        <>Loading ....</>
      ) : (
        <>
          <Titlebar
            text="Customer List"
            handleClick={() => navigate("create")}
            buttonText="Add"
          />
          <div>
            <MantineReactTable table={table} />
            {/* {customerData.map((customer) => (
          <div key={customer.name} className="flex gap-16">
            <p>{customer.name}</p>
            <p>{customer.customer_name}</p>
          </div>
        ))} */}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerList;
