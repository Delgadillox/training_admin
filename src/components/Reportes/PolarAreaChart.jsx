import React from "react";
import { PolarArea } from "react-chartjs-2";
import Chart from "chart.js/auto";

const PolarAreaChart = ({ questions, responses }) => {
  const parseResults = (resultados) => JSON.parse(resultados);

  const createChartData = (question) => {
    return {
      labels: question.options,
      datasets: responses.map((survey, surveyIndex) => {
        const surveyData = parseResults(survey.resultados);
        const companyName = survey.company;
        const leaderName = survey.nombre;
        const questionResult = surveyData.find(
          (result) => result.id === question.id
        );

        return {
          label: `${companyName} - ${leaderName}`,
          data: question.options.map((option) => {
            const optionIndexInQuestion = question.options.indexOf(option);
            return questionResult
              ? questionResult.options[optionIndexInQuestion] || 0
              : 0;
          }),
          backgroundColor: `rgba(${surveyIndex * 50}, ${surveyIndex * 100}, ${
            surveyIndex * 150
          }, 0.2)`,
          borderColor: `rgba(${surveyIndex * 50}, ${surveyIndex * 100}, ${
            surveyIndex * 150
          }, 1)`,
          borderWidth: 1,
        };
      }),
    };
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: "400px" }}>
      {questions.map((question, index) => (
        <div key={index} style={{ marginBottom: "2rem", height: "400px" }}>
          <h3>{question.question}</h3>
          <PolarArea data={createChartData(question)} options={chartOptions} />
        </div>
      ))}
    </div>
  );
};

export default PolarAreaChart;
