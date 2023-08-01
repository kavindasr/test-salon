import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

const CommonTable = ({ columns, data, isLoading, isRefetching }) => {
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
    <div>
      <MantineReactTable table={table} />
    </div>
  );
};

export default CommonTable;
