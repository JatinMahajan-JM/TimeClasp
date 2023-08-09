"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
  xAxisDynamic: string;
  yAxisDynamic: number;
}

interface Props {
  dataDB: DataPoint[];
}

const SplineChart: React.FC<Props> = ({ dataDB }) => {
  const data = [
    { xAxisDynamic: "Monday", yAxisDynamic: 4 },
    { xAxisDynamic: "Tuesday", yAxisDynamic: 6 },
    { xAxisDynamic: "Wednesday", yAxisDynamic: 7 },
    { xAxisDynamic: "Thursday", yAxisDynamic: 5 },
    { xAxisDynamic: "Friday", yAxisDynamic: 8 },
    { xAxisDynamic: "Saturday", yAxisDynamic: 3 },
    { xAxisDynamic: "Sunday", yAxisDynamic: 2 },
  ];
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = chartRef.current.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.xAxisDynamic))
      .range([0, width])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.yAxisDynamic)!])
      .nice()
      .range([height, 0]);

    const area = d3
      .area<DataPoint>()
      .x((d) => xScale(d.xAxisDynamic)!)
      .y0(yScale(0)) // Set the baseline to yScale(0) to create the area below the curve
      .y1((d) => yScale(d.yAxisDynamic))
      .curve(d3.curveNatural);

    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.xAxisDynamic)!)
      .y((d) => yScale(d.yAxisDynamic)!)
      .curve(d3.curveNatural);

    // After defining the 'line' generator
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    gradient
      .append("stop")
      .attr("offset", "20%")
      .attr("stop-color", "#1d1f25")
      .attr("stop-opacity", 0.2);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#bd6cfd")
      .attr("stop-opacity", 0.2);
    //   #1d1f25

    // Rest of your code...

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    chart
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#bd6cfd")
      .attr("stroke-width", 2)
      .attr("d", line);

    chart
      .append("path")
      .datum(data)
      .attr("fill", "url(#area-gradient)") // Apply the gradient to fill the area
      .attr("d", area); // 'area' should be defined as d3.area() using the same x and y scales

    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    chart.append("g").call(d3.axisLeft(yScale));
  }, [data]);

  return <svg ref={chartRef} className="m-auto w-full" height="300"></svg>;
};

export default SplineChart;
