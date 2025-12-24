import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { queryClient } from './queryClient';
import { router } from './router';
import './index.css';

const RootSetup = () => {
  return (
    // <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    // </StrictMode>
  );
};

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found in index.html');

const root = createRoot(container);
root.render(<RootSetup />);
