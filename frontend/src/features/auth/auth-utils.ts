import { authClient } from "@/lib/auth-client";

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    string
  >
>;

const ERROR_MAPPING = {
  USER_NOT_FOUND: "Usuário não encontrado.",
  FAILED_TO_CREATE_USER: "Falha ao criar o usuário.",
  FAILED_TO_CREATE_SESSION: "Falha ao criar a sessão.",
  FAILED_TO_UPDATE_USER: "Falha ao atualizar o usuário.",
  FAILED_TO_GET_SESSION: "Falha ao obter a sessão.",
  INVALID_PASSWORD: "Senha inválida.",
  INVALID_EMAIL: "Email inválido.",
  INVALID_EMAIL_OR_PASSWORD: "Email ou senha inválidos.",
  SOCIAL_ACCOUNT_ALREADY_LINKED: "Essa conta social já está vinculada a outro usuário.",
  PROVIDER_NOT_FOUND: "Provedor de autenticação não encontrado.",
  INVALID_TOKEN: "Token inválido.",
  ID_TOKEN_NOT_SUPPORTED: "ID Token não é suportado.",
  FAILED_TO_GET_USER_INFO: "Falha ao obter informações do usuário.",
  USER_EMAIL_NOT_FOUND: "Email do usuário não encontrado.",
  EMAIL_NOT_VERIFIED: "Email não verificado.",
  PASSWORD_TOO_SHORT: "Senha muito curta.",
  PASSWORD_TOO_LONG: "Senha muito longa.",
  USER_ALREADY_EXISTS: "Usuário já cadastrado.",
  EMAIL_CAN_NOT_BE_UPDATED: "O email não pode ser alterado.",
} satisfies ErrorTypes;


export const getErrorMessage = (code: string) => {
  if (code in ERROR_MAPPING) {
    return ERROR_MAPPING[code as keyof typeof ERROR_MAPPING];
  }
  return "";
};