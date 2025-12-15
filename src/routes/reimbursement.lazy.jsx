import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../hooks/AuthContext';
import { useState } from 'react';
import ReciptList from '../components/ReciptList';
import { router } from '@/router';

export const Route = createLazyFileRoute('/reimbursement')({
  component: RouteComponent,
});

export default function RouteComponent() {
  const { isManager, isFinance } = useAuth();
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [image, setImage] = useState(null);
  const [amount, setAmount] = useState(null);
  const [category, setCategory] = useState('');

  const [items, setItems] = useState([]);

  const [reimbursement, setReimbursement] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PNG, JPG, or GIF file.');
        return;
      }
      if (file.size > maxSize) {
        alert('File size must be under 10MB.');
        return;
      }
      setImage(file);
    }
  };

  const handleCreateRecipt = (e) => {
    e.preventDefault();
    if (!image || !amount) {
      alert('Please select an image and enter an amount.');
      return;
    }

    const newItem = { image, amount: parseFloat(amount) };
    setItems([...items, newItem]);
    setImage(null);
    setAmount(null);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !desc || items.length === 0) {
      alert('Please fill in title, description, and add at least one item.');
      return;
    }

    let totalammount = 0;
    items.forEach((i) => {
      totalammount += i.amount;
    });

    setReimbursement({
      id: isManager ? 'manager' : isFinance ? 'finance' : 'employee',
      title: title,
      description: desc,
      total: totalammount,
      reimbursementItem: items,
    });

    console.log({
      id: isManager ? 'manager' : isFinance ? 'finance' : 'employee',
      title: title,
      description: desc,
      reimbursementItem: items,
    });

    // Reset form
    setTitle(null);
    setDesc(null);
    setItems([]);
    setReimbursement(null);

    router.navigate({to:'/dashboard'})
  };

  const MOCK_CATEGORY = [
    { id: '1', name: 'business' },
    { id: '2', name: 'trip' },
    { id: '3', name: 'eating' },
  ];

  return (
    <div className="max-w-4xl mx-auto overflow-y-auto p-6 ">
      <form onSubmit={handleSubmit}>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="category" className="block text-sm/6 font-medium text-gray-900">
              Category
            </label>
            <select
              className="block min-w-0 rounded-md border border-gray-300 bg-white py-1.5 pr-3 pl-1 text-base text-gray-90 focus:outline-none sm:text-sm/6"
              onChange={(e) => setCategory(e.target.value)}
              name="category"
            >
              {MOCK_CATEGORY.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
              Title
            </label>
            <div className="flex mt-2 items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <input
                id="username"
                name="username"
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Reimbursement Title"
                className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              />
            </div>
          </div>
        </div>

        <div className="col-span-full overflow-x-hidden">
          <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="about"
              name="about"
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none sm:text-sm/6"
              defaultValue={''}
            />
          </div>
          <p className="mt-3 text-sm/6 text-gray-600 break-words">
            Write a few sentences about yourself.
          </p>
        </div>

        <div className="col-span-full space-y-1">
          <label
            htmlFor="cover-photo"
            className="block text-sm/6 font-medium text-gray-900 break-all"
          >
            Recipt photo: {image ? image.name : 'No file selected'}
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 py-10">
            <div className="text-center">
              <div className="mt-4 flex text-sm/6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <label htmlFor="amount" className="block text-sm/6 font-medium text-gray-900 break-all">
            Amount: {amount ? amount : 'no amount'}
          </label>
          <div className="mt-2">
            <input
              id="amount"
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={handleCreateRecipt}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Item
          </button>
        </div>

        <div className="space-y-1 mt-5">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recipt item</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={item.image.name}
                className="flex flex-row justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <ReciptList value={item} />
                <div className="mt-6 flex items-center align-middle justify-end gap-x-6">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-sm/6 font-semibold text-red-500 hover:cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
