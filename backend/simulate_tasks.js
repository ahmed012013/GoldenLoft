const {
  addDays,
  addWeeks,
  addMonths,
  startOfDay,
  isBefore,
  isAfter,
  parseISO,
} = require('date-fns');

// Mock Data
const tasks = [
  {
    id: '1',
    title: 'Morning Feed',
    frequency: 'DAILY',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: null,
    time: '08:00',
  },
  {
    id: '2',
    title: 'Evening Feed',
    frequency: 'DAILY',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: null,
    time: '18:00',
  },
  {
    id: '3',
    title: 'Weekly Clean',
    frequency: 'WEEKLY',
    startDate: new Date('2024-01-01T00:00:00Z'),
    endDate: null,
    time: '12:00',
  },
];

const startStr = '2024-01-01T00:00:00Z';
const endStr = '2024-01-07T23:59:59Z';

function generateInstances(tasks, startStr, endStr) {
  const start = startOfDay(parseISO(startStr));
  const end = new Date(endStr); // Simple parse for end

  const instances = [];

  for (const task of tasks) {
    if (task.frequency === 'DAILY') {
      let currentDate = startOfDay(task.startDate);
      // Fast forward
      while (isBefore(currentDate, start)) {
        currentDate = addDays(currentDate, 1);
      }
      // Generate
      while (currentDate <= end) {
        instances.push({
          ...task,
          instanceDate: currentDate,
        });
        currentDate = addDays(currentDate, 1);
      }
    } else if (task.frequency === 'WEEKLY') {
      let currentDate = startOfDay(task.startDate);
      while (isBefore(currentDate, start)) {
        currentDate = addWeeks(currentDate, 1);
      }
      while (currentDate <= end) {
        instances.push({
          ...task,
          instanceDate: currentDate,
        });
        currentDate = addWeeks(currentDate, 1);
      }
    }
  }

  // Sort by date only (Current Implementation)
  instances.sort((a, b) => a.instanceDate.getTime() - b.instanceDate.getTime());

  return instances;
}

const result = generateInstances(tasks, startStr, endStr);

console.log('=== Instances Generated ===');
result.forEach((i) => {
  console.log(
    `${i.instanceDate.toISOString().split('T')[0]} - ${i.time} - ${i.title}`
  );
});

// Check sorting for same day
console.log('\n=== Checking Same Day Sorting ===');
const day1 = result.filter((i) =>
  i.instanceDate.toISOString().startsWith('2024-01-01')
);
const isSortedByTime =
  day1[0].time === '08:00' &&
  day1[1].time === '12:00' &&
  day1[2].time === '18:00';
console.log(
  'Day 1 Order:',
  day1.map((i) => i.time)
);
console.log('Sorted correctly by time?', isSortedByTime);
