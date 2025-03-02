import { useState, useEffect } from "react";

type EngagementData = {
  year: number;
  data: { month: number; week: number; day: number; engagement: number }[];
};

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const daysInMonth = (month: number, year: number): number => {
  const isLeapYear =
    (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0); // leap year every 4 years

  switch (month) {
    case 0:  // January
    case 2:  // March
    case 4:  // May
    case 6:  // July
    case 7:  // August
    case 9:  // October
    case 11: // December
      return 31;
    case 3:  // April
    case 5:  // June
    case 8:  // September
    case 10: // November
      return 30;
    case 1:  // February
      return isLeapYear ? 29 : 28;
    default:
      return 30;
  }
};

const getFirstDayOfMonth = (month: number, year: number): number => {
  const date = new Date(year, month, 1);
  return date.getDay();
};

const getWeekOfMonth = (day: number, firstDayOfMonth: number): number => {
  const dayOfWeek = (day + firstDayOfMonth - 1) % 7;
  return Math.ceil((day + dayOfWeek) / 7);
};

export default function GithubHeatmap() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [hovered, setHovered] = useState<{ month: number; week: number; day: number } | null>(null);
  const [engagementData, setEngagementData] = useState<{ [year: number]: EngagementData }>({});

  const getColor = (value: number) => {
    if (value === 0) return "#E0E0E0"; // Light gray
    if (value >= 1) return "#A0D995";  // Light green
    if (value >= 4) return "#67C26B";  // Medium green
    if (value >= 9) return "#2A9639";  // Dark green
    return "#166D26";                  // Deepest green
  };

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/engagementHeatmap`);
        const data = await response.json();
        console.log("data", data);

        const formattedData: { [year: number]: EngagementData } = {};

        data.forEach((item: any) => {
          formattedData[item.year] = {
            year: item.year,
            data: item.data.map((entry: any) => {
              const firstDayOfMonth = getFirstDayOfMonth(entry.month, item.year);
              const weekOfMonth = getWeekOfMonth(entry.day, firstDayOfMonth);

              return {
                month: entry.month,
                week: weekOfMonth,
                day: entry.day,
                engagement: entry.engagement,
              };
            }),
          };
        });

        setEngagementData(formattedData);
      } catch (error) {
        console.error("Error fetching engagement data:", error);
      }
    };

    fetchEngagementData();
  }, []);

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
            {Object.keys(engagementData).map((year) => (
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
                  const day = index + 1;
                  const daysInCurrentMonth = daysInMonth(monthIndex, selectedYear);

                  if (day > daysInCurrentMonth) return null;

                  const engagement =
                    engagementData[selectedYear]?.data.find(
                      (d) => d.month === monthIndex && d.week === getWeekOfMonth(day, getFirstDayOfMonth(monthIndex, selectedYear)) && d.day === day
                    )?.engagement || 0;

                  return (
                    <div
                      key={`${month}-${day}`}
                      className="w-4 h-4 rounded-md transition-transform hover:scale-105 relative"
                      style={{ backgroundColor: getColor(engagement) }}
                      onMouseEnter={() => setHovered({ month: monthIndex, week: getWeekOfMonth(day, getFirstDayOfMonth(monthIndex, selectedYear)), day })}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {hovered?.month === monthIndex && hovered?.week === getWeekOfMonth(day, getFirstDayOfMonth(monthIndex, selectedYear)) && hovered?.day === day && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap z-50">
                          {`${day} ${months[hovered.month]} ${selectedYear}`}: {engagement} interactions
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
