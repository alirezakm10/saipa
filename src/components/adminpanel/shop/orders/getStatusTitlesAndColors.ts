import { EOrderStatus } from "./typescope";

export function getStatusTitle(currentStatus: number) {
  switch (currentStatus) {
    case EOrderStatus.WAIT_FOR_PAYMENT:
      return 'در انتظار پرداخت';
    case EOrderStatus.COMPLETED:
      return 'تکمیل شده';
    case EOrderStatus.CHECKING:
      return 'درحال بررسی';
    case EOrderStatus.SENDING:
      return 'درحال ارسال';
    case EOrderStatus.CONFIRMED:
      return 'دریافت شده';
    case EOrderStatus.RETURN_REQUEST:
      return 'لغو شده توسط کاربر';
    case EOrderStatus.RETURN_CHECKING:
      return 'لغو شده توسط سیستم';
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