export const generateDate = () => {
  const date = new Date();
  const formattedDate = date.toISOString().replace('T', ' ').split('.')[0];

  return formattedDate;
};
