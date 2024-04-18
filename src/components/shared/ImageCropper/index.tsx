import { Box, Slider } from "@mui/material";
import { useCallback, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

interface Props {
  imageSrc: any;
  aspect : number;
  setCroppedAreaPixels: (rect: Area) => void;
}
const ImageCropper: React.FC<Props> = ({ imageSrc, setCroppedAreaPixels , aspect }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <>
      <Box sx={{ position: "relative", width: "100%", height: "250px" }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          // showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </Box>
      <div
        className="controls"
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          width: "50%",
          transform: "translateX(-50%)",
          height: "80px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Slider
          sx={{ padding: "22px 0px" }}
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(Number(zoom))}
          classes={{ root: "slider" }}
        />
      </div>
    </>
  );
};

export default ImageCropper;
