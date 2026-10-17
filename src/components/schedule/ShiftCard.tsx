import {
  ArrowCircleRight2,
  //   DocumentCloud,
  Thorchain,
  TickSquare,
} from "iconsax-react";

import ShiftStatus from "./ShiftStatus";
import OfficerInfo from "./OfficerInfo";
import ShiftActions from "./ShiftActions";

const ShiftCard = ({ shift }) => {
  const isActive = shift.statusType === "active";

  const progress = shift.patrol
    ? Math.round((shift.patrol.current / shift.patrol.total) * 100)
    : 0;

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-sm mt-5 ${
        isActive ? "border-2 border-[#003B73]" : ""
      }`}
    >
      {/* ================= HEADER SHIFT ================= */}
      <div
        className={`flex items-center justify-between rounded-lg px-4 py-1 ${
          isActive ? "bg-[#F2F6FF]" : "bg-gray-100"
        }`}
      >
        <div className="flex items-center">
          <div
            className={`shadow-sm p-2 rounded-lg ${
              isActive ? "bg-[#00529C]" : "bg-gray-200"
            }`}
          >
            <p
              className={`font-semibold text-xs ${
                isActive ? "text-white" : "text-gray-500"
              }`}
            >
              {String(shift.id).padStart(2, "0")}
            </p>
          </div>

          <div className="ml-3">
            <div className="flex items-center">
              <p className="text-gray-800 font-semibold text-sm">
                {shift.shift}
              </p>

              {isActive && (
                <div className="bg-[#FED400] rounded-sm px-2 py-0.5 ml-2">
                  <p className="uppercase text-xs font-semibold">
                    Live Operasional
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-500 text-xs">{shift.time}</p>
          </div>
        </div>

        <ShiftStatus
          status={shift.status}
          statusDetail={shift.statusDetail}
          statusType={shift.statusType}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex items-center justify-between mt-3">
        <OfficerInfo officer={shift.officer} />

        {/* SHIFT AKTIF */}
        {isActive && shift.patrol && (
          <div className="ml-5 w-[70%]">
            <div className="flex items-center justify-between mb-0.5">
              <p className="uppercase text-gray-500 font-semibold text-xs mb-1">
                {shift.patrol.title}
              </p>

              <p className="uppercase text-[#00529C] font-semibold text-xs mb-1 ml-3 px-1">
                {shift.patrol.current} / {shift.patrol.total} Titik ({progress}
                %)
              </p>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00529C] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-1 bg-gray-100 rounded-sm px-2 py-3 mt-1">
              <div className="flex items-center gap-1">
                <ArrowCircleRight2 size={15} color="#003B73" />

                <p className="text-sm tracking-wider text-gray-500">
                  Titik Selanjutnya
                </p>
              </div>

              <p className="text-gray-500 font-semibold text-sm">
                {shift.patrol.nextPoint}
              </p>
            </div>
          </div>
        )}

        {/* SHIFT SELESAI / TERJADWAL */}
        {!isActive && shift.inspection && (
          <div>
            <p className="uppercase text-gray-500 font-semibold text-xs mb-1">
              {shift.inspection.title}
            </p>

            <div className="flex items-center gap-1 mb-1">
              {shift.statusType === "scheduled" ? (
                <Thorchain size={15} color="#003B73" />
              ) : (
                <TickSquare size={15} color="#003B73" />
              )}

              <p className="text-xs tracking-wider">
                {shift.inspection.detail}
              </p>
            </div>

            <p className="text-gray-500 font-semibold text-xs">
              {shift.inspection.time}
            </p>
          </div>
        )}

        <ShiftActions actions={shift.actions} />
      </div>
    </div>
  );
};

export default ShiftCard;
