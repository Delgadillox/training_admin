export const transformDateHour = (date) => {
  const fecha = new Date(date);

  const padNumber = (num) => num.toString().padStart(2, "0");
  const fechaFormateada = `${padNumber(fecha.getDate())}/${padNumber(
    fecha.getMonth() + 1
  )}/${fecha.getFullYear()}`;
  const horaFormateada = `${padNumber(fecha.getHours())}:${padNumber(
    fecha.getMinutes()
  )}`;

  const result = `${fechaFormateada} ${horaFormateada}`;

  return result;
};

export const transformDate = (date) => {
  const fecha = new Date(date);

  const padNumber = (num) => num.toString().padStart(2, "0");
  const fechaFormateada = `${padNumber(fecha.getDate())}/${padNumber(
    fecha.getMonth() + 1
  )}/${fecha.getFullYear()}`;

  const result = `${fechaFormateada}`;

  return result;
};
