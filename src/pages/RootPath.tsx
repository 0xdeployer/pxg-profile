import React from "react";

export default function RootPath() {
  React.useEffect(() => {
    window.location.href = "https://pxg.pixelglyphs.io";
  }, []);
  return <span></span>;
}
