import React from "react";
import Tooltip, { TooltipProps } from "./tooltip";
import {
  BellAlertSolid,
  InformationCircleSolid,
  XCircleSolid,
} from "@medusajs/icons";

type IconProps = {
  color?: string;
  size?: string | number;
} & React.SVGAttributes<SVGElement>;

type IconTooltipProps = TooltipProps & {
  type?: "info" | "warning" | "error";
} & Pick<IconProps, "size">;

const IconTooltip: React.FC<IconTooltipProps> = ({
  type = "info",
  size = 16,
  content,
  ...props
}) => {
  const icon = (type: IconTooltipProps["type"]) => {
    switch (type) {
      case "warning":
        return (
          <BellAlertSolid
            width={size}
            height={size}
            className="text-orange-40 flex"
          />
        );
      case "error":
        return (
          <XCircleSolid
            width={size}
            height={size}
            className="text-rose-40 flex"
          />
        );
      default:
        return (
          <InformationCircleSolid
            width={size}
            height={size}
            className="text-grey-40 flex"
          />
        );
    }
  };

  return (
    <Tooltip content={content} {...props}>
      {icon(type)}
    </Tooltip>
  );
};

export default IconTooltip;
