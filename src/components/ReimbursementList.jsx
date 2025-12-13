const formatCurrency = (amount) => `$${amount}`;

const getStatusBadge = (status) => {
  const colors = {
    paid: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  );
};

const ReimbursementList = ({ items }) => (
  <div className="space-y-1">
    {items.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <p>No requests found</p>
      </div>
    ) : (
      items.map((request) => (
        <div
          key={request.id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{request.title}</p>
              <p className="text-gray-600 text-sm">{request.requestorName}</p>
              <p className="text-gray-500 text-xs mt-1">{request.date}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{formatCurrency(request.amount)}</p>
              <div className="mt-1">{getStatusBadge(request.status)}</div>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

export default ReimbursementList;