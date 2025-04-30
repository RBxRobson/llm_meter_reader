// Erros no consumo do Gemini
export class InvalidMeterError extends Error {
  code = 'INVALID_METER';
  constructor() {
    super('A imagem não possui um medidor válido para leitura.');
    this.name = 'InvalidMeterError';
  }
}

export class UnreadableImageError extends Error {
  code = 'UNREADABLE_IMAGE';
  constructor() {
    super('A imagem não possui visibilidade suficiente para leitura.');
    this.name = 'UnreadableImageError';
  }
}

export class GeminiKeyNotFoundError extends Error {
  code = 'GEMINI_KEY_NOTFOUND';
  constructor() {
    super('GEMINI_API_KEY não encontrada.');
    this.name = 'GeminiKeyNotFoundError';
  }
}

export class InvalidModelResponseError extends Error {
  code = 'INVALID_MODEL_RESPONSE';
  constructor() {
    super('Resposta inesperada na leitura.');
    this.name = 'InvalidModelResponseError';
  }
}
// ---------------------- || ---------------------- \\

// Erros para o controller da rota upload
export class InvalidUploadDataError extends Error {
  code = 'INVALID_DATA';
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidModelResponseError';
  }
}

export class DoubleReportError extends Error {
  code = 'DOUBLE_REPORT';
  constructor() {
    super('Leitura do mês já realizada');
    this.name = 'DoubleReportError';
  }
}
// ---------------------- || ---------------------- \\
