const TATErrors = [
  // xxx1xx: http
  {
    name: "HTTP_BAD_REQUEST",
    message: "http bad request",
  },
  {
    name: "INVALID_INPUT",
    message: "invalid input",
  },
  {
    name: "LENGTH_LIMIT",
    message: "length limit: 0-16 characters, emoji are not allowed",
  },
  {
    name: "I_AM_NOT_ADMIN",
    message: "I am not admin, I can't set your title.",
  },
  {
    name: "NOT_SERVE_BOT",
    message: "I can't set your title, because you are a bot.",
  },
  {
    name: "YOUR_ARE_CREATOR",
    message: "I can't set your title, because you are a creator.",
  },
  {
    name: "YOUR_ARE_ADMIN",
    message:
      "I can't set your title, because you are an admin and not promote by me.",
  },
  {
    name: "ERROR_CHAT_TYPE",
    message: "I just work in group and super group.",
  },
  {
    name: "UNKNOWN",
    message: "unknown error",
  },
  {
    name: "MISSING_PERMISSION",
    message:
      "I can't set your title, because you are missing some permissions.",
  },
] as const;

export class TATError extends Error {
  name: string;
  message: string;
  payload?: unknown;

  constructor(name: TATErrorsNameType, message?: string, payload?: unknown) {
    const errType = errorMap[name];
    super(errType.name);
    this.name = errType.name;
    this.message = errType.message;

    if (message) this.message = message;
    if (payload) this.payload = payload;
  }

  setMessage(message: string): TATError {
    this.message = message;
    return this;
  }

  setPayload(payload: unknown): TATError {
    this.payload = payload;
    return this;
  }

  toResponse() {
    let res = `error:
name: ${this.name}
message: ${this.message}\n`;

    if (this.payload) {
      res += `payload: ${this.payload}`;
    }

    return res;
  }
}

type TATErrorsType = typeof TATErrors[number];
type TATErrorsNameType = typeof TATErrors[number]["name"];

type TATErrorsMapType = {
  [key in TATErrorsNameType]: TATErrorsType;
};

export const errorMap = TATErrors.map((value) => ({
  [value.name]: value,
})).reduce((acc, cur) => ({ ...acc, ...cur }), {}) as TATErrorsMapType;
