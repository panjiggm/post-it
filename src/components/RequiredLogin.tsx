import { FC } from "react";

interface RequiredLoginProps {
  text: string;
}

export const RequiredLogin: FC<RequiredLoginProps> = ({ text }) => {
  return (
    <div className="my-14 flex flex-col items-center justify-center gap-2">
      <p className="text-5xl">🔒</p>
      <h1 className="text-lg font-semibold text-gray-700">{text}</h1>
    </div>
  );
};
