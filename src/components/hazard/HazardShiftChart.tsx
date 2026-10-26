import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface HazardShiftData {
  name: string;
  total: number;
}

interface HazardShiftChartProps {
  data: HazardShiftData[];
  totalReports: number;
  isLoading?: boolean;
}

const HazardShiftChart = ({
  data,
  totalReports,
  isLoading = false,
}: HazardShiftChartProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}{" "}
      <div className="mb-5 flex items-start justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h2 className="text-lg font-bold text-gray-800">
            Jumlah Temuan Berdasarkan Area Patrol{" "}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Perbandingan jumlah laporan hazard pada setiap titik patroli.
          </p>
        </div>
        <div className="shrink-0 rounded-lg bg-blue-50 px-3 py-2">
          <p className="text-xs text-gray-500">Total Temuan</p>
          <p className="text-xl font-bold text-[#003B73]">{totalReports}</p>
        </div>
      </div>
      {/* Chart */}
      {isLoading ? (
        <div className="flex h-[280px] items-center justify-center rounded-lg bg-gray-50">
          <p className="text-sm text-gray-500">Memuat data laporan...</p>
        </div>
      ) : data.length > 0 ? (
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 15,
                left: -15,
                bottom: 45,
              }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6B7280",
                  fontSize: 11,
                }}
                angle={-25}
                textAnchor="end"
                interval={0}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#6B7280",
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{ fill: "#F3F4F6" }}
                formatter={(value) => [`${value} temuan`, "Jumlah Temuan"]}
                labelFormatter={(label) => `Checkpoint: ${label}`}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="total"
                name="Jumlah Temuan"
                fill="#003B73"
                radius={[6, 6, 0, 0]}
                maxBarSize={65}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[280px] flex-col items-center justify-center rounded-lg bg-gray-50">
          <p className="font-semibold text-gray-700">Belum Ada Data Temuan</p>

          <p className="mt-1 max-w-sm text-center text-sm text-gray-500">
            Grafik akan menampilkan jumlah temuan setelah laporan hazard
            tersedia dan terhubung dengan checkpoint patroli.
          </p>
        </div>
      )}
      {/* Footer */}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400">
          Data dikelompokkan berdasarkan nama checkpoint tempat temuan
          dilaporkan.
        </p>
      </div>
    </div>
  );
};

export default HazardShiftChart;
