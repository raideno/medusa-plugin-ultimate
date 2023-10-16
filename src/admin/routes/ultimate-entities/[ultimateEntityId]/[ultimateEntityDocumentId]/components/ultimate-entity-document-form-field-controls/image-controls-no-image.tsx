import { MouseEvent, MouseEventHandler, ChangeEvent, useRef } from "react";

import { Button } from "@medusajs/ui";

interface ImageControlsNoImageProps {
  onSelectedImageChange: (image: File | undefined) => void;
}

const ImageControlsNoImage = ({
  onSelectedImageChange,
}: ImageControlsNoImageProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function openFileInput(
    event: any | MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (event) event.preventDefault();

    const input = fileInputRef.current;
    if (input && input !== undefined && input !== null) {
      input.click();
    }
  }

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files;

    if (selectedFiles.length === 0) {
      onSelectedImageChange(undefined);
      return;
    } else {
      const selectedFile = selectedFiles[0];
      onSelectedImageChange(selectedFile);
    }
  }

  return (
    <div className="h-full w-full flex flex-row items-center gap-1">
      <input
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="images/*"
        type="file"
        className="sr-only"
      />
      <Button
        className="w-full h-full"
        type="reset"
        onClick={openFileInput}
        variant="secondary"
      >
        No Image Selected, Click to Upload.
      </Button>
    </div>
  );
};

export default ImageControlsNoImage;
