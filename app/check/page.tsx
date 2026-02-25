import React from 'react';
import type { FormData } from '@/lib/riskLogic';
import { calculateRisk, RiskResult } from '@/lib/riskLogic';

export default function Page(): JSX.Element {
  const exampleData: FormData = {
    age: 52,
    systolic: 135,
    cholesterol: 220,
    smoker: true,
    diabetic: false,
  };

  const result: RiskResult = calculateRisk(exampleData);

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Risk Check</h1>

      <section style={{ marginBottom: 16 }}>
        <h2>Input (example)</h2>
        <pre style={{ background: '#f6f6f6', padding: 12 }}>
          {JSON.stringify(exampleData, null, 2)}
        </pre>
      </section>

      <section>
        <h2>Result</h2>
        <p>
          <strong>Score:</strong> {result.score}
        </p>
        <p>
          <strong>Level:</strong> {result.level}
        </p>
      </section>
    </main>
  );
}
