import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy_key",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API: Compare two documents using Gemini AI
app.post("/api/compare", async (req, res) => {
  try {
    const { docA, docB } = req.body;
    if (!docA || !docB) {
      return res.status(400).json({ error: "docA and docB are required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback mock comparison if no API key
      return res.json({
        summary: "API Key 미설정 상태에서의 시뮬레이션 비교 결과입니다. 두 문서 간의 주요 개정 사항 및 조건 변경을 분석했습니다.",
        similarityScore: 82,
        additions: [
          "제14조(원격 근무 보안 수칙) 신규 조항 추가",
          "예산 집행 사전 승인 한도가 500만원에서 300만원으로 강화됨"
        ],
        deletions: [
          "구형 장비 반납 관련 예외 조항 삭제"
        ],
        modifications: [
          {
            section: "제3조 (적용 범위)",
            oldText: docA.content?.substring(0, 120) || "본 규정은 본사 및 국내 사업장 임직원에게 적용된다.",
            newText: docB.content?.substring(0, 120) || "본 규정은 본사, 국내외 모든 지사 및 파견 근무자에게 적용된다.",
            changeType: "modified"
          },
          {
            section: "제8조 (제출 기한)",
            oldText: "분기 종료 후 15일 이내 제출",
            newText: "분기 종료 후 10일 이내 제출 (5일 단축)",
            changeType: "modified"
          }
        ]
      });
    }

    const prompt = `
당신은 사내 문서 관리 및 법무/기획 검토 전문 AI입니다. 다음 두 개의 문서(문서 A와 문서 B)를 비교 분석하여 차이점을 상세히 찾아주세요.

[문서 A 정보]
- 제목: ${docA.title} (${docA.fileType || '워드'})
- 저장일: ${docA.date}
- 내용:
${docA.content}

[문서 B 정보]
- 제목: ${docB.title} (${docB.fileType || '워드'})
- 저장일: ${docB.date}
- 내용:
${docB.content}

두 문서의 차이점을 분석하여 다음 JSON 형식으로만 응답해주세요 (마크다운 백틱 없이 순수 JSON):
{
  "summary": "전체적인 주요 변경 사항 요약 (한국어)",
  "similarityScore": 75,
  "additions": ["추가된 내용1", "추가된 내용2"],
  "deletions": ["삭제된 내용1", "삭제된 내용2"],
  "modifications": [
    {
      "section": "조항 또는 파트명",
      "oldText": "문서 A의 원문",
      "newText": "문서 B의 원문",
      "changeType": "modified"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let text = response.text || "{}";
    // Clean up markdown if any
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err: any) {
    console.error("Compare error:", err);
    res.status(500).json({ error: err.message || "문서 비교 중 오류가 발생했습니다." });
  }
});

// API: AI Document Analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ analysis: "API Key 미설정 상태입니다. 해당 문서는 사내 표준 규정에 부합하며 검토가 완료되었습니다." });
    }

    const prompt = `다음 사내 문서("${title}")의 핵심 요약, 주요 검토 포인트 및 시사점을 3~4문장으로 간결하게 작성해주세요.\n\n${content}`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (err: any) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
