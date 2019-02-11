import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

const BOOKING_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100
  },
  Normal: {
    min: 100,
    max: 200
  },
  Expensive: {
    min: 200,
    max: 100000000
  }
};

const BookingsChart = ({ bookings }) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKING_BUCKETS) {
    const count = bookings.reduce((acc, b) => {
      if (
        b.event.price > BOOKING_BUCKETS[bucket].min &&
        b.event.price < BOOKING_BUCKETS[bucket].max
      ) {
        acc += 1;
      }
      return acc;
    }, 0);
    values.push(count);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      fillColor: 'rgba(220,220,220,0.5)',
      strokeColor: 'rgba(220,220,220,0.8)',
      highlightFill: 'rgba(220,220,220,0.75)',
      highlightStroke: 'rgba(220,220,220,1)',
      data: values
    });
    values = [...values];
    values[values.length - 1] = 0;
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <BarChart data={chartData} />
    </div>
  );
};

export default BookingsChart;
