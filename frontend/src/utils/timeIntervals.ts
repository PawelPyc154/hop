export const timeIntervals = ({ min, max }: { min: number; max: number }) => {
  const items = [];
  for (let hour = min; hour < max; hour++) {
    items.push([hour, 0]);
    items.push([hour, 30]);
  }

  const date = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  });

  const range = items.map((time) => {
    const [hour, minute] = time;
    date.setHours(hour);
    date.setMinutes(minute);

    return formatter.format(date);
  });

  return range;
};

export const timeDayIntervals = () => {
  const items = [];
  for (let day = 1; day < 30; day++) {
    items.push(day);
    items.push(day);
  }

  const date = new Date();
  const formatter = new Intl.DateTimeFormat("pl", {
    weekday: "short",
    day: "numeric",
  });

  const range = items.map((day) => {
    date.setDate(day);

    return formatter.format(date);
  });

  return range;
};
export const next7Days = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();
  const date = today.getDate();
  const days = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(year, month - 1, date + i);
    days.push(day);
  }
  const formatter = new Intl.DateTimeFormat("pl", {
    weekday: "short",
    day: "numeric",
  });

  const range = days.map((data) => {
    return formatter.format(data);
  });

  return range;
};
