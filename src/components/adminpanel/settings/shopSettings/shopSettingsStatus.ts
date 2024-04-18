

export const currencyUnits = {
    IR_TOMAN: '1',
    IR_RIAL: '2',
    US_DOLLA: '3',
    EURO: '4',
    UE_DIRHAM: '5',
    IQ_DINAR: '6',
}


export const weightUnits = {
    KILO_GRAM: '1',
    GRAM: '2',
    POUND: '3',
    OUNCE : '4',
}


export const measurementUnits = {
    CENTIMETER : '1',
    METER : '2',
    MILLIMETER : '3',
}




export function getCurrencyTitle(currentStatus: number) {
    switch (currentStatus) {
      case 1:
        return 'تومان';
      case 2:
        return "ریال";
      case 3:
        return 'دلار';
      case 4:
        return 'یورو';
      case 5:
        return 'درهم';
      case 6:
        return 'دینار';
      default:
        return 'نامشخص';
    }
  }



  export function getWeightTitle(currentStatus: number) {
    switch (currentStatus) {
      case 1:
        return 'کیلوگرم';
      case 2:
        return "گرم";
      case 3:
        return 'پوند';
      case 4:
        return 'اونس';
      default:
        return 'نامشخص';
    }
  }
  


  export function getMeasureTitle(currentStatus: number) {
    switch (currentStatus) {
      case 1:
        return 'سانتی متر';
      case 2:
        return "متر";
      case 3:
        return 'میلی متر';
      default:
        return 'نامشخص';
    }
  }