import { useState, useEffect } from "react";

type EngagementData = {
  year: number;
  data: { month: number; week: number; day: number; engagement: number }[];
};

type ApiResponseItem = {
  year: number;
  data: { month: number; week: number; day: number; engagement: number }[];
};

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const daysInMonth = (month: number, year: number): number => {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

  switch (month) {
    case 1: return isLeapYear ? 29 : 28; // Feb
    case 3: case 5: case 8: case 10: return 30; // Apr, Jun, Sep, Nov
    default: return 31; // Jan, Mar, May, Jul, Aug, Oct, Dec
  }
};

const getFirstDayOfMonth = (month: number, year: number): number => {
  return new Date(year, month - 1, 1).getDay(); // Months start from 1, not 0 in the API
};

const getWeekOfMonth = (day: number, firstDayOfMonth: number): number => {
  const dayOfWeek = (day + firstDayOfMonth - 1) % 7;
  return Math.ceil((day + dayOfWeek) / 7);
};

const getColor = (value: number) => {
  // Grey
  if (value === 0) return "#E0E0E0";
  
  // Green from light to dark green
  if (value <= 1) return "#D3F4C2";
  if (value <= 2) return "#A0D995";
  if (value <= 3) return "#82D075";
  if (value <= 5) return "#67C26B";
  if (value <= 10) return "#4D9F56";
  if (value <= 15) return "#3B9C47";
  if (value <= 20) return "#2A9639";
  if (value <= 30) return "#218B32";
  if (value <= 50) return "#1A7A2D";
  return "#166D26";
};

export default function GithubHeatmap() {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [hovered, setHovered] = useState<{ month: number; week: number; day: number } | null>(null);
  const [engagementData, setEngagementData] = useState<{ [year: number]: EngagementData }>({});

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        const response = await fetch(`/api/admin/engagementHeatmap`);
        const data: ApiResponseItem[] = await response.json();
        console.log("data", data);

        const formattedData: { [year: number]: EngagementData } = {};

        data.forEach((item: ApiResponseItem) => {
          formattedData[item.year] = {
            year: item.year,
            data: item.data.map((entry) => {
              const monthIndex = entry.month - 1;
              const firstDayOfMonth = getFirstDayOfMonth(entry.month, item.year);
              const weekOfMonth = getWeekOfMonth(entry.day, firstDayOfMonth);

              return {
                month: monthIndex,
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

      <div className="mb-4 flex justify-center gap-2 flex-wrap">
        {Object.keys(engagementData).map((year) => (
          <button
            key={year}
            className={`px-4 py-2 font-medium rounded-lg shadow-sm transition-all ${
              selectedYear === Number(year)
                ? "bg-blue-500 text-white text-lg px-6 py-3"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
            }`}
            onClick={() => setSelectedYear(Number(year))}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="w-full flex justify-center sm:justify-start overflow-x-auto pl-6 pr-6 pt-10">
        <div className="flex gap-4 min-w-full sm:min-w-max">
          {months.map((month, monthIndex) => (
            <div key={month} className="flex flex-col items-center">
              <span className="text-xs text-gray-600 font-semibold mb-1">{month}</span>

              <div className="grid grid-rows-7 grid-flow-col gap-1">
                {Array.from({ length: 35 }).map((_, index) => {
                  const day = index + 1;
                  const daysInCurrentMonth = daysInMonth(monthIndex + 1, selectedYear); // Adjust for 1-based input

                  if (day > daysInCurrentMonth) return null;

                  const engagement =
                    engagementData[selectedYear]?.data.find(
                      (d) =>
                        d.month === monthIndex &&
                        d.week === getWeekOfMonth(day, getFirstDayOfMonth(monthIndex + 1, selectedYear)) &&
                        d.day === day
                    )?.engagement || 0;

                  return (
                    <div
                      key={`${month}-${day}`}
                      className="w-4 h-4 rounded-md transition-transform hover:scale-105 relative"
                      style={{ backgroundColor: getColor(engagement) }}
                      onMouseEnter={() =>
                        setHovered({
                          month: monthIndex,
                          week: getWeekOfMonth(day, getFirstDayOfMonth(monthIndex + 1, selectedYear)),
                          day,
                        })
                      }
                      onMouseLeave={() => setHovered(null)}
                    >
                      {hovered?.month === monthIndex &&
                        hovered?.week === getWeekOfMonth(day, getFirstDayOfMonth(monthIndex + 1, selectedYear)) &&
                        hovered?.day === day && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded-md shadow-lg z-50 whitespace-nowrap">
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
