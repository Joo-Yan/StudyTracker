export const TAG_ENTITIES = [
  "habits",
  "okr",
  "todos",
  "projects",
  "content",
  "ideas",
] as const;

export type TagEntity = (typeof TAG_ENTITIES)[number];

export function isTagEntity(value: string): value is TagEntity {
  return TAG_ENTITIES.includes(value as TagEntity);
}
