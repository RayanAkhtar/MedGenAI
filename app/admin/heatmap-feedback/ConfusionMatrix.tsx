export const ConfusionMatrix = ({ confusionMatrix }: { confusionMatrix: { [key: string]: number } }) => (
    <div className="mb-12">
      <h4 className="text-2xl font-semibold text-center mb-6">Confusion Matrix</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 text-center">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h5 className="font-semibold text-gray-700">True Positive (TP)</h5>
          <p className="text-xl font-semibold">{confusionMatrix.truepositive}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h5 className="font-semibold text-gray-700">False Positive (FP)</h5>
          <p className="text-xl font-semibold">{confusionMatrix.falsepositive}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h5 className="font-semibold text-gray-700">True Negative (TN)</h5>
          <p className="text-xl font-semibold">{confusionMatrix.truenegative}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h5 className="font-semibold text-gray-700">False Negative (FN)</h5>
          <p className="text-xl font-semibold">{confusionMatrix.falsenegative}</p>
        </div>
      </div>
    </div>
);