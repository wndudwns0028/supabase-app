import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [0],
    "subject-min-length": [0],
    "body-max-line-length": [1, "always", 200],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "perf",
        "ci",
        "revert",
        "build",
      ],
    ],
  },
};

export default config;
