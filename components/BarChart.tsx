"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const data = [
    { taskName: "Project A", hoursWorked: 6 },
    { taskName: "Project B", hoursWorked: 3.5 },
    { taskName: "Project C", hoursWorked: 8 },
    { taskName: "Project D", hoursWorked: 2 },
    { taskName: "Project E", hoursWorked: 5.5 },
  ];

  useEffect(() => {
    if (chartRef.current) {
      const svg = d3.select(chartRef.current);
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 400; // Set the width of the SVG
      const height = 300; // Set the height of the SVG

      svg.attr("viewBox", `0 0 ${width} ${height}`);

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.taskName))
        .range([margin.left, width - margin.right])
        .padding(0.8);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.hoursWorked) as number])
        .nice()
        .range([height - margin.bottom, margin.top]);

      svg.selectAll("g").remove();

      const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x));

      const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(5));

      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);

      // Use a color scale to assign different colors to each bar
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      // svg
      //   .append("g")
      //   .selectAll("rect")
      //   .data(data)
      //   .join("rect")
      //   .attr("x", (d) => x(d.taskName) as number)
      //   .attr("y", (d) => y(d.hoursWorked))
      //   .attr("width", x.bandwidth())
      //   .attr("height", 0)
      //   .transition()
      //   .duration(1000)
      //   .attr("height", (d) => y(0) - y(d.hoursWorked))
      //   .attr("rx", 5)
      //   .attr("ry", 2)
      //   .attr("class", "bar")
      //   .attr("fill", (d) => colorScale(d.taskName))

      svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(d.taskName) as number)
        .attr("y", height - margin.bottom) // Set initial y to the bottom of the chart
        .attr("width", x.bandwidth())
        .attr("height", 0) // Initial height set to 0 for animation
        .attr("rx", 5)
        .attr("ry", 2)
        .attr("class", "bar")
        .attr("fill", (d) => colorScale(d.taskName)) // Set the fill color based on the taskName
        .attr("class", "bar")
        .transition() // Add transition for animation
        .duration(1000) // Animation duration in milliseconds
        .attr("y", (d) => y(d.hoursWorked)) // Set final y position based on the data
        .attr("height", (d) => height - margin.bottom - y(d.hoursWorked));
    }
  }, [data]);

  return <svg ref={chartRef} width={400} height={300}></svg>;
};

export default BarChart;
