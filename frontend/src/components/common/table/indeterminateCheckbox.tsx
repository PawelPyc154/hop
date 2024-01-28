import clsx from "clsx";
import { useEffect, useRef } from "react";
import {
  MdCheckBox,
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineIndeterminateCheckBox,
} from "react-icons/md";

export const IndeterminateCheckbox = ({
  checked,
  indeterminate,
  onChange,
}: {
  indeterminate?: boolean;
  checked: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (event: unknown) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <label
      className={clsx(
        "relative cursor-pointer select-none text-[22px] text-emerald-600 hover:text-emerald-700 2xl:text-2xl",
      )}
    >
      <input
        className="invisible absolute inset-0"
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={onChange}
      />
      {!checked &&
        (indeterminate ? (
          <MdOutlineIndeterminateCheckBox />
        ) : (
          <MdOutlineCheckBoxOutlineBlank />
        ))}
      {checked && <MdCheckBox />}
    </label>
  );
};
