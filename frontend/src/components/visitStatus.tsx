"use client";

import clsx from "clsx";

type VisitStatusType = "pending" | "completed" | "canceled" | "confirmed";

const colors: Record<VisitStatusType, string> = {
  pending: `text-yellow-600`,
  completed: `text-gray-600`,
  canceled: `text-red-600`,
  confirmed: `text-green-600`,
};
const texts: Record<VisitStatusType, string> = {
  pending: `Pending`,
  completed: `Completed`,
  canceled: `Canceled`,
  confirmed: `Confirmed`,
};

interface OfferStatusProps {
  status: VisitStatusType;
}

export const VisitStatus = ({ status }: OfferStatusProps) => {
  return (
    <div className={clsx(`font-medium`, colors[status])}>{texts[status]}</div>
  );
};
