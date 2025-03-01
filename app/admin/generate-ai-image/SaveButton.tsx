import { FC } from "react";

type Props = {
  onClick: () => void;
  disabled: boolean;
  saving: boolean;
};

const SaveButton: FC<Props> = ({ onClick, disabled, saving }) => {
  return (
    <button
      onClick={onClick}
      className={`mt-4 w-64 py-2 rounded-lg transition ${
        disabled ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-500"
      }`}
      disabled={disabled}
    >
      {saving ? "Saving..." : "Save Image"}
    </button>
  );
};

export default SaveButton;
