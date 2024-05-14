import { useEffect, useState } from "react";
import SurveyTabs from "../../components/Reportes/SurveyTabs";
import { useLocation } from "react-router-dom";
import axios from "axios";

const DynamicView = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get("id");
  const selectedTitle = query.get("selectedTitle") || null;

  const filters = {
    id,
    selectedTitle,
  };

  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const urls = id
        .split(",")
        .map(
          (id) =>
            `https://psicologia-aplicada.com/quizz/psicologia-api/reports/getReports.php?quizz=${filters.selectedTitle}&resultId=${id}`
        );
      const urlQuestions = `https://psicologia-aplicada.com/quizz/psicologia-api/quizz/getQuestions.php?id=${filters.selectedTitle}`;
      const endpoints = [urlQuestions, ...urls];
      const responses = await Promise.all(
        endpoints.map((url) => axios.get(url))
      );
      const results = await Promise.all(
        responses.map((res) => {
          return res.data;
        })
      );

      const questionsData = results[0]; // La primera respuesta es de urlQuestions
      const reportsData = results.slice(1); // Las siguientes respuestas son de las URLs de reports

      const parsedQuestions = JSON.parse(questionsData[0].preguntas);
      console.log(parsedQuestions, reportsData.flat());
      setQuestions(parsedQuestions);
      setResponses(reportsData.flat());
    };

    getData();
  }, []);

  return questions.length > 0 ? (
    <SurveyTabs questions={questions} responses={responses} />
  ) : null;
};
export default DynamicView;
