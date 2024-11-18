import React from "react";
import { Card, Row, Col, message } from "antd";
import "../components.css";

const WallpaperSelector = ({ onWallpaperChange }) => {
  const wallpapers = [
    { id: "default", name: "Default Theme", path: "default.jpg" },
    { id: "nature", name: "Nature Theme", path: "nature.jpg" },
    { id: "city", name: "City Theme", path: "city.jpg" },
    { id: "abstract", name: "Abstract Theme", path: "abstract.jpg" },
  ];

  const handleWallpaperSelect = (wallpaper) => {
    try {
      localStorage.setItem('selectedWallpaper', wallpaper.path);
      onWallpaperChange(wallpaper.path);
      message.success(`Theme changed to ${wallpaper.name}`);
    } catch (error) {
      message.error('Failed to change theme');
    }
  };

  return (
    <Card title="Theme Selection" className="wallpaper-selector">
      <Row gutter={[8, 8]}>
        {wallpapers.map((wallpaper) => (
          <Col key={wallpaper.id} span={12}>
            <div
              style={{
                height: "80px",
                borderRadius: "4px",
                overflow: "hidden",
                cursor: "pointer",
                border: "2px solid transparent",
                transition: "all 0.3s ease",
                position: "relative",
              }}
              onClick={() => handleWallpaperSelect(wallpaper)}
              className="wallpaper-option"
            >
              <img
                src={`/wallpapers/${wallpaper.path}`}
                alt={wallpaper.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="wallpaper-name">{wallpaper.name}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default WallpaperSelector;