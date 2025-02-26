import { FC } from "react";
import Image from "next/image";

type Props = {
  imagePath: string | null;
};

const ImageDisplay: FC<Props> = ({ imagePath }) => {
  return (
    <div className="mt-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
      <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
        {imagePath ? (
          <Image
            src={imagePath}
            alt="Generated Image"
            width={256}
            height={256}
            className="rounded-lg"
          />
        ) : (
          <span className="text-gray-500">Image will appear here</span>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
