import { FC } from "react";

interface ToggleProps {
  origin: string;
  onDelete: () => void;
  isDisabled: boolean;
  onToggle: (toggle: boolean) => void;
}

export const Toggle: FC<ToggleProps> = ({
  origin,
  onDelete,
  isDisabled,
  onToggle,
}) => {
  return (
    <div
      className="fixed left-0 top-0 z-20 h-full w-full bg-black/50"
      onClick={() => onToggle(false)}
    >
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col gap-6 rounded-lg bg-white p-12">
        <h2 className="text-xl">
          Are you sure you want to delete this {origin}? 😢
        </h2>
        <h3 className="text-sm text-red-600">
          Pressing the delete button will permanently delete your {origin}
        </h3>
        <button
          className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:bg-red-500"
          disabled={isDisabled}
          onClick={onDelete}
        >
          {isDisabled ? "Deleting..." : `Delete ${origin}`}
        </button>
      </div>
    </div>
  );
};
