const ReciptList = ({ value }) => {
  const { image, amount } = value;
  const formatCurrency = (amt) => `$${amt.toFixed(2)}`;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <img
          src={URL.createObjectURL(image)}
          alt="Receipt"
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <p className="font-bold text-gray-900">{formatCurrency(amount)}</p>
        </div>
      </div>
    </div>
  );
};

export default ReciptList;
