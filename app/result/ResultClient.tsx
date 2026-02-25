'use client';

import React from 'react';
import type { FormData, RiskResult } from '@/lib/riskLogic';
import { calculateRisk } from '@/lib/riskLogic';

type Props = {
  text: string;
};

/**
 * ResultClient expects `text` to be a JSON-encoded object matching `FormData`.
 * If parsing fails, it shows an error. This keeps typesafe calls to `calculateRisk`.
 */
export default function ResultClient({ text }: Props): JSX.Element {
  let parsed: FormData | null = null;
  let parseError: string | null = null;

  try {
    const maybe = JSON.parse(text);
    if (maybe && typeof maybe === 'object') {
      parsed = maybe as FormData;
    } else {
      parseError = 'Parsed value is not an object.';
    }
  } catch (err) {
    parseError = (err instanceof Error && err.message) ? err.message : 'Invalid JSON';
  }

  if (!parsed) {
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h2>Unable to compute result</h2>
        <p>Input could not be parsed as valid FormData.</p>
        <details>
          <summary>Error</summary>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{parseError}</pre>
        </details>
        <p>Expected JSON matching `FormData` (e.g. {"{ \"age\": 52, \"systolic\": 135, \"cholesterol\": 220, \"smoker\": true }"}).</p>
      </div>
    );
  }

  const result: RiskResult = calculateRisk(parsed);

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2>Risk Result</h2>

      <section style={{ marginBottom: 12 }}>
        <h3>Input</h3>
        <pre style={{ background: '#f6f6f6', padding: 12 }}>{JSON.stringify(parsed, null, 2)}</pre>
      </section>

      <section>
        <h3>Result</h3>
        <p><strong>Score:</strong> {result.score}</p>
        <p><strong>Level:</strong> {result.level}</p>
      </section>
    </div>
  );
}
