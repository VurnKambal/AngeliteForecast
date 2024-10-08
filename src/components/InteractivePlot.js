import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

const InteractivePlot = ({ data, yearLevel, major, modelName }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  console.log("Received data:", data);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    // Transform the data into the format Chart.js expects
    const transformData = (inputData) => {
      return inputData.map(item => ({
        x: new Date(item.Date),
        y: item[yearLevel] || item["Prediction"] || 0
      }));
    };

    const datasets = [
      {
        label: 'Actual',
        data: transformData(data.actual),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 5,
      },
      {
        label: 'Train Prediction',
        data: transformData(data.trainPrediction),
        borderColor: 'rgb(255, 159, 64)',
        borderDash: [5, 5],
        tension: 0.1,
        pointRadius: 5,
      },
      {
        label: 'Forecast',
        data: transformData(data.testPrediction),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [3, 3],
        tension: 0.1,
        pointRadius: 5,
      },
    ];

    console.log("Transformed datasets:", datasets);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${yearLevel.replaceAll('_', ' ')} Enrollment for ${major.replaceAll('_', ' ')}`,
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy',
            },
            pan: {
              enabled: true,
              mode: 'xy',
            },
          },
          tooltip: {
            callbacks: {
              title: function(tooltipItems) {
                const date = new Date(tooltipItems[0].parsed.x);
                const year = date.getFullYear();
                const month = date.getMonth();
                const semester = month >= 5 && month < 10 ? '1st' : '2nd';
                const academicYear = month >= 5 ? year : year - 1;
                return `${semester} Semester ${academicYear}-${academicYear + 1}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              displayFormats: {
                month: 'MMM yyyy',
              },
            },
            title: {
              display: true,
              text: 'Date',
            },
            ticks: {
              callback: function(value, index, values) {
                const date = new Date(value);
                const month = date.getMonth();
                const year = date.getFullYear();
                if (month === 5) { // June
                  return `1st Sem ${year}-${year+1}`;
                } else if (month === 10) { // November
                  return `2nd Sem ${year}-${year+1}`;
                }
              }
            },
          },
          y: {
            title: {
              display: true,
              text: `${yearLevel} Enrollment`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, yearLevel, major, modelName]);

  return <canvas ref={chartRef} style={{ width: '100%', height: '30em' }} />;
};

export default InteractivePlot;
