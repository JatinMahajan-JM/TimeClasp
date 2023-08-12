"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// function getTasksCreatedToday(data: any) {
//   const today = new Date().toISOString().slice(0, 10); // Get the current date at midnight
//   const tasksCreatedToday = data.filter(
//     (task: any) => task.createdAt.slice(0, 10) === today
//   );

//   const formattedTasks = tasksCreatedToday.map((task: any) => ({
//     // hoursWorked: Math.round(task.timeWorked / 3600),
//     hoursWorked: (task.timeWorked / 3600).toFixed(2),
//     taskName: task.taskName,
//   }));

//   return formattedTasks;
// }

function getTaskHoursForDate(targetDate: string, dataArray: any) {
  const targetDateString = new Date(targetDate).toISOString().split("T")[0];

  const resultArray = [];

  for (const data of dataArray) {
    const tasks = data.tasks;
    const tasksWorkedOnTargetDate = tasks.filter((task: any) => {
      return task.timeWorkedToday > 0 && data.date === targetDateString;
    });

    for (const task of tasksWorkedOnTargetDate) {
      const hoursWorked = task.timeWorkedToday / 3600; // Convert seconds to hours
      resultArray.push({
        taskName: task.taskId.taskName,
        hoursWorked: Number(hoursWorked.toFixed(2)), // Rounded to 2 decimal places
      });
    }
  }

  return resultArray;
}

function transformData(inputArray: any) {
  return inputArray.map((item: any, index: number) => ({
    taskName: item.tasks[index].taskId.taskName,
    hoursWorked: (item.tasks[index].timeWorkedToday / 3600).toFixed(2), // Convert minutes to hours
  }));
}

// {
//   date: "....",
//   tasks: [{ taskId: { taskName: "...." }, timeWorkedToday: 3600 }];
// }

// Function to slice the label text
const sliceLabel = (label: string) => {
  const maxLength = 10; // Set the maximum length for the label
  return label.length > maxLength ? label.slice(0, maxLength) + "..." : label;
};

const BarChart = ({ dataDB }: { dataDB: any }) => {
  console.log(dataDB);
  const chartRef = useRef<SVGSVGElement | null>(null);
  let data = [
    { taskName: "Project A", hoursWorked: 6 },
    { taskName: "Project B", hoursWorked: 3.5 },
    { taskName: "Project C", hoursWorked: 8 },
    { taskName: "Project D", hoursWorked: 2 },
    { taskName: "Project E", hoursWorked: 5.5 },
  ];
  data = getTaskHoursForDate(new Date().toISOString().slice(0, 10), dataDB);
  console.log(data);

  useEffect(() => {
    if (chartRef.current) {
      const svg = d3.select(chartRef.current);
      const margin = { top: 20, right: 0, bottom: 20, left: 40 };
      const width = 800; // Set the width of the SVG
      const height = 300; // Set the height of the SVG

      svg.attr("viewBox", `0 0 ${width} ${height}`);

      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.taskName))
        .range([margin.left, width - margin.right])
        .padding(0.8); // change the width of bar

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.hoursWorked) as number])
        .nice()
        .range([height - margin.bottom, margin.top]);

      svg.selectAll("g").remove();

      const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          // .call(d3.axisBottom(x));
          .call(
            d3
              .axisBottom(x)
              .tickFormat((d) => sliceLabel(d))
              .tickSize(0)
              .tickPadding(8)
          );
      // g;
      // .attr("transform", `translate(0,${height - margin.bottom})`)
      // .call(d3.axisBottom(x)) // Hide default tick labels
      // .selectAll(".tick text")
      // .attr("text-anchor", "end") // Anchor the text at the end of the label
      // .attr("transform", "rotate(-10)") // Rotate the label 45 degrees counter-clockwise
      // .attr("dx", "-0.5em"); // Offset the label position

      const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(5));

      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);
      // const textGroup = svg.append("g").attr("class", "text-group");

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
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

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
        // .attr("class", "bar")
        .on("mouseenter", function (event, d) {
          d3.select(this).transition().duration(10).attr("opacity", ".35");
          // console.log(textGroup);
          // const textLabel = textGroup.select(`#text-${d.taskName}`);
          // textLabel.style("opacity", 1); // Make text label visible on hover
          const xPos =
            parseFloat(d3.select(this).attr("x")) + x.bandwidth() / 10;
          const yPos = parseFloat(d3.select(this).attr("y")) - 30;

          g.append("text")
            .attr("class", "hover-text")
            .attr("x", xPos)
            .attr("y", yPos)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .text(d.taskName + " : " + d.hoursWorked + " hours");
        })
        .on("mouseleave", function () {
          d3.select(this).transition().duration(10).attr("opacity", "1");
          svg.selectAll(".hover-text").remove();
        })
        // .on("mouseout", function (event, d) {
        //   console.log(d);
        //   const textLabel = textGroup.select(`#text-${d.taskName}`);
        //   textLabel.style("opacity", 0); // Make text label invisible on mouseout
        // })
        .transition() // Add transition for animation
        .duration(1000) // Animation duration in milliseconds
        .attr("y", (d) => y(d.hoursWorked)) // Set final y position based on the data
        .attr("height", (d) => height - margin.bottom - y(d.hoursWorked));

      // textGroup
      //   .selectAll("text")
      //   .data(data)
      //   .enter()
      //   .append("text")
      //   .attr("id", (d) => `text-${d.taskName}`)
      //   .attr("x", (d) => x(d.taskName)! + x.bandwidth() / 2)
      //   .attr("y", (d) => y(d.hoursWorked) - 10) // Adjust the position above the bar
      //   .attr("dy", "-0.5em")
      //   .attr("text-anchor", "middle")
      //   .text((d) => d.hoursWorked)
      //   .attr("visibility", "hidden") // Initially hide the text labels
      //   .attr("fill", "white");
    }
  }, [data]);

  return (
    <div className="w-full flex gap-6 flex-col">
      <h1>Task Engagement Today</h1>
      <svg
        ref={chartRef}
        height={300}
        className="m-auto w-full add-border px-4"
      ></svg>
    </div>
  );
};

export default BarChart;
