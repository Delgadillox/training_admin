import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const generateExcel = async () => {
  const response = await fetch("/path/to/plantilla.xlsx");
  const arrayBuffer = await response.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.getWorksheet("Sheet1");

  // Modificar los datos en la plantilla
  const data = [
    ["Modelo 1", 10],
    ["Modelo 2", 15],
    ["Modelo 3", 5],
    ["Modelo 4", 12],
    ["Modelo 5", 8],
    ["Modelo 6", 7],
    ["Modelo 7", 10],
  ];

  data.forEach((row, index) => {
    worksheet.getCell(`A${index + 2}`).value = row[0];
    worksheet.getCell(`B${index + 2}`).value = row[1];
  });

  // Generar el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, "ventas_modificado.xlsx");
};

const ExcelExport = () => {
  return (
    <div>
      <button onClick={generateExcel}>Exportar Excel con Gráfico 3D</button>
    </div>
  );
};

export default ExcelExport;
