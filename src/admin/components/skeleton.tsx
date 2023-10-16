import { clx } from "@medusajs/ui";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={clx("animate-pulse rounded-md bg-grey-10", className)}
      {...props}
    />
  );
};

export default Skeleton;
