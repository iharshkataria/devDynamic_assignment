// src/App.tsx
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import "chart.js/auto";
import dataFormat from "./data.json";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const ChartContainer = styled.div`
  width: 80%;
  margin-bottom: 20px;
`;

const TableContainer = styled.div`
  width: 80%;
  margin-bottom: 20px;
`;

const SummaryContainer = styled.div`
  width: 80%;
  margin-bottom: 20px;
`;

const FilterInput = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  font-size: 1rem;
`;

interface Data {
  label: string;
  value: number;
}

const App: React.FC = () => {
  const [data, setData] = useState<Data[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (dataFormat && dataFormat.data && dataFormat.data.AuthorWorklog) {
      const rows = dataFormat.data.AuthorWorklog.rows;
      const newData: Data[] = rows.map((row) => {
        const totalValue = row.totalActivity.reduce((acc, curr) => acc + parseInt(curr.value), 0);
        return { label: row.name, value: totalValue };
      });
      setData(newData);
    }
  }, []);

  const filteredData = data.filter((d) => d.label.toLowerCase().includes(filter.toLowerCase()));

  const chartData = {
    labels: filteredData.map((d) => d.label),
    datasets: [
      {
        label: "Dataset",
        data: filteredData.map((d) => d.value),
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const total = filteredData.reduce((sum, item) => sum + item.value, 0);
  const average = filteredData.length ? total / filteredData.length : 0;

  return (
    <Container>
      <Header>Developer Activity Dashboard</Header>
      <FilterInput
        type="text"
        placeholder="Filter by Developer Name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ChartContainer>
        <Line data={chartData} />
      </ChartContainer>
      <TableContainer>
        <table>
          <thead>
            <tr>
              <th>Developer</th>
              <th>Total Activity Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableContainer>
      <SummaryContainer>
        <p>Total: {total}</p>
        <p>Average: {average.toFixed(2)}</p>
      </SummaryContainer>
    </Container>
  );
};

export default App;
