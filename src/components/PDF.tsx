import PieChart from "./PieChart";

const PdfDocument = ({ data }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={styles.document}>
      <button style={styles.printButton} onClick={handlePrint}>
        Imprimir
      </button>
      <h1 style={styles.title}>{data.title}</h1>
      {data.company && <h2 style={styles.subtitle}>{data.company}</h2>}
      {data.leader && <h2 style={styles.subtitle}>{data.leader}</h2>}
      {data.questions.map((question) => (
        <div key={question.id} style={styles.section}>
          <h2 style={styles.title}>{question.question}</h2>
          <div style={styles.chartContainer}>
            <PieChart key={question.id} responses={question.responses} />
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  document: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 4,
  },
  chartContainer: {
    width: "80%", // Ajusta el ancho según sea necesario
    margin: "0 auto", // Centra el gráfico
    maxWidth: "600px", // Ancho máximo para dispositivos más grandes
  },
  printButton: {
    margin: "10px",
    padding: "8px 16px",
    fontSize: "16px",
    "@media print": {
      display: "none",
    },
  },
};

export default PdfDocument;
