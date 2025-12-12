const UserLimit = ({ name = 'User Limit', current = 50, max = 100 }) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="bg-white p-4 w-64 border-blue-300">
      <h3 className="mb-2">{name}</h3>
      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-4 ">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <p className="text-sm text-gray-700">
        {current} / {max} ({percentage.toFixed(1)}%)
      </p>
    </div>
  );
};

export default UserLimit;
