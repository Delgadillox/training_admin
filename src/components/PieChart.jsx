import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const PieChart = ({ responses }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Calcular el total de respuestas
      const totalResponses = responses.reduce(
        (acc, response) => acc + response.count,
        0
      );

      const chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: responses.map((r) => r.option),
          datasets: [
            {
              data: responses.map((r) => r.count),
              backgroundColor: ["#008f39", "#e6cc00", "#ff0000"],
              hoverBackgroundColor: ["darkgreen", "#8B8000", "darkred"],
            },
          ],
        },
        plugins: [ChartDataLabels],
        options: {
          plugins: {
            datalabels: {
              color: "#fff",
              textAlign: "center",
              font: {
                weight: "bold",
              },
              formatter: (value, ctx) => {
                // Solo mostrar el porcentaje si el valor es mayor que 0
                if (value > 0) {
                  const percentage = ((value / totalResponses) * 100).toFixed(
                    2
                  );
                  return `${percentage}%`;
                }
                return ""; // Devolver una cadena vacía si el valor es 0
              },
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });

      // Limpiar el gráfico anterior cuando el componente se desmonte
      return () => {
        chart.destroy();
      };
    }
  }, [responses]);

  return <canvas ref={chartRef}></canvas>;
};

export default PieChart;
