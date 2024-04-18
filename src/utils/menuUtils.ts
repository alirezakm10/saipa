interface MenuItem {
  menuId: number;
  subMenus?: MenuItem[];
  name?: string; // Add name property to MenuItem
  link?:string;
}

export const updateMenu = (
  menuObject: { config:any,items: MenuItem[] },
  menuId: number,
  actionType: "add" | "delete" | "update", // Add "update" action type
  data?: Partial<MenuItem>
): { config:any, items: MenuItem[] } => {
  const menuIdToUpdate = menuId;

  const updateMenuRecursive = (menuArray: MenuItem[]): MenuItem[] =>
    menuArray.reduce((accumulator, currentItem) => {
      if (currentItem.menuId === menuIdToUpdate) {
        if (actionType === "delete") return accumulator; // Skip this item and its submenus for delete action

        if (actionType === "update") {
          // For update action, update the specified properties
          const updatedItem: MenuItem = {
            ...currentItem,
            ...data,
          };
          return [...accumulator, updatedItem];
        }

        // For add action, create a new item with an empty submenu
        const updatedItem: MenuItem = {
          ...currentItem,
          subMenus: [
            ...(currentItem.subMenus || []),
            { menuId: currentItem.menuId, subMenus: [] },
          ],
          ...data, // Merge additional data if provided
        };
        return [...accumulator, updatedItem];
      }

      const updatedItem: MenuItem = {
        ...currentItem,
        subMenus: updateMenuRecursive(currentItem.subMenus || []),
      };
      return [...accumulator, updatedItem];
    }, [] as MenuItem[]); // Provide an initial empty array as the accumulator

  return {config:menuObject.config ,items: updateMenuRecursive(menuObject.items) };
};
