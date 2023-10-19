export default (time: string | Date) => {
  const date = new Date(time);
  return date.getHours() + ":" + date.getMinutes();
};
