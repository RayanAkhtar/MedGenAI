import { FC } from "react";

type Props = {
  onClick: () => void;
  loading: boolean;
};

const GenerateButton: FC<Props> = ({ onClick, loading }) => {
  return (
    <button onClick={onClick} className="mt-5 w-80 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition" disabled={loading}>
      {loading ? "Generating..." : "Generate Image"}
    </button>
  );
};

export default GenerateButton;
