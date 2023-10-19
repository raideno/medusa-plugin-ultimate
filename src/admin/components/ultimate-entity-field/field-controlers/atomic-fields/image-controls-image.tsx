import { truncate } from "lodash";
import { useState } from "react";
import { XMark } from "@medusajs/icons";
import { Badge, IconButton, Text, Tooltip } from "@medusajs/ui";

interface ImageControlsImageProps {
  imageUrl: string;
}

const ImageControlsImage = ({ imageUrl }: ImageControlsImageProps) => {
  const [isImageUrlBeingCopied, setIsImageUrlBeingCopied] =
    useState<boolean>(false);

  async function copyImageUrl() {
    setIsImageUrlBeingCopied(true);
    try {
      await navigator.clipboard.writeText(imageUrl);
    } catch {
      // TODO: toast to alert
    } finally {
      setIsImageUrlBeingCopied(false);
    }
  }

  return (
    <Tooltip content="Click to copy image url" asChild>
      <Badge
        onClick={copyImageUrl}
        className="p-2 w-full h-full cursor-pointer hover:opacity-75 active:opacity-50"
      >
        <Text className="w-full max-w-full h-full max-h-full line-clamp-1 truncate">
          {truncate(imageUrl, {
            length: 16,
          })}
        </Text>
      </Badge>
    </Tooltip>
  );
};

export default ImageControlsImage;
