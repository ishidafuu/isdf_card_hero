export interface ArtBuildRootOptions {
  root?: string;
}

export interface ArtPublishTransactionFs {
  rename(oldPath: string, newPath: string): Promise<void>;
  rm(path: string, options?: { force?: boolean; recursive?: boolean }): Promise<void>;
}

export interface V2CandidateAsset {
  sourceNo: number;
  cardId: string;
  variantId: string;
  variantKind: "reference-redraw" | "legacy-v1-retained";
  status: "approved" | "approved-fallback";
  prompt: string;
  tool: string;
  referenceSourceNo?: number;
  referenceSHA256?: string;
  rightsStatus: string;
  publicPath: string;
  url: string;
  sha256: string;
  width: number;
  height: number;
}

export interface ExistingPublicAsset {
  sourceNo: number;
  sha256: string;
  prompt?: string;
  variantKind?: string;
  [key: string]: unknown;
}

export interface PublicManifestV2 {
  format: "stone-tactics-card-art";
  version: 2;
  status: "complete";
  rightsStatus: string;
  assets: Array<{
    sourceNo: number;
    cardId: string;
    variantId: string;
    variantKind: "reference-redraw" | "legacy-v1-retained";
    path: string;
    url: string;
    sha256: string;
    width: number;
    height: number;
    tool: string;
    prompt: string;
    referenceSourceNo?: number;
    referenceSHA256?: string;
    rightsStatus: string;
  }>;
}

export interface V2PreflightRow extends V2CandidateAsset {
  bytes: Uint8Array;
  hash: string;
}

export interface V2PreflightResult {
  manifest: {
    format: "stone-tactics-card-art";
    version: 2;
    approvalState: "draft" | "root-approved";
    assets: V2CandidateAsset[];
  };
  currentPublic: {
    parsed: {
      format: "stone-tactics-card-art";
      version: 1 | 2;
      status: "complete";
      assets: ExistingPublicAsset[];
      [key: string]: unknown;
    };
    rows: Map<number, ExistingPublicAsset>;
    bytes: Uint8Array;
    version: 1 | 2;
  };
  rows: V2PreflightRow[];
  publicManifest: PublicManifestV2;
}

export declare function preflightV2Art(options?: ArtBuildRootOptions): Promise<V2PreflightResult>;
export declare function publishV2Art(options?: ArtBuildRootOptions & { transactionFs?: ArtPublishTransactionFs }): Promise<{
  count: number;
  backupDirectory: string | null;
}>;
