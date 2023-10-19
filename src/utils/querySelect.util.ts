export const querySelect = (
  keys: string[],
  allowedKeys: string[],
  entityName: string,
  contentKeys?: string[],
): string[] => {
  keys = keys.filter((item) => allowedKeys.includes(item));

  const selectArray = (keys.length ? keys : allowedKeys).map((item) => {
    if (contentKeys.includes(item)) return `content.${item} as ${item}`;
    else return `${entityName}.${item} as "${item}"`;
  });

  return selectArray;
};
