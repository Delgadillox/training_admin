import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ responses }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: responses.map((r) => `${r.option} [${r.count}]`),
          datasets: [
            {
              data: responses.map((r) => r.count),
              backgroundColor: ["red", "blue", "green"],
              hoverBackgroundColor: ["darkred", "darkblue", "darkgreen"],
            },
          ],
        },
        options: {
          plugins: {
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
