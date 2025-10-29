import React, { ReactElement, useState } from "react";
import { UI_CONSTANTS } from "../constants/uiConstants";
import type { typeDataFruits } from "../dataFruits";

interface FruitItemProps {
  item: typeDataFruits;
  index: number;
  isSelected: boolean;
  onLoadError?: () => void;
}

const FruitItem: React.FC<FruitItemProps> = ({ 
  item, 
  index, 
  isSelected,
  onLoadError 
}): ReactElement => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`boxItem ${isSelected ? "boxBorder selected-animation" : ""}`}
      role="figure"
      aria-label={`${item.nama} image ${isSelected ? ', currently selected' : ''}`}
    >
      {!imageError ? (
        <img
          src={item.gambar}
          alt={item.nama}
          style={{ 
            width: `${UI_CONSTANTS.FRUIT_ITEM_SIZE.width}px`, 
            height: `${UI_CONSTANTS.FRUIT_ITEM_SIZE.height}px`,
            opacity: imageLoaded ? 1 : 0,
            transition: `opacity ${UI_CONSTANTS.ANIMATION_DURATIONS.FADE}ms ease-in-out`
          }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.error(`Failed to load image for ${item.nama}`);
            setImageError(true);
            if (onLoadError) onLoadError();
          }}
        />
      ) : (
        <div 
          style={{ 
            width: `${UI_CONSTANTS.FRUIT_ITEM_SIZE.width}px`, 
            height: `${UI_CONSTANTS.FRUIT_ITEM_SIZE.height}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed #ccc",
            backgroundColor: "#f9f9f9"
          }}
        >
          <span>{item.nama}</span>
        </div>
      )}
      <h4 aria-label={`Fruit name: ${item.nama}`}>{item.nama}</h4>
    </div>
  );
};

export default FruitItem;