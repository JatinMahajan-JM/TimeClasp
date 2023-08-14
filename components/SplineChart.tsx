"use client";

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface DataPoint {
  xAxisDynamic: string;
  yAxisDynamic: number;
}

interface Props {
  dataDB: DataPoint[];
}

function generateChartData(
  dataArray: [{ [key: string]: any }],
  startDate: string,
  endDate: string
) {
  const result = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  while (start <= end) {
    const xAxisDynamic = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    // let yAxisDynamic = 0;
    let yAxisDynamic = Number(
      (
        dataArray.filter(
          (item: any) => item.date === start.toISOString().substring(0, 10)
        )[0]?.totalTimeWorked / 3600
      ).toFixed(2)
    );
    if (!yAxisDynamic) yAxisDynamic = 0;

    result.push({ xAxisDynamic, yAxisDynamic });

    start.setDate(start.getDate() + 1);
  }

  return result;
}

function calculateDateRange(rangeInDays: number) {
  const today = new Date();
  const endDate = today.toISOString().substring(0, 10); // Current date

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - rangeInDays + 1); // Calculate start date

  return { startDate: startDate.toISOString().substring(0, 10), endDate };
}

// function generateChartDataA(data: any) {
//   const currentDate = new Date();
//   const currentMonth = currentDate.getMonth();
//   const chartData = Array.from({ length: 31 }, (_, day) => {
//     const xAxisDynamic = day + 1;
//     const filteredTasks = data.filter((task: any) => {
//       const taskDueDate = new Date(task.dueDate);
//       return (
//         taskDueDate.getMonth() === currentMonth &&
//         taskDueDate.getDate() === xAxisDynamic
//       );
//     });
//     // const hours = Math.floor(totalSeconds / 3600);
//     const yAxisDynamic = filteredTasks.reduce(
//       (totalHours: number, task: any) =>
//         totalHours + (task.timeWorked / 3600).toFixed(1),
//       0
//     );
//     return { xAxisDynamic, yAxisDynamic };
//   });
//   return chartData;
// }

const SplineChart = ({ dataDB }: { dataDB: any }) => {
  const [range, setRange] = useState(7);
  const [startDateState, setStartDate] = useState();
  const [endDateState, setEndDate] = useState();
  const [ticks, setTicks] = useState(1);
  const { startDate, endDate } = calculateDateRange(range);
  const chartData = generateChartData(dataDB, startDate, endDate);
  //);
  //   //
  let data = [
    { xAxisDynamic: "Monday", yAxisDynamic: 4 },
    { xAxisDynamic: "Tuesday", yAxisDynamic: 6 },
    { xAxisDynamic: "Wednesday", yAxisDynamic: 7 },
    { xAxisDynamic: "Thursday", yAxisDynamic: 5 },
    { xAxisDynamic: "Friday", yAxisDynamic: 8 },
    { xAxisDynamic: "Saturday", yAxisDynamic: 3 },
    { xAxisDynamic: "Sunday", yAxisDynamic: 2 },
  ];
  data = chartData;
  const chartRef = useRef<SVGSVGElement | null>(null);

  const [activeBtn, setActive] = useState(true);
  const handleDaysClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const classList = target.classList;
    if (classList.contains("30-days")) {
      setRange(30);
      setTicks(5);
      setActive(false);
    }
    if (classList.contains("7-days")) {
      setTicks(1);
      setRange(7);
      setActive(true);
    }
    // const itemId = target.classList.contains(""); // Assuming you set this attribute on the element
    // if (itemId) {
    //   //
    //   // Handle the click for the specific item
    // }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = chartRef.current.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    // Inside the useEffect
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
    //

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
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.xAxisDynamic)!)
      .attr("cy", (d) => yScale(d.yAxisDynamic))
      .attr("r", 0)
      // .attr("r", 4)
      .attr("fill", "#bd6cfd")
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Hours: ${d.yAxisDynamic}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition() // Add transition here
      .duration(500) // Transition duration in milliseconds
      .attr("r", 4);

    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      // .call(d3.axisBottom(xScale));
      .transition() // Add transition here
      .duration(500)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues(xScale.domain().filter((d, i) => i % ticks === 0))
      );
    // .call(xAxis);

    chart
      .append("g")
      .transition() // Add transition here
      .duration(500)
      .call(d3.axisLeft(yScale));
  }, [data]);

  // const [activeBtn, setActive] = useState(true)
  // return <svg ref={chartRef} className="m-auto w-full" height="300"></svg>;
  return (
    <div className="w-full flex gap-6 flex-col">
      <h1>Hours Committed in Recent Days</h1>
      <div className="add-border md:px-4 py-4">
        <div className="md:flex justify-between mb-2 py-2 pr-6 block px-4">
          <div className="text-sm md:mt-0 mb-4">Hours/Range</div>
          <div className="flex gap-2" onClick={handleDaysClick}>
            <button
              className={` p-2 7-days transition-all add-border ${
                activeBtn ? "bg-secodaryBtn" : ""
              }`}
            >
              Last 7 days
            </button>
            <button
              className={`p-2 30-days transition-all add-border ${
                !activeBtn ? "bg-secodaryBtn" : ""
              }`}
            >
              Last 30 days
            </button>
          </div>
        </div>
        <svg ref={chartRef} height={300} className="m-auto w-full"></svg>
      </div>
    </div>
  );
};

export default SplineChart;
