export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen relative">
      <span className=" text-xs text-blue-500">
        client loading...
      </span>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};
