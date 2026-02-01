interface ImportMetaEnv {
  readonly PUBLIC_GITHUB_REPO: string;
  readonly PUBLIC_DISCORD_LINK: string;
  readonly PUBLIC_RELEASE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}