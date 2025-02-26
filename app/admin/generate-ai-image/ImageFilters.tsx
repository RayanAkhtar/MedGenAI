import { FC } from "react";

type Props = {
  ageRange: string;
  setAgeRange: (value: string) => void;
  sex: string;
  setSex: (value: string) => void;
  disease: string;
  setDisease: (value: string) => void;
};

const ageOptions = ["", "18-25", "26-35", "36-45", "46-60", "60+"];
const sexOptions = ["", "Male", "Female", "Other"];
const diseaseOptions = ["", "Pleural Effusion"];

const ImageFilters: FC<Props> = ({ ageRange, setAgeRange, sex, setSex, disease, setDisease }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">

      {/* Age */}
      <div className="mb-4">
        <label className="block font-medium">Age Range:</label>
        <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="w-full mt-1 p-2 border rounded-lg">
          {ageOptions.map((age) => (
            <option key={age} value={age}>{age || "No Filter"}</option>
          ))}
        </select>
      </div>

      {/* Sex */}
      <div className="mb-4">
        <label className="block font-medium">Sex:</label>
        <select value={sex} onChange={(e) => setSex(e.target.value)} className="w-full mt-1 p-2 border rounded-lg">
          {sexOptions.map((option) => (
            <option key={option} value={option}>{option || "No Filter"}</option>
          ))}
        </select>
      </div>

      {/* Disease */}
      <div className="mb-4">
        <label className="block font-medium">Disease:</label>
        <select value={disease} onChange={(e) => setDisease(e.target.value)} className="w-full mt-1 p-2 border rounded-lg">
          {diseaseOptions.map((option) => (
            <option key={option} value={option}>{option || "No Filter"}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ImageFilters;
