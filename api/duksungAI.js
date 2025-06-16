import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

 // const { name, birth } = req.body;

  //if (!name || !birth) {
   // return res.status(400).json({ error: "이름(name)과 생년월일(birth)이 필요합니다." });
 // }
 const name = "김영아"
 const birth = "2004-04-24"

  try {
    const today = new Date().toISOString().slice(0, 10);

    const prompt = `
이름: ${name}
생년월일: ${birth}
오늘 날짜: ${today}

이 사람의 오늘의 운세를 사주풀이 형식으로 알려줘
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "당신은 200년 경력의 사주풀이 전문가입니다. 사람들의 오늘 운세를 200자 이내로 전해주세요. 운세는 정확하고 부정적인 내용이 있으면 추가해 주시되, 최대한 둥글게 표현해주세요."
      }
    });

    // candidates 배열 첫 번째 객체의 content 속성 사용
    const answer = result.candidates[0].content;
    res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러가 발생했습니다." });
  }
}