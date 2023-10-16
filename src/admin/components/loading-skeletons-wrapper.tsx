interface LoadingSkeletonsWrapperProps {
  keyPrefix: string;
  iterations: number;
  children: React.ReactNode;
}

const LoadingSkeletonsWrapper = ({
  keyPrefix,
  iterations,
  children: skeleton,
}: LoadingSkeletonsWrapperProps) => {
  return (
    <>
      {new Array(iterations).fill(0).map((_, i) => {
        return (
          <div className="w-full" key={keyPrefix + i}>
            {skeleton}
          </div>
        );
      })}
    </>
  );
};

export default LoadingSkeletonsWrapper;
