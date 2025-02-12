export interface MLMetricsProps {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    confusionMatrix: {
      [key: string]: number;
    };
  }

export const MLMetrics = ({ accuracy, precision, recall, f1Score, confusionMatrix }: MLMetricsProps) => {
    return (
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-center mb-6">Machine Learning Metrics</h3>
        <p>Please note that since only one row of the confusion matrix will ever be non-zero, we have adjusted the definitions of the metrics provided to ensure non-zero output unless it is actually the case.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 text-center">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h4 className="font-semibold text-gray-700">Accuracy</h4>
            <p className="text-xl font-semibold">{(accuracy * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h4 className="font-semibold text-gray-700">Precision</h4>
            <p className="text-xl font-semibold">{(precision * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h4 className="font-semibold text-gray-700">Recall</h4>
            <p className="text-xl font-semibold">{(recall * 100).toFixed(2)}%</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h4 className="font-semibold text-gray-700">F1-Score</h4>
            <p className="text-xl font-semibold">{(f1Score * 100).toFixed(2)}%</p>
          </div>
        </div>
      </div>
    );
  };