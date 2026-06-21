import type { MasterActionId, MasterId } from "./types";

export interface MasterActionDef {
  id: MasterActionId;
  name: string;
  cost: number;
  summary: string;
}

export interface MasterDef {
  id: MasterId;
  name: string;
  actions: MasterActionId[];
  iconUrl: string;
}

export const MASTER_ACTION_DEFS: Record<MasterActionId, MasterActionDef> = {
  master_attack: {
    id: "master_attack",
    name: "Master Attack",
    cost: 3,
    summary: "相手前衛モンスター1体に2P",
  },
  wake_up: {
    id: "wake_up",
    name: "Wake Up",
    cost: 2,
    summary: "準備中モンスター1体を登場させる",
  },
  shield: {
    id: "shield",
    name: "Shield",
    cost: 2,
    summary: "味方モンスター1体の被ダメージを1減らす",
  },
  berserk_power: {
    id: "berserk_power",
    name: "Berserk Power",
    cost: 3,
    summary: "モンスター1体の次の攻撃+1P、攻撃後に1ダメージ",
  },
  earth_anger: {
    id: "earth_anger",
    name: "Earth Anger",
    cost: 6,
    summary: "フィールド全体の登場済みモンスターに3P",
  },
};

export const MASTER_DEFS: Record<MasterId, MasterDef> = {
  white: {
    id: "white",
    name: "ホワイトマスター",
    actions: ["master_attack", "wake_up", "shield"],
    iconUrl: "https://www.cardhero-bu.com/static/images/icon/m3.jpg",
  },
  black: {
    id: "black",
    name: "ブラックマスター",
    actions: ["master_attack", "berserk_power", "earth_anger"],
    iconUrl: "https://www.cardhero-bu.com/static/images/icon/m2.jpg",
  },
};

export const MASTER_IDS: MasterId[] = ["white", "black"];

export function getMasterDef(masterId: MasterId): MasterDef {
  return MASTER_DEFS[masterId];
}

export function getMasterName(masterId: MasterId): string {
  return getMasterDef(masterId).name;
}

export function getMasterIconUrl(masterId: MasterId): string {
  return getMasterDef(masterId).iconUrl;
}

export function getMasterActionDef(actionId: MasterActionId): MasterActionDef {
  return MASTER_ACTION_DEFS[actionId];
}

export function getMasterActionIds(masterId: MasterId): MasterActionId[] {
  return [...getMasterDef(masterId).actions];
}
