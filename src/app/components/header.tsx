"use client";

const Header = ({
  name,
  children,
  textSize = "text-2xl",
}: {
  name: string;
  children?: React.ReactNode;
  textSize?: "text-lg" | "text-2xl";
}) => {
  return (
    <div className="mb-5 flex w-full items-center justify-between">
      <h1 className={`font-semibold dark:text-white ${textSize}`}>{name}</h1>
      {children}
    </div>
  );
};

export { Header };
