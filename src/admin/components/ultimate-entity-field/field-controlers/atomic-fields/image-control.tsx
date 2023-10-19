import React, { useState, ChangeEvent } from "react";
import { Badge, Input } from "@medusajs/ui";
import { Product } from "@medusajs/medusa";
import { useAdminUploadFile } from "medusa-react";

import { ControlProps } from "..";
import ImageControlsImage from "./image-controls-image";
import ImageControlsUploading from "./image-controls-uploading";
import ImageControlsNoImage from "./image-controls-no-image";
import { PhotoSolid, XMark } from "@medusajs/icons";

type HTMLElementType = HTMLInputElement;

interface ImageControlProps
  extends Omit<
      React.InputHTMLAttributes<HTMLElementType>,
      "value" | "defaultValue" | "size" | "onChange"
    >,
    ControlProps<string> {}

const ImageControl = ({
  value,
  defaultValue,
  onValueChange,
  type = "image",
  ...props
}: ImageControlProps) => {
  const uploadFile = useAdminUploadFile();

  const [file, setFile] = useState<File | undefined>();
  const [isImageBeingUploaded, setIsImageBeingUploaded] =
    useState<boolean>(false);

  async function handleValueChange(value: string) {
    onValueChange(value);
  }

  async function removeImage() {
    onValueChange(null);
  }

  async function handleSelectedImageChange(selectedImage: File | undefined) {
    setFile(selectedImage);
    if (selectedImage) {
      setIsImageBeingUploaded(true);
      try {
        const uploadedImageUrl = await uploadImage(selectedImage);
        if (uploadedImageUrl) {
          handleValueChange(uploadedImageUrl);
        } else {
          // TODO: add a toast to let know of the error
        }
      } catch {
        // TODO: add a toast to let know of the error
      } finally {
        setIsImageBeingUploaded(false);
      }
    }
  }

  async function uploadImage(image: File): Promise<string | undefined> {
    try {
      const { uploads } = await uploadFile.mutateAsync([image]);
      const uploadedImageUrl = uploads[0].url;
      return uploadedImageUrl;
    } catch (error) {
      // TODO: use a toaster or something to alert about the problem
      throw Error("Failed uploading image.");
    } finally {
    }
  }

  return (
    <div className="h-full border border-dashed rounded p-2 flex flex-row items-center gap-2 h-14">
      <Badge className="h-full aspect-square">
        <PhotoSolid />
      </Badge>
      {(() => {
        if (isImageBeingUploaded) return <ImageControlsUploading />;
        if (value && value !== undefined && value !== null)
          return <ImageControlsImage imageUrl={value} />;
        // possibility to select an image
        else
          return (
            <ImageControlsNoImage
              onSelectedImageChange={handleSelectedImageChange}
            />
          );
      })()}
      {value &&
        value !== undefined &&
        value !== null &&
        !isImageBeingUploaded && (
          <Badge
            onClick={removeImage}
            className="cursor-pointer hover:opacity-75 active:opacity-50 h-full aspect-square"
          >
            <XMark />
          </Badge>
        )}
    </div>
  );
};

export default ImageControl;
