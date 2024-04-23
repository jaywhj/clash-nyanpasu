import { fetchLatestCoreVersions, getCoreVersion } from "./tauri";
import { VergeConfig } from "./types";

export type ClashCore = Required<VergeConfig>["clash_core"];

export interface Core {
  name: string;
  core: ClashCore;
  version?: string;
  latest?: string;
}

export const VALID_CORE: Core[] = [
  { name: "Clash Premium", core: "clash" },
  { name: "Mihomo", core: "mihomo" },
  { name: "Mihomo Alpha", core: "mihomo-alpha" },
  { name: "Clash Rust", core: "clash-rs" },
];

export const fetchCoreVersion = async () => {
  return await Promise.all(
    VALID_CORE.map(async (item) => {
      const version = await getCoreVersion(item.core);
      return { ...item, version };
    }),
  );
};

export const fetchLatestCore = async () => {
  const results = await fetchLatestCoreVersions();

  const cores = VALID_CORE.map((item) => {
    if (item.core == "clash") {
      return {
        ...item,
        latest: `n${results["clash_premium"]}`,
      };
    } else {
      return {
        ...item,
        latest: results[item.core.replace(/-/g, "_") as keyof typeof results],
      };
    }
  });

  return cores;
};

export enum SupportedArch {
  // blocked by clash-rs
  // WindowsX86 = "windows-x86",
  WindowsX86_64 = "windows-x86_64",
  // blocked by clash-rs#212
  // WindowsArm64 = "windows-arm64",
  LinuxAarch64 = "linux-aarch64",
  LinuxAmd64 = "linux-amd64",
  DarwinArm64 = "darwin-arm64",
  DarwinX64 = "darwin-x64",
}

export enum SupportedCore {
  Mihomo = "mihomo",
  MihomoAlpha = "mihomo_alpha",
  ClashRs = "clash_rs",
  ClashPremium = "clash_premium",
}

export type ArchMapping = { [key in SupportedArch]: string };

export interface ManifestVersion {
  manifest_version: number;
  latest: { [K in SupportedCore]: string };
  arch_template: { [K in SupportedCore]: ArchMapping };
  updated_at: string; // ISO 8601
}
