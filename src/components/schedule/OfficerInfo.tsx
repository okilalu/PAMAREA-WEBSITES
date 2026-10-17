const OfficerInfo = ({ officer }) => {
  return (
    <div className="flex items-center">
      <div
        className={`p-3 rounded-lg font-bold ${
          officer.active ? "bg-[#FED400]" : "bg-[#D5E3FF]"
        }`}
      >
        {officer.initials}
      </div>

      <div className="ml-2">
        <p className="text-xs font-bold tracking-wide">{officer.name}</p>

        <p className="text-xs text-gray-500 font-semibold tracking-wide">
          NIP: {officer.nip}
        </p>

        <p className="text-xs text-gray-500 tracking-wide">{officer.team}</p>
      </div>
    </div>
  );
};

export default OfficerInfo;
