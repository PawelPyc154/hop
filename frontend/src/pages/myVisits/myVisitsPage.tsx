import * as React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { TablePage } from "../../components/common/table/tablePage";
import { MobilePropertyWrapper } from "../../components/common/table/mobilePropertyWrapper";
import { MobileTableKeyValueRender } from "../../components/common/table/mobileTableKeyValueRender";
import { ButtonsWrapper } from "../../components/form/buttonsWrapper";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { VisitStatus } from "../../components/visitStatus";
import { Button } from "../../components/form/button";
import { Tooltip } from "../../components/common/tooltip";
import { IoAddOutline } from "react-icons/io5";
import { LiaStopCircleSolid } from "react-icons/lia";
import { RiDeleteBinLine } from "react-icons/ri";

type VisitStatusType = "pending" | "completed" | "canceled" | "confirmed";

type Visit = {
  id: string;
  visitDate: Date;
  service: string;
  place: string;
  status: VisitStatusType;
};

const columnHelper = createColumnHelper<Visit>();

export const MyVisitsPage = () => {
  const columns = React.useMemo(
    () => [
      columnHelper.accessor("service", {
        header: () => "Usługa",
        enableSorting: false,
        meta: { justify: "start", classNameTd: "font-medium" },
      }),

      columnHelper.accessor("place", {
        meta: { classNameThTd: "w-[15%]" },
        enableSorting: false,
        header: () => "Miejsce",
      }),
      columnHelper.accessor("status", {
        meta: { classNameThTd: "w-[15%]" },
        enableSorting: false,
        header: () => "Status",
        cell: (item) => <VisitStatus status={item.getValue()} />,
      }),
      columnHelper.accessor("visitDate", {
        meta: { classNameThTd: "w-[15%]" },
        enableSorting: false,
        header: () => "Data",
        cell: (item) => (
          <div>
            {new Date(item.getValue()).toLocaleDateString("pl", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        ),
      }),
      columnHelper.accessor("id", {
        header: () => "Akcje",
        enableSorting: false,
        meta: { justify: "end", classNameThTd: "w-0" },
        cell: () => (
          <ButtonsWrapper>
            <Tooltip content={"Jeszcze raz"}>
              <Button
                size="md"
                icon={<IoAddOutline size={20} />}
                color="gray"
                onClick={() => alert("todo")}
              />
            </Tooltip>
            <Tooltip content={"Odwołaj"}>
              <Button
                size="md"
                icon={<LiaStopCircleSolid size={24} />}
                color="gray"
                onClick={() => alert("todo")}
              />
            </Tooltip>
            <Tooltip content={"Usuń"}>
              <Button
                size="md"
                icon={<RiDeleteBinLine size={22} />}
                color="gray"
                onClick={() => alert("todo")}
              />
            </Tooltip>
          </ButtonsWrapper>
        ),
      }),
    ],
    [],
  );
  const places = useQuery({
    queryKey: ["visits"],
    queryFn: async () =>
      axios
        .get<{
          items: Visit[];
        }>(`/visits`, { withCredentials: true })
        .then((r) => r.data),
  });
  return (
    <TablePage
      data={places.data?.items || []}
      columns={columns}
      pageTitle={"Moje wizyty"}
      totalItems={0}
      isLoading={false}
      mobileRender={({ id, service, place, status, visitDate }) => (
        <React.Fragment>
          <MobilePropertyWrapper
            actionsSlot={id?.cell}
            headingSlot={service?.cell}
          >
            <MobileTableKeyValueRender property={status} />
            <MobileTableKeyValueRender property={visitDate} />
            <MobileTableKeyValueRender property={place} />
          </MobilePropertyWrapper>
        </React.Fragment>
      )}
    />
  );
};
