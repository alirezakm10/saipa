import { EReturnStatus } from "./typescope";

export function getStatusTitle(currentStatus: number) {
  switch (currentStatus) {
    case EReturnStatus.REQUESTED:
      return 'درخواست داده شده';
    case EReturnStatus.ACCEPTED_PRIMARY:
      return 'پذیرش اولیه';
    case EReturnStatus.REJERCTED_PRIMARY:
      return 'رد اولیه';
    case EReturnStatus.CHECKING:
      return 'درحال بررسی';
    case EReturnStatus.CONFIRMED:
      return 'تایید شده';
    case EReturnStatus.REJECTED:
      return 'رد شده';
    case EReturnStatus.RETURNED:
      return 'مرجوع شده';
    default:
      return 'نامشخص';
  }
}


export function getColorForStatus(status: number) {
  switch (status) {
    case 1:
      return "#FFA500"; 
    case 2:
      return "#87CEEB"; 
      case 3:
      return "FFF"; 
    case 4:
      return "#227093"; 
    case 5:
      return "#008000"; 
    case 6:
      return "#FF6347"; 
    case 7:
      return "#FF0000"; 

    default:
      return "#000080"; // Default color (Navy)
  }
}