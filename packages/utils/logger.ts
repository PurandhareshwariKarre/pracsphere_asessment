// packages/utils/logger.ts
export function log(message: string) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[LOG]: ${message}`);
  }
}
