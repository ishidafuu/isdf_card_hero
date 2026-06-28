import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

export function readNonNegativeInteger(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return number;
}

export function readInteger(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isInteger(number)) {
    throw new Error(`${name} must be an integer`);
  }
  return number;
}

export async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

export function average(values: readonly number[]): number {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function round(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

export function signed(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

export function signedRounded(value: number, precision = 1): string {
  const rounded = round(value, precision);
  return rounded >= 0 ? `+${rounded}` : `${rounded}`;
}

export function signedPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${formatPercent(value)}`;
}

export function escapeMarkdownTableCell(value: string): string {
  return value.replaceAll("|", "\\|");
}
