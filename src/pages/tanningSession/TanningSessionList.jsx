import { useNavigate } from "react-router-dom";
import Titlebar from "../../component/common/Titlebar";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Box } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import axiosPrivate from "../../api/BaseURL";

const TanningSessionList = () => {
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

  const fetchData = async () => {
    if (!data.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }
    try {
      const response = await axiosPrivate.get(
        `api/resource/Therapy Session?fields=["name", "patient_name", "therapy_type","start_date", "start_time","duration"]`
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

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.name}`, //accessorFn used to join multiple data into a single cell
        id: "customer_name", //id is still required when using accessorFn instead of accessorKey
        header: "Tanning Session",
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
            <div
              onClick={() => handleEditPage(row.original.name)}
              className="cursor-pointer"
            >
              {renderedCellValue}
            </div>
          </Box>
        ),
      },
      {
        accessorFn: (row) => `${row.patient_name}`, //accessorFn used to join multiple data into a single cell
        id: "patient_name", //id is still required when using accessorFn instead of accessorKey
        header: "Customer Name",
        size: 250,
      },
      {
        accessorFn: (row) => `${row.start_date}`, //accessorFn used to join multiple data into a single cell
        id: "start_date", //id is still required when using accessorFn instead of accessorKey
        header: "Start Date",
        size: 250,
      },
      {
        accessorFn: (row) => `${row.start_time}`, //accessorFn used to join multiple data into a single cell
        id: "start_time", //id is still required when using accessorFn instead of accessorKey
        header: "Start Time",
        size: 250,
      },
      {
        accessorFn: (row) => `${row.therapy_type}`, //accessorFn used to join multiple data into a single cell
        id: "therapy_type", //id is still required when using accessorFn instead of accessorKey
        header: "Session Name",
        size: 250,
      },
      {
        accessorFn: (row) => `${row.duration}`, //accessorFn used to join multiple data into a single cell
        id: "duration", //id is still required when using accessorFn instead of accessorKey
        header: "Duration",
        size: 250,
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
    <div className="my-2">
      <Titlebar
        text="Tanning Session List"
        handleClick={() => navigate("add")}
        buttonText="Add"
      />
      <div>
        <MantineReactTable table={table} />
      </div>
    </div>
  );
};

export default TanningSessionList;
