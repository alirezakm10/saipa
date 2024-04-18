import { ECommentsStatus } from "./typescope";

export function getStatusTitle(currentStatus: number) {
  switch (currentStatus) {
    case ECommentsStatus.WAITING:
      return 'در انتظار تأیید';
    case ECommentsStatus.CONFIRMED:
      return 'تأیید شده';
    case ECommentsStatus.REJECTED:
      return 'رد شده';
    default:
      return 'نامشخص';
  }
}


export function getColorForStatus(status: number) {
  switch (status) {
    case 1:
      return "#ff9f43"; 
    case 2:
      return "#1dd1a1"; 
      case 3:
      return "#ee5253"; 
    default:
      return "#000080"; // Default color (Navy)
  }
}