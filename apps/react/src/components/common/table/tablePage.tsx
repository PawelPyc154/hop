import React, { Fragment, ReactNode } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Header,
  RowData,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";

import { Heading } from "../heading";

import styles from "./tablePage.module.css";
import { SortArrow } from "./sortArrow";
import tw from "tailwind-styled-components";
import { ButtonsWrapper } from "../../form/buttonsWrapper";

const justifyVariants = {
  start: `justify-start`,
  center: `justify-center text-center`,
  end: `justify-end`,
};

export type TableData = { id: string };

interface TableProps<TTableData extends TableData> {
  data?: TTableData[];
  columns: ColumnDef<TTableData, any>[];
  pageTitle?: string;
  totalItems: number | undefined;
  isLoading: boolean;
  actionsTopBar?: ReactNode;
  mobileRender: (
    // eslint-disable-next-line no-unused-vars
    cells: Record<
      keyof TTableData,
      {
        cell: ReactNode;
        header: ReactNode;
      }
    >
  ) => ReactNode;
  // eslint-disable-next-line no-unused-vars
  actionsOnSelectedElementsRender?: (options: { ids: string[] }) => ReactNode;
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    classNameTh?: string;
    classNameThTd?: string;
    classNameTd?: string;
    justify?: keyof typeof justifyVariants;
  }
}

const TablePage = <TTableData extends TableData = TableData>({
  data = [],
  columns,
  pageTitle = "",
  totalItems,
  isLoading,
  actionsOnSelectedElementsRender,
  mobileRender,
  actionsTopBar,
}: TableProps<TTableData>) => {
  // const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data: data,
    columns: columns,
    manualSorting: true,
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Container>
      <HeaderWrapper>
        <Heading tag="h1" size="2xl">
          {pageTitle}
          {totalItems ? (
            <TotalItemsWrapper>{`(${totalItems})`}</TotalItemsWrapper>
          ) : null}
        </Heading>
        <ButtonsWrapper>{actionsTopBar}</ButtonsWrapper>
      </HeaderWrapper>

      <TableWrapper className={styles.scrollbarBorder}>
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className="px-1" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  const meta = column.columnDef.meta;
                  const justify = meta?.justify || "center";
                  const isSorted = column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={clsx(meta?.classNameThTd, meta?.classNameTh)}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className={clsx(
                            "px-2 font-normal flex w-full",
                            justifyVariants[justify],
                            column.getCanSort() && "cursor-pointer select-none"
                          )}
                          onClick={column.getToggleSortingHandler()}
                          type="button"
                          disabled={!column.getCanSort()}
                        >
                          {justify === "end" && (
                            <SortArrow sortDirection={isSorted} />
                          )}
                          <span
                            className={clsx(
                              "mx-5 whitespace-nowrap",
                              justify === "start" && `ml-0`,
                              justify === "end" && `mr-0`,
                              justify === "end" && isSorted && `ml-0`,
                              isSorted && `!mr-0`,
                              column.columnDef.enableSorting === false && "!m-0"
                            )}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {justify !== "end" && (
                            <SortArrow sortDirection={isSorted} />
                          )}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className="bg-white hover:bg-gray-50" key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  const meta = column.columnDef.meta;
                  const justify = meta?.justify || "center";
                  return (
                    <td
                      key={cell.id}
                      className={clsx(meta?.classNameThTd, meta?.classNameTd)}
                    >
                      <div
                        className={clsx(
                          "flex px-2 py-2",
                          justifyVariants[justify],
                          meta?.className
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </Tbody>
        </Table>
      </TableWrapper>

      <div className="grid gap-3 xl:hidden">
        {table.getRowModel().rows.map((row) => (
          <Fragment key={row.id}>
            {mobileRender(
              Object.fromEntries(
                row.getVisibleCells().map((cell) => [
                  [cell.column.id],
                  {
                    // header: table.getHeader(item.column.id).renderHeader(),
                    header: flexRender(
                      cell.column.columnDef.header,
                      (
                        table
                          .getFlatHeaders()
                          .find(({ id }) => id === cell.column.id) as Header<
                          TTableData,
                          unknown
                        >
                      ).getContext()
                    ),
                    cell: flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    ),
                  },
                ])
              )
            )}
          </Fragment>
        ))}
      </div>

      <FooterWrapper
        className={clsx(isLoading && `opacity-30 pointer-events-none`)}
      >
        {actionsOnSelectedElementsRender?.({
          ids: table
            .getSelectedRowModel()
            .flatRows.map(({ original }) => original.id),
        })}
      </FooterWrapper>
    </Container>
  );
};

export { TablePage };

const Container = tw.div`flex flex-col gap-4 p-4 max-w-[1400px] w-full mx-auto`;
const HeaderWrapper = tw.div`relative flex items-center justify-between`;
const TotalItemsWrapper = tw.span`text-xs ml-1 2xl:text-sm 2xl:ml-2`;
const TableWrapper = tw.div`overflow-y-auto w-full flex-grow hidden xl:block`;
const Table = tw.table`w-full`;
const Thead = tw.thead`sticky top-0 z-20 h-8 text-xs bg-gray-100 2xl:text-sm`;
const Tbody = tw.tbody`divide-y divide-gray-100 shadow-lg`;
const FooterWrapper = tw.div`h-10 flex justify-end xl:justify-between`;
