import { useEffect, useMemo, useState } from "react";
import axiosPrivate from "../../api/BaseURL";
import { useNavigate } from "react-router-dom";
import Titlebar from "../../component/common/Titlebar";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Box } from "@mantine/core";

const TanningAppointmentList = () => {
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
        `api/resource/Patient Appointment?fields=["name","patient","status"]&sort_order=desc&limit_start=0&limit_page_length=10000`
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

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.name}`, //accessorFn used to join multiple data into a single cell
        id: "customer_name", //id is still required when using accessorFn instead of accessorKey
        header: "ID",
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
        accessorFn: (row) => `${row.patient}`, //accessorFn used to join multiple data into a single cell
        id: "patient", //id is still required when using accessorFn instead of accessorKey
        header: "Customer Name",
        size: 250,
        filterVariant: "autocomplete",
      },
      {
        accessorFn: (row) => `${row.status}`, //accessorFn used to join multiple data into a single cell
        id: "status", //id is still required when using accessorFn instead of accessorKey
        header: "Status",
        size: 250,
        filterVariant: "autocomplete",
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
      <Titlebar
        text="Tanning Appointment List"
        handleClick={() => navigate("add")}
        buttonText="Create"
      />
      <div>
        <MantineReactTable table={table} />
      </div>
    </div>
  );
};

export default TanningAppointmentList;
