type Numberify = number | string | bigint;

interface ImportMetaEnv {
  RPC_URL_LIST: string[];
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  xx: number
}
