import Skeleton from "./Skeleton";

const PageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-7 w-56 rounded-xl" />
        <Skeleton className="h-4 w-80 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-2xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;
