import { DocumentCloud } from "iconsax-react";

const ShiftActions = ({ actions }) => {
  return (
    <div className="items-center justify-center">
      {actions.report && (
        <button className="flex items-center gap-1 bg-gray-100 px-5 py-1 rounded-sm cursor-pointer">
          <DocumentCloud size={17} color="#003B73" />

          <p className="text-sm text-gray-800 font-semibold">Laporan</p>
        </button>
      )}

      {actions.detailLog && (
        <button className="px-6 py-1 cursor-pointer mt-1">
          <p className="text-sm text-gray-500 font-semibold">Detail Log</p>
        </button>
      )}

      {actions.editAssignment && (
        <button className="flex items-center gap-1 bg-gray-100 px-5 py-1 rounded-sm cursor-pointer">
          <DocumentCloud size={17} color="#003B73" />

          <p className="text-sm text-gray-800 font-semibold">Edit Penugasan</p>
        </button>
      )}

      {actions.replaceOfficer && (
        <button className="px-6 py-1 cursor-pointer mt-1">
          <p className="text-sm text-gray-500 font-semibold">Pilih Pengganti</p>
        </button>
      )}
    </div>
  );
};

export default ShiftActions;
