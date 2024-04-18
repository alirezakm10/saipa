import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const usePermission = () => {
  const { data: session, status } = useSession();
  const permissions = session?.user?.permission;
  const allowedPermissions: string[] = [];
  if (permissions) {
    for (const entity in permissions) {
      permissions[entity].forEach((action: string) => {
        allowedPermissions.push(`${entity}.${action}`);
      });
    }
  }
  const hasPermission = (permission: string) =>
    allowedPermissions.length > 0 && allowedPermissions.includes(permission);

  return { allowedPermissions, hasPermission };
};

export default usePermission;
