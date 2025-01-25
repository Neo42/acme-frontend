"use client";

type Props = {
  name: string;
  button?: React.ReactNode;
  textSize?: "text-lg" | "text-2xl";
};

const Header = ({ name, button, textSize = "text-2xl" }: Props) => {
  return (
    <div className="mb-5 flex w-full items-center justify-between">
      <h1 className={`font-semibold dark:text-white ${textSize}`}>{name}</h1>
      {button}
    </div>
  );
};

export default Header;
