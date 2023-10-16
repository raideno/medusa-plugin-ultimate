function monthNumberToName(monthNumber: number) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (monthNumber > 12 || monthNumber < 1) return "unknown";

  return months[monthNumber];
}

export default (d: string | Date) => {
  const date = new Date(d);
  return (
    date.getDate() +
    " " +
    monthNumberToName(date.getMonth()) +
    " " +
    date.getFullYear()
  );
};
