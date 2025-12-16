import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  
  return (
    <div className="flex items-center justify-center p-8 text-center bg-green-100 min-h-[50vh] grow">
      <h1 className="text-4xl font-extrabold text-green-700">Welcome to the Homepage!</h1>
      <p className="mt-2 text-lg text-green-500">
        This route was lazy-loaded and successfully rendered via the Root layout.
      </p>
    </div>
  );
}
