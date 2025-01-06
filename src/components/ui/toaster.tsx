'use client';

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <>
      <style jsx global>{`
        [data-sonner-toaster][data-theme="dark"] [data-sonner-toast][data-type="success"] {
          background: linear-gradient(to right, #22c55e, #15803d, #166534);
          border: none;
          color: white;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
        }
        [data-sonner-toaster][data-theme="dark"] [data-sonner-toast][data-type="error"] {
          background: linear-gradient(to right, #ef4444, #dc2626);
          border: none;
          color: white;
        }
        [data-sonner-toaster][data-theme="dark"] [data-sonner-toast][data-type="info"] {
          background: linear-gradient(to right, #3b82f6, #2563eb);
          border: none;
          color: white;
        }
      `}</style>
      <Toaster 
        position="top-right" 
        theme="dark"
        richColors
        closeButton
      />
    </>
  );
} 