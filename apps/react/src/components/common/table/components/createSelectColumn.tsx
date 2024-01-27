import { IndeterminateCheckbox } from "../indeterminateCheckbox";
import { ColumnDef } from "@tanstack/react-table";

export const createSelectColumn = <TData,>(): ColumnDef<TData> => ({
  id: "select",
  meta: { justify: "start", classNameThTd: "w-0" },
  enableSorting: false,
  header: ({ table }) => (
    <IndeterminateCheckbox
      {...{
        checked: table.getIsAllRowsSelected(),
        indeterminate: table.getIsSomeRowsSelected(),
        onChange: table.getToggleAllRowsSelectedHandler(),
      }}
    />
  ),
  cell: ({ row }) => (
    <IndeterminateCheckbox
      {...{
        checked: row.getIsSelected(),
        indeterminate: row.getIsSomeSelected(),
        onChange: row.getToggleSelectedHandler(),
      }}
    />
  ),
});
