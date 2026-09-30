import { Location, UserAdd } from "iconsax-react";
import React from "react";

const QuestionBuilder = () => {
  return (
    <div className="min-h-screen">
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

      <div className="px-6 pb-6">
        <div className=" mt-5 grid grid-cols-2 gap-5">
          <div>
            <div className="flex items-center gap-1">
              <div className="bg-[#00529C]  px-1 py-3 h-[1px] rounded-xs" />
              <p className="font-bold text-2xl tracking-wide">
                Checkpoint Inspection & K3 Question Builder
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Susun urutan pertanyaan inspeksi keselamatan kerja (K3) dan
              verifikasi fisik keamanan per titik checkpoint patroli gardu induk
              secara adaptif.
            </p>
          </div>
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => console.log("Click")}
              className="bg-[#FED400] shadow-sm rounded-lg p-3 cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <div className="bg-[#FED400] p-1 rounded-lg">
                  <UserAdd size={17} color="#6F5C00" />
                </div>
                <div className="ml-1">
                  <p className="text-gray-900 text-sm font-semibold">
                    Tambah Pertanyaan Baru
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-5 bg-gray-100 w-[50%] rounded-lg flex items-center px-3 py-2">
          <Location size={17} color="gray" />
          <div className="ml-2">
            <p className="text-gray-500 text-xs">Titik Checkpoint Terpilih :</p>
            <p className="font-semibold text-gray-500 text-xs">
              [PP-GMB-03] Gedung Kontrol & Relay Panel (Indoor)
            </p>
          </div>

          <div className="bg-[#D5E3FF] rounded-lg px-3 py-1 ml-4">
            <p className="font-semibold text-xs text-[#001B3B]">
              4 Pertanyaan Aktif
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionBuilder;
