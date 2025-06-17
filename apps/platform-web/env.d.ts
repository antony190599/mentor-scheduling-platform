
declare namespace NodeJS {
  interface ProcessEnv {
    /** `"development" | "test" | "production"` – set by Node/your tooling */
    NODE_ENV: 'development' | 'test' | 'production';

   DATABASE_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    /** `"true" | "false"` – set by Node/your tooling */
  }
}