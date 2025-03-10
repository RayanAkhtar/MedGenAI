import { FC } from "react";
import Image from "next/image";

type Props = {
  title: string;
  imagePath: string | null;
};

const ImageDisplay: FC<Props> = ({ title, imagePath }) => {
  return (
    <div className="mt-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
        {imagePath ? (
          <Image
            src={imagePath}
            alt={title}
            width={256}
            height={256}
            className="rounded-lg"
            unoptimized
          />
        ) : (
          <span className="text-gray-500">Image will appear here</span>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
