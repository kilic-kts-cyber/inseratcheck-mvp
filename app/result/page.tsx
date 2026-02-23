import { Suspense } from 'react';
import ResultClient from './ResultClient';

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f7f9f8]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm font-medium">Analyse wird berechnet …</p>
          </div>
        </div>
      }
    >
      <ResultClient />
    </Suspense>
  );
}
