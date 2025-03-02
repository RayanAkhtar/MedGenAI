import { useState } from "react";


const generateDummyData = (year: number) => {
  const data = [];
  for (let month = 0; month < 12; month++) {
    for (let week = 0; week < 5; week++) {
      for (let day = 0; day < 7; day++) {
        if (Math.random() > 0.8) continue;
        data.push({
          year,
          month,
          week,
          day,
          engagement: Math.floor(Math.random() * 10),
        });
      }
    }
  }
  return data;
};

const dummyEngagementData = {
  2022: generateDummyData(2022),
  2023: generateDummyData(2023),
  2024: generateDummyData(2024),
  2025: generateDummyData(2025),
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const daysInMonth = (month: number, year: number) => {
  const isLeapYear =
    (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0); // Leap year check

  switch (month) {
    case 0:     // January
    case 2:     // March
    case 4:     // May
    case 6:     // July
    case 7:     // August
    case 9:     // October
    case 11:    // December
      return 31;
    case 3:     // April
    case 5:     // June
    case 8:     // September
    case 10:    // November
      return 30;
    case 1:     // February
      return isLeapYear ? 29 : 28;
    default:
      return 30;
  }
};

export default function GithubHeatmap() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [hovered, setHovered] = useState<{ month: number; week: number; day: number } | null>(null);

  const getColor = (value: number) => {
    if (value === 0) return "#E0E0E0";  // Light gray
    if (value <= 2) return "#A0D995";   // Light green
    if (value <= 5) return "#67C26B";   // Medium green
    if (value <= 8) return "#2A9639";   // Dark green
    return "#166D26";                   // Deepest green
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 w-full">
      <h3 className="text-xl font-semibold text-black text-center mb-4">Engagement Heatmap</h3>

      <div className="mb-4 flex justify-center">
        <div className="relative">
          <select
            className="px-4 py-2 border border-gray-300 bg-gray-100 text-black text-sm font-medium rounded-lg shadow-sm cursor-pointer hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 transition-all"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Object.keys(dummyEngagementData).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <div className="flex gap-4 min-w-max px-2">
          {months.map((month, monthIndex) => (
            <div key={month} className="flex flex-col items-center">
              <span className="text-xs text-gray-600 font-semibold mb-1">{month}</span>

              <div className="grid grid-rows-7 grid-flow-col gap-1">
                {Array.from({ length: 35 }).map((_, index) => {
                  const week = Math.floor(index / 7);
                  const day = index % 7;

                  const daysInCurrentMonth = daysInMonth(monthIndex, selectedYear);

                  if (index >= daysInCurrentMonth) return null;

                  const engagement = dummyEngagementData[selectedYear].find(
                    (d) => d.month === monthIndex && d.week === week && d.day === day
                  )?.engagement || 0;

                  const calendarDay = index + 1;

                  return (
                    <div
                    key={`${month}-${week}-${day}`}
                    className="w-4 h-4 rounded-md transition-transform hover:scale-105 relative"
                    style={{ backgroundColor: getColor(engagement) }}
                    onMouseEnter={() => setHovered({ month: monthIndex, week, day })}
                    onMouseLeave={() => setHovered(null)}
                    >
                    {hovered?.month === monthIndex && hovered?.week === week && hovered?.day === day && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-50">
                        {`${calendarDay} ${months[hovered.month]} ${selectedYear}`}: {engagement} interactions
                        </div>
                    )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
