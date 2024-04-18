'use client'


const AnalogClock: React.FC = () => {


  let options:any =  {
    "useCustomTime": false,
    "width": "220px",
    "border": true,
    "borderColor": "#000000",
    "baseColor": "#513d71",
    "centerColor": "#459cff",
    "centerBorderColor": "#ffffff",
    "handColors": {
      "second": "#b97496",
      "minute": "#ffffff",
      "hour": "#ffffff"
    }
  }

  return <AnalogClock {...options} />
  
};

export default AnalogClock;
