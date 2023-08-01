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
import { getErrorMessage } from "../../utils/Functions";

const SalesInvoiceList = () => {
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
        `api/resource/Sales Invoice?fields=["name","patient_name","due_date"]&limit_page_length=1000000&limit_start=0`
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

  // const handleEditPage = (name) => {
  //   navigate("edit", { state: name });
  // };
  // const handleDeletePage = (name) => {
  //   setshowDelete(true);
  //   setDeleteDataName(name);
  // };

  const handleDeleteData = () => {
    axiosPrivate
      .delete(`api/resource/Customer/${deleteDataName}`)
      .then(() => {
        toast.warning("Data Deleted!");
        setshowDelete(false);
        setDeleteDataName("");
        fetchData();
      })
      .catch((err) => {
        const errMessage = getErrorMessage(err.response.data.exception);
        toast.error(errMessage);
        setshowDelete(false);
        setDeleteDataName("");
      });
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.name}`, //accessorFn used to join multiple data into a single cell
        id: "name", //id is still required when using accessorFn instead of accessorKey
        header: "Title",
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
            <div onClick={() => navigate("edit", { state: row.original.name })}>
              {renderedCellValue}
            </div>
          </Box>
        ),
      },
      {
        accessorFn: (row) => `${row.patient_name}`, //accessorFn used to join multiple data into a single cell
        id: "patient_name", //id is still required when using accessorFn instead of accessorKey
        header: "Customer Name",
        size: 200,
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
        accessorFn: (row) => `${row.due_date}`, //accessorFn used to join multiple data into a single cell
        id: "due_date", //id is still required when using accessorFn instead of accessorKey
        header: "Due Date",
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
    ],
    []
  );

  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    //do something when the row selection changes...
    console.info({ rowSelection });
  }, [rowSelection]);

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
    onRowSelectionChange: setRowSelection,
    // renderTopToolbarCustomActions: ({ table }) => (
    //   <Button
    //     onClick={() => {
    //       console.log("Table", table);
    //       // const rowSelection = table.getState().rowSelection; //read state
    //       // const selectedRows = table.getSelectedRowModel().rows; //or read entire rows
    //     }}
    //   >
    //     Print
    //   </Button>
    // ),
    state: {
      rowSelection,
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
            text="Sales Invoice List"
            handleClick={() => navigate("create")}
            buttonText="Create"
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

export default SalesInvoiceList;
