import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  InvalidMeterError,
  UnreadableImageError,
  GeminiKeyNotFoundError,
  InvalidModelResponseError,
} from '../errors';

const GEMINI_MODEL = 'gemini-2.0-flash';

// Prompt que será enviado ao modelo Gemini com instruções específicas de leitura
const PROMPT = `
  A imagem a seguir deve ser de um medidor, de água ou gás.
  Leia o número mostrado no visor do medidor e retorne apenas o número como resposta,
  sem adicionar texto. Caso a imagem não seja de um medidor de água ou gás, responda: "ERROR 1".
  Caso a imagem esteja ilegível ou com outro problema de leitura, responda: "ERROR 2".
`.trim();

// Função auxiliar para pausar a execução por um tempo (usada para backoff exponencial)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const processImage = async (
  base64: string,
  mimeType: string,
  maxRetries = 5
): Promise<number> => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) throw new GeminiKeyNotFoundError();

  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await model.generateContent([
        { text: PROMPT },
        {
          inlineData: {
            mimeType,
            data: base64,
          },
        },
      ]);

      const responseText = result.response.text().trim();
      const value = Number(responseText);
      if (responseText === 'ERROR 1') {
        // Erro semântico: imagem não é de um medidor
        throw new InvalidMeterError();
      } else if (responseText === 'ERROR 2') {
        // Erro semântico: imagem ilegível ou com outro problema
        throw new UnreadableImageError();
      } else if (isNaN(value)) {
        // Se o modelo retornar algo não numérico, é considerado inválido
        throw new InvalidModelResponseError();
      }
      return value;
    } catch (error: any) {
      const isRetryable = error?.status === 503 || error?.status === 500;

      // Erros temporários permitem nova tentativa com delay exponencial
      if (isRetryable && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(
          `Erro Gemini ${error.status}. Tentando novamente em ${delay / 1000}s...`
        );
        await sleep(delay);
        continue;
      }

      console.error('Erro ao processar imagem no Gemini:', error);
      throw error;
    }
  }

  // Caso todas as tentativas falharam
  throw new Error('Falha ao processar imagem após múltiplas tentativas');
};
