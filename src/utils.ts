import "dotenv/config";

export function getEnvVarOrThrow(name: string): string {
  const envVar = process.env[name]; //so it works on both firebase functions and regular server with environment setup
  if (!envVar) throw new Error(`${name} environment variable not set`);
  else return envVar as string;
}
