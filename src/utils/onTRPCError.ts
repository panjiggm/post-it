import { TRPCError } from "@trpc/server";

type CodeType =
  | "PARSE_ERROR"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "METHOD_NOT_SUPPORTED"
  | "TIMEOUT"
  | "CONFLICT"
  | "PRECONDITION_FAILED"
  | "PAYLOAD_TOO_LARGE"
  | "TOO_MANY_REQUESTS"
  | "CLIENT_CLOSED_REQUEST";

export const onTRPCError = (code: CodeType, message: string) => {
  throw new TRPCError({
    code,
    message,
  });
};
