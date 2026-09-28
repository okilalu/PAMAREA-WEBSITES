import {
  ArrowRight,
  ArrowRight2,
  Calendar,
  DocumentDownload,
  Notification,
  Sun,
  UserOctagon,
} from "iconsax-react";
import React from "react";

const Dashboard = () => {
  const cardHazard = [
    {
      alert: "Critical",
      time: "14.12 WIB",
      title: "Kawat Duri Pagar Pembatas Sektor Barat Terputus",
      guard: "Dimas",
      location: "GI Gambir - Pagar Luar Barat (Zona 1)",
      note: "Potensi akses masuk liar di dekat tiang transmisi no. 4. Telah dipasang pita pengaman sementara.",
    },
    {
      alert: "Critical",
      time: "14.12 WIB",
      title: "Kawat Duri Pagar Pembatas Sektor Barat Terputus",
      guard: "Dimas",
      location: "GI Gambir - Pagar Luar Barat (Zona 1)",
      note: "Potensi akses masuk liar di dekat tiang transmisi no. 4. Telah dipasang pita pengaman sementara.",
    },
    {
      alert: "Critical",
      time: "14.12 WIB",
      title: "Kawat Duri Pagar Pembatas Sektor Barat Terputus",
      guard: "Dimas",
      location: "GI Gambir - Pagar Luar Barat (Zona 1)",
      note: "Potensi akses masuk liar di dekat tiang transmisi no. 4. Telah dipasang pita pengaman sementara.",
    },
  ];
  return (
    <div className="min-h-screen ">
      <div className="px-6 flex justify-between breadcrumbs text-sm bg-white border-b border-gray-200 h-14">
        <ul className="mt-2">
          <li>
            <a className="text-gray-700 font-semibold">Dashboard</a>
          </li>
          <li>
            <a className="text-gray-700 font-semibold">Command Center</a>
          </li>
          <li className="text-gray-700 font-semibold">Add Document</li>
        </ul>
        <div className="flex gap-2">
          <div className="bg-black rounded-full px-2 py-1">
            <p className="text-white text-lg font-bold mt-0.5">LO</p>
          </div>
          <div>
            <h2 className="text-gray-800 text-sm font-semibold">Lalu Oki</h2>
            <p className="text-gray-600 text-xs tracking-wider">
              Chief Patrol Supervisor
            </p>
          </div>
        </div>
      </div>
      <div className="px-6">
        {/* Title */}
        <div className="bg-white shadow-sm rounded-lg p-4 mt-3 h-32">
          <div className="grid grid-cols-2 gap-5">
            <div className="">
              <h1 className="text-gray-800 font-bold text-2xl">
                {" "}
                Executive Overview - Gardu Induk (GI){" "}
              </h1>
              <p className="text-gray-600 text-sm">
                Real-time security tour compliance and operational perimeter
                surveillence
              </p>
            </div>

            <div className="mt-5">
              <div className="flex gap-1 mb-2">
                <div className="bg-gray-100 rounded-sm px-4 py-1.5 flex items-center gap-1">
                  <Sun size={17} color="gray" />
                  <p className="text-gray-800 text-sm font-semibold">
                    Shift Pagi (07:00 - 15:00)
                  </p>
                </div>
                <div className="bg-gray-200 rounded-sm px-4 py-1.5 flex items-center gap-1">
                  <Calendar color="gray" size={17} variant="Bulk" />
                  <p className="text-gray-800 text-sm font-semibold">Today</p>
                </div>
              </div>
              <button className="flex gap-2 bg-blue-900 px-4 py-1.5 rounded-sm">
                <DocumentDownload size={17} color="white" />
                <p className="text-xs font-semibold">Export Log</p>
              </button>
            </div>
          </div>
        </div>
        {/* Title */}

        {/* Card */}
        <div className="grid grid-cols-3 mt-5 gap-2">
          <div className="bg-white shadow-sm rounded-md p-2 h-36">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-800">Total Patrol Today</h1>
              <div className="bg-blue-100 rounded-lg p-2">
                <UserOctagon size={22} color="blue" />
              </div>
            </div>
            <div className="flex gap-1 mt-7">
              <h1 className="font-bold text-xl text-gray-800">42</h1>
              <p className="text-sm text-gray-600 self-end">Officers</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <h3 className="text-gray-500 text-sm">Target :</h3>
                <p className="text-gray-500 text-sm">40 required</p>
              </div>
              <div className="bg-blue-100 rounded-lg px-2 py-1">
                <p className="text-gray-500 text-sm">+3 Shift B</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-md p-2 h-36">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-800">Active Patrol Checkpoints</h1>
              <div className="bg-blue-100 rounded-lg p-2">
                <UserOctagon size={22} color="blue" />
              </div>
            </div>
            <div className="flex gap-1 mt-5">
              <h1 className="font-bold text-xl text-gray-800">128</h1>
              <p className="text-sm text-gray-600 self-end">Points</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <h3 className="text-gray-500 text-sm">Target :</h3>
                <p className="text-gray-500 text-sm">40 required</p>
              </div>
              <div className="bg-blue-100 rounded-lg px-2 py-1">
                <p className="text-gray-500 text-sm">+3 Shift B</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-sm rounded-md p-2 h-36">
            <div className="flex justify-between items-center">
              <h1 className="text-gray-800">Active Out-Of-Radius Alert</h1>
              <div className="bg-blue-100 rounded-lg p-2">
                <UserOctagon size={22} color="blue" />
              </div>
            </div>
            <div className="flex gap-1 mt-5">
              <h1 className="font-bold text-xl text-gray-800">2</h1>
              <p className="text-sm text-gray-600 self-end">Incident</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <h3 className="text-gray-500 text-sm">Target :</h3>
                <p className="text-gray-500 text-sm">40 required</p>
              </div>
              <div className="bg-blue-100 rounded-lg px-2 py-1">
                <p className="text-gray-500 text-sm">+3 Shift B</p>
              </div>
            </div>
          </div>
        </div>
        {/* Card */}

        {/* Table */}
        <div className="flex gap-5">
          <div className="mt-5 bg-white p-4 shadow-sm rounded-lg w-[60%]">
            <div className="bg-gray-200 rounded-lg px-4 py-2 flex items-center justify-between">
              <div className="">
                <h2 className="text-gray-800 font-bold">
                  Recent Patrol Executions
                </h2>
                <p className="text-gray-600 text-xs tracking-wider">
                  Last verified checkpoints across substation perimeters
                </p>
              </div>
              <button className="flex items-center justify-center">
                <p className="text-xs tracking-wider text-blue-800 font-semibold">
                  View All Logs
                </p>
                <ArrowRight2 size={17} color="blue" />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Guard Personnel
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Checkpoint Node
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        NFC Status
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        GPS Status
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                        Timestamp
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    <tr className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Cy Ganderton
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        Checkpoint A - Main Gate
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          Verified
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          On Site
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        28 Sep 2026, 20:45
                      </td>
                    </tr>

                    <tr className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Hart Hagerty
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        Checkpoint B - Parking
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          Verified
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                          Off Site
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        28 Sep 2026, 20:32
                      </td>
                    </tr>

                    <tr className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Brice Swyre
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        Checkpoint C - Warehouse
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700">
                          Pending
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          On Site
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        28 Sep 2026, 20:18
                      </td>
                    </tr>

                    <tr className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Marjy Ferencz
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        Checkpoint D - Back Gate
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          Verified
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          On Site
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        28 Sep 2026, 19:57
                      </td>
                    </tr>

                    <tr className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        Yancy Tear
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        Checkpoint E - Lobby
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                          Failed
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          On Site
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        28 Sep 2026, 19:41
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-white p-4 shadow-sm rounded-lg w-[40%]">
            <div className="bg-gray-200 rounded-lg p-3 flex items-center gap-2">
              <Notification size={20} color="red" />
              <h2 className="text-gray-800 font-semibold">
                Critical Findings Feed
              </h2>
              <div className="flex gap-1 bg-red-800 rounded-2xl px-2 py-0.5 ml-4">
                <p className="text-xs">3</p>
                <p className="text-xs">Urgent</p>
              </div>
            </div>

            {/* Card hazard */}
            {cardHazard.map((item) => (
              <div className="bg-gray-200 rounded-lg p-3 my-5">
                <div className="flex items-center justify-between">
                  <div className="bg-red-800 rounded-sm px-2">
                    <p className="text-sm tracking-wider font-semibold">
                      {item.alert}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 tracking-wide">
                    {item.time}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-gray-800 font-semibold text-sm">
                    {item.title}
                  </p>
                  <p className="text-gray-600 text-xs">
                    Guard:{" "}
                    <span className="text-xs font-semibold text-gray-800">
                      {item.guard}
                    </span>
                  </p>

                  <p className="text-gray-600 text-xs">
                    Loc:{" "}
                    <span className="text-xs font-semibold text-gray-800">
                      {item.location}
                    </span>
                  </p>

                  <div className="bg-white p-2 rounded-xs mt-2">
                    <p className="text-gray-600 text-xs tracking-wide">
                      {item.note}
                    </p>
                  </div>

                  <div className="mt-3 flex w-full justify-end">
                    <button className="flex items-center justify-center gap-1 rounded-lg bg-[#FED400] px-3 py-1">
                      <span className="text-xs font-semibold text-gray-800">
                        Action / Assign
                      </span>
                      <ArrowRight size={13} color="gray" className="mt-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* Card hazard */}
          </div>
        </div>
        {/* Table */}
      </div>
    </div>
  );
};

export default Dashboard;
