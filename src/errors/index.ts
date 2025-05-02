// Erros no consumo do Gemini \\
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

// Erros para o controller da rota upload \\
export class InvalidDataError extends Error {
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

// Erros para o controller da rota confirm \\
export class MeasureNotFoundError extends Error {
  code = 'MEASURE_NOT_FOUND';
  constructor() {
    super('Não existe nenhuma leitura cadastrada com o uuid fornecido');
    this.name = 'MeasureNotFoundError';
  }
}

export class ConfirmationDuplicateError extends Error {
  code = 'CONFIRMATION_DUPLICATE';
  constructor() {
    super('A leitura informada já foi confirmada');
    this.name = 'MeasureNotFoundError';
  }
}
// ---------------------- || ---------------------- \\

// Erros para o controller da rota measuresList \\
export class MeasuresNotFoundError extends Error {
  code = 'MEASURES_NOT_FOUND';
  constructor() {
    super('Nenhuma leitura encontrada');
    this.name = 'MeasureNotFoundError';
  }
}

export class InvalidTypeError extends Error {
  code = 'INVALID_TYPE';
  constructor() {
    super('Tipo de medição não permitida');
    this.name = 'MeasureNotFoundError';
  }
}
// ---------------------- || ---------------------- \\
