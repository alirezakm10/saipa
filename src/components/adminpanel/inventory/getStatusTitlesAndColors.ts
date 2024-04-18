import { EInventoryStatus } from "./typescope";

export function getStatusTitle(currentStatus: number) {
  switch (currentStatus) {
    case EInventoryStatus.ENTER:
      return 'ورود';
    case EInventoryStatus.EXIT:
      return 'خروج';
    default:
      return 'نامشخص';
  }
}


export function getColorForStatus(status: number) {
  switch (status) {
    case 1:
      return "#1dd1a1"; 
    case 2:
      return "#ee5253"; 
    default:
      return "#000080"; // Default color (Navy)
  }
}