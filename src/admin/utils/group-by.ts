/**
 * receive an array of objects and group those objects that have a same key / value pair into arrays and return an array containing those arrays
 */

import { get } from "lodash";

const DEFAULT_GROUP_NAME = "default-group";

type PathTree<T> = {
  [P in keyof T]-?: T[P] extends object ? [P] | [P, ...Path<T[P]>] : [P];
};

type Path<T> = PathTree<T>[keyof T];

export default <T>(
  items: T[],
  // limit the type to the keys of T only
  groupKeyPathComposents: Path<T>,
  defaultGroupName: string = DEFAULT_GROUP_NAME
): { name: string; items: T[] }[] => {
  const groups: {
    name: string;
    items: T[];
  }[] = [
    {
      name: defaultGroupName,
      items: [],
    },
  ];

  const groupKey = groupKeyPathComposents.join(".");

  items.forEach((item) => {
    let itemGroupName = get(item, groupKey, defaultGroupName) as string;

    if (itemGroupName && typeof itemGroupName !== "string")
      itemGroupName = defaultGroupName;

    if (itemGroupName) {
      const group = groups.find((group) => group.name === itemGroupName);
      if (group) {
        // group exist, push only
        group.items.push(item);
      } else {
        // create the gruop and push
        groups.push({
          items: [item],
          name: itemGroupName,
        });
      }
    } else {
      groups[0].items.push(item);
    }
  });

  return groups;
};
