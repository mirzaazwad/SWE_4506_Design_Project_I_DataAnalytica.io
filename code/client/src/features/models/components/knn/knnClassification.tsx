import "../../assets/css/models.css";
import "../../assets/css/all-model.css";
import Loader from "../../../../partials/loader";
import LoaderOptimized from "../../../../partials/loaderOptimized";
import KNNClassificationResults from "./knnClassificationResults";
import { useKNN } from "../../hooks/useKNN";
import { ColorSwitch } from "../pcaSwitch";

const KNearestNeighbours = () => {
  const {
    supervisedML,
    pca,
    handleSwitchChange,
    handleInference,
    normalization,
    setNormalization,
    trainTestSplit,
    setTrainTestSplit,
    minkowskiMetric,
    setMinkowskiMetric,
    algorithm,
    setAlgorithm,
    distanceMetric,
    setDistanceMetric,
    weights,
    setWeights,
    n_neighbours,
    setNNeighbours,
    evaluationResults,
    targetVariable,
    setTargetVariable,
    loader,
    handleRunKNN,
    errorMessage,
    optionsPlot,
    pcaFeatures,
    setPcaFeatures,
    loaderOptimize,
  } = useKNN("classification");

  return (
    <div>
      <div className=" d-flex model-container-wrapper">
        <div className="model-container">
          <h5>
            K Nearest
            <br />
            Neighbours
          </h5>
          <div className="model-label">
            <label className="model-label">Apply PCA</label>
            <div
              style={{
                position: "absolute",
                top: "48px",
                right: "15px",
                padding: "5px",
              }}
            >
              <ColorSwitch onChange={handleSwitchChange} checked={pca} />
            </div>
            {pca && (
              <div>
                <label className="model-label">Number of Features:</label>
                <input
                  className="model-input"
                  type="number"
                  min={1}
                  max={optionsPlot.length-1}
                  value={(pcaFeatures>optionsPlot.length-1)?optionsPlot.length-1:pcaFeatures}
                  onChange={(e) => setPcaFeatures(parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
          <div className="model-label">
            <label className="model-label">Target Variable:</label>
            <select
              id="dropdown"
              className="model-select"
              value={targetVariable ? targetVariable : "Select a Target"}
              onChange={(e) => setTargetVariable(e.target.value)}
              required
            >
              <option key={null} value="Select a Target">
                Select a Target
              </option>
              {optionsPlot
                ?.slice()
                .reverse()
                .filter(
                  (option) => supervisedML.get(option) === "Classification"
                )
                .map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="model-label">Normalization:</label>
            <select
              className="model-select"
              value={normalization}
              onChange={(e) => setNormalization(e.target.value)}
            >
              <option value="MinMaxScaler">MinMax Scaler</option>
              <option value="StandardScaler">Standard Scaler</option>
              <option value="RobustScaler">Robust Scaler</option>
            </select>
          </div>
          <div>
            <label className="model-label">Percentage Test Set:</label>
            <input
              className="model-input"
              type="number"
              min={10}
              max={90}
              value={trainTestSplit>90?90:trainTestSplit}
              onChange={(e) => setTrainTestSplit(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="model-label">Number Of Neighbours:</label>
            <input
              className="model-input"
              type="number"
              value={n_neighbours<1?1:n_neighbours}
              min={1}
              onChange={(e) => setNNeighbours(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label className="model-label">Algorithm:</label>
            <select
              className="model-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="auto">Auto</option>
              <option value="ball_tree">Ball Tree</option>
              <option value="kd_tree">KD Tree</option>
              <option value="brute">Brute</option>
            </select>
          </div>
          <div>
            <label className="model-label">Distance Metric:</label>
            <select
              className="model-select"
              value={distanceMetric}
              onChange={(e) => setDistanceMetric(e.target.value)}
            >
              <option value="manhattan">Manhattan</option>
              <option value="euclidean">Euclidean</option>
              <option value="minkowski">Minkowski</option>
            </select>
          </div>
          {distanceMetric == "minkowski" && (
            <div>
              <label className="model-label">Minkowski Metric:</label>
              <input
                className="model-input"
                type="number"
                value={minkowskiMetric<1?1:minkowskiMetric}
                min={1}
                onChange={(e) => setMinkowskiMetric(parseInt(e.target.value))}
              />
            </div>
          )}
          <div>
            <label className="model-label">Weights:</label>
            <select
              className="model-select"
              value={weights}
              onChange={(e) => setWeights(e.target.value)}
            >
              <option value="uniform">Uniform</option>
              <option value="distance">Distance</option>
            </select>
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button className="model-button" onClick={handleRunKNN}>
            Run
          </button>
          <button className="inference-button" onClick={handleInference}>
              {loaderOptimize ? <LoaderOptimized /> : "Optimize"}
          </button>
        </div>
        <div className="results-container">
          {loader ? (
            <Loader />
          ) : (
            <KNNClassificationResults data={evaluationResults} />
          )}
        </div>
      </div>
    </div>
  );
};

export default KNearestNeighbours;
