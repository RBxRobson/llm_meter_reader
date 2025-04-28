import { fileTypeFromBuffer } from 'file-type';

type ImageValidationResult = false | { mimeType: string; base64: string };

// Função interna para verificar se a string recebida é um base64 válido
function isBase64(str: string): boolean {
  const base64Regex =
    /^[A-Za-z0-9+/=]{4,}([A-Za-z0-9+/=]{2})?([A-Za-z0-9+/=]{2})?$/;
  return base64Regex.test(str);
}

export async function base64Checker(
  str: string
): Promise<ImageValidationResult> {
  try {
    // Faz a verificação inicial
    if (!isBase64(str)) {
      return false;
    }

    // Verifica se a string tem um formato de base64 com mimeType
    const match = str.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    let mimeType: string | null = null;
    let base64Data: string;

    // Se tiver o match, extrai mimeType e base64Data
    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    } else {
      base64Data = str; // Caso não tenha o mimeType, assume que o dado é base64 puro
    }

    // Se não tiver mimeType, tenta identificar a partir do conteúdo base64
    if (!mimeType) {
      const buffer = Buffer.from(base64Data, 'base64');
      const type = await fileTypeFromBuffer(buffer);
      if (type && type.mime.startsWith('image/')) {
        mimeType = type.mime; // Informa o mimeType detectado
      }
    }

    // Verifica se o base64 é um formato válido de arquivo
    if (
      !mimeType ||
      ![
        'image/png',
        'image/jpeg',
        'image/webp',
        'image/heic',
        'image/heif',
      ].includes(mimeType)
    ) {
      return false;
    }

    return { mimeType, base64: base64Data };
  } catch (error) {
    return false;
  }
}
