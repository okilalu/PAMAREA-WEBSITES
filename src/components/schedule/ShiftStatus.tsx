import { TickCircle, TimerStart } from "iconsax-react";

const ShiftStatus = ({ status, statusDetail, statusType }) => {
  if (statusType === "active") {
    return (
      <div className="bg-white shadow-sm rounded-xl px-2 py-0.5 flex items-center">
        <div className="w-2 h-2 rounded-full animate-ping bg-yellow-400" />

        <p className="text-xs text-gray-700 font-semibold ml-2">{status}</p>
      </div>
    );
  }

  if (statusType === "completed") {
    return (
      <div className="bg-gray-200 shadow-sm rounded-xl px-2 py-0.5 flex items-center">
        <TickCircle size={15} color="#003B73" />

        <p className="text-xs text-gray-700 font-semibold ml-1">
          {status} ({statusDetail})
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 shadow-sm rounded-xl px-2 py-0.5 flex items-center">
      <TimerStart size={15} color="#003B73" />

      <p className="text-xs text-gray-700 font-semibold ml-1">
        {status} ({statusDetail})
      </p>
    </div>
  );
};

export default ShiftStatus;
