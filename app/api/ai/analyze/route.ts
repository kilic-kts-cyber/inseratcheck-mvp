import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body?.text;

    if (!text || text.length < 20) {
      return Response.json(
        { error: "Zu wenig Text für Analyse." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
Du analysierst Gebrauchtwagen-Inserate.

Erkenne:
- schwere technische Mängel
- Motor- oder Getriebeprobleme
- nicht fahrbereit
- wirtschaftliches Totalschadenrisiko
- widersprüchliche Angaben
- ungewöhnlich hohe Risiken

Antworte ausschließlich als gültiges JSON im Format:

{
  "riskBoost": number,
  "severity": "low" | "medium" | "high",
  "summary": "Kurz-Zusammenfassung",
  "issues": ["Problem 1", "Problem 2"]
}

riskBoost:
0-10 = gering
10-30 = mittel
30-50 = hoch
`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    const raw = completion.choices[0].message.content;

    if (!raw) {
      return Response.json(
        { error: "Leere KI-Antwort." },
        { status: 500 }
      );
    }

    // Falls KI aus Versehen Text drumherum schreibt → absichern
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      return Response.json(
        { error: "Ungültiges JSON von KI erhalten." },
        { status: 500 }
      );
    }

    const cleaned = raw.substring(jsonStart, jsonEnd + 1);

    return Response.json(JSON.parse(cleaned));

  } catch (error) {
    console.error("AI Error:", error);
    return Response.json(
      { error: "KI-Analyse fehlgeschlagen." },
      { status: 500 }
    );
  }
}
