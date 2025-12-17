const UserLimit = ({ name = 'User Limit', current = 50, max = 100, Icon }) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="bg-white p-4 w-full h-28 border border-gray-100 rounded-lg shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      {Icon && (
        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-blue-600" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
            <h3 className="font-semibold text-sm text-gray-700 truncate pr-2">{name}</h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">{percentage.toFixed(0)}%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
            <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>

        <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <span>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(current)}
            </span>
            <span>/</span>
            <span>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(max)}
            </span>
        </div>
      </div>
    </div>
  );
};

export default UserLimit;
