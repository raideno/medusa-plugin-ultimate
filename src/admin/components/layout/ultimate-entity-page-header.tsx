import { Heading, Text } from "@medusajs/ui";

interface UltimateEntityPageHeaderProps {
  title: string;
  description?: string;
}

const UltimateEntityPageHeader = ({
  title,
  description,
}: UltimateEntityPageHeaderProps) => {
  return (
    <div className="mb-xlarge">
      <Heading className="inter-2xlarge-semibold mb-xsmall">{title}</Heading>
      <Text className="inter-base-regular text-grey-50">{description}</Text>
    </div>
  );
};

export default UltimateEntityPageHeader;
