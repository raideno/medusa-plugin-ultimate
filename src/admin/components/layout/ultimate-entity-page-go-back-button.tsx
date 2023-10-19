import { Link } from "react-router-dom";

import { Button } from "@medusajs/ui";
import { ArrowLeft } from "@medusajs/icons";

interface UltiamteEntityPageGoBackButtonProps {
  children: string;
  href: string;
}

const UltiamteEntityPageGoBackButton = ({
  children: content,
  href,
}: UltiamteEntityPageGoBackButtonProps) => {
  return (
    <Link to={href}>
      <Button className="mb-xsmall" variant="secondary">
        <div className="gap-x-xsmall text-grey-50 inter-grey-40 inter-small-semibold flex items-center">
          <ArrowLeft width={20} height={20} />
          <span className="ml-1">{content}</span>
        </div>
      </Button>
    </Link>
  );
};

export default UltiamteEntityPageGoBackButton;
