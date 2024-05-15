import { useEffect, useState } from "react";
import PdfDocument from "../components/PDF";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PDFView = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  const selectedDate = query.get("selectedDate") || null;
  const selectedCompany = query.get("selectedCompany") || null;
  const selectedLeader = query.get("selectedLeader") || null;
  const selectedTitle = query.get("selectedTitle") || null;

  const filters = {
    id,
    selectedDate,
    selectedCompany,
    selectedLeader,
    selectedTitle,
  };

  const [surveyData, setSurveyData] = useState({});

  useEffect(() => {
    const getData = async () => {
      let urlResponses = "";
      let date = "";
      let company = "";
      let leader = "";
      let comments = "";

      if (filters.id) {
        urlResponses = `https://psicologia-aplicada.com/quizz/psicologia-api/reports/getReports.php?quizz=${filters.selectedTitle}&resultId=${filters.id}`;
      } else {
        urlResponses = `https://psicologia-aplicada.com/quizz/psicologia-api/reports/getReports.php?quizz=${filters.selectedTitle}`;

        if (filters.selectedDate && filters.selectedDate !== "") {
          urlResponses += `&date=${filters.selectedDate}`;
          date = filters.selectedDate;
        }
        if (
          filters.selectedCompany &&
          filters.selectedCompany !== "" &&
          filters.selectedCompany !== "cualquiera"
        ) {
          urlResponses += `&company=${filters.selectedCompany}`;
          company = filters.selectedCompany;
        }
        if (filters.selectedLeader && filters.selectedLeader !== "cualquiera") {
          urlResponses += `&leader=${filters.selectedLeader}`;
          leader = filters.selectedLeader;
        }
      }
      const urlQuestions = `https://psicologia-aplicada.com/quizz/psicologia-api/quizz/getQuestions.php?id=${filters.selectedTitle}`;
      const endpoints = [urlResponses, urlQuestions];

      const responses = await Promise.all(
        endpoints.map((url) => axios.get(url))
      );
      const results = await Promise.all(
        responses.map((res) => {
          return res.data;
        })
      );

      const [reports, questions] = results;
      const preguntas = JSON.parse(questions[0].preguntas);
      if (reports.length === 1) {
        date = reports[0].date;
        company = reports[0].company;
        leader = reports[0].nombre;
        comments = reports[0].comments;
      }
      console.log(reports, questions);
      // Paso 1: Convertir strings de resultados en objetos y sumar los resultados
      const summedResults = reports.reduce((acc, report) => {
        const resultados = JSON.parse(report.resultados);
        resultados.forEach((result) => {
          if (!acc[result.id]) {
            acc[result.id] = result.options.map(() => 0);
          }
          result.options.forEach((optionCount, index) => {
            acc[result.id][index] += optionCount;
          });
        });
        return acc;
      }, {});

      // Paso 2: Combinar los resultados sumados con las preguntas
      const finalQuestions = preguntas.map((question) => {
        const responses = summedResults[question.id].map((count, index) => ({
          option: question.options[index],
          count: count,
        }));
        return {
          id: question.id.toString(),
          question: question.question,
          responses: responses,
        };
      });

      if (!filters.id) comments = "";

      const finalReport = {
        id: 1,
        name: reports[0].titulo,
        date: date,
        company: company,
        leader: leader,
        comments: comments,
        questions: finalQuestions,
      };

      setSurveyData(finalReport);
    };

    getData();
  }, []);

  return surveyData && surveyData.id ? <PdfDocument data={surveyData} /> : null;
};
export default PDFView;
