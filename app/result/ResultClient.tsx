'use client'

import { calculateRisk } from '../../lib/riskLogic'
import { generatePDF } from '../../lib/pdf'

export default function ResultClient({ text }: { text: string }) {
  const result = calculateRisk(text)

  return (
    <div style={{ padding: 40 }}>
      <h1>Analyse-Ergebnis</h1>

      <p><strong>Score:</strong> {result.score}</p>
      <p><strong>Risiko-Level:</strong> {result.level}</p>

      <button
        onClick={() => generatePDF(result)}
        style={{
          marginTop: 20,
          padding: 10,
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 6
        }}
      >
        PDF generieren
      </button>
    </div>
  )
}
