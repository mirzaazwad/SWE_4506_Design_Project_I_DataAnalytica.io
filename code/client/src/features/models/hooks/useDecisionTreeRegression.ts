import axios from "axios";
import { useState } from "react";
import { useAppSelector } from "../../../contexts/file/hooks";
import { useChart } from "../../visualization/hooks/useChart";

export const useDecisionTreeRegression = () => {
    const [normalization, setNormalization] = useState("MinMaxScaler");
  const [trainTestSplit, setTrainTestSplit] = useState(40);
  const [maxDepth, setMaxDepth] = useState(3);
  const [criterion, setCriterion] = useState("friedman_mse");
  const { supervisedML } = useChart();
  const optionsPlot = useAppSelector((state) => state.file.optionsPlot);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [targetVariable, setTargetVariable] = useState<string>("Select a Target");
  const address = import.meta.env.VITE_BACKEND_REQ_ADDRESS;
  const file_url = useAppSelector((state) => state.file.url);
  const [loader, setLoader] = useState<boolean>(false);
  const [loaderOptimize, setLoaderOptimize] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pca,setPca] = useState<boolean>(false);
  const [pcaFeatures, setPcaFeatures] = useState<number>(1);

  
  const handleInference = async ()=>{
    console.log("Decision Tree Regression Inference Time..");
    try {
      if (targetVariable === 'Select a Target') {
        setErrorMessage('Please select a target variable');
        return;
      }
      setErrorMessage('');
      setLoaderOptimize(true);
      const response = await axios.post(`${address}/api/optimized_model_search/regression/decision_tree/`, {
        file_url: file_url,
        target_column: targetVariable,
      });
      console.log(response.data);

      const train_test_split = response.data.best_train_test_split
      const hyperparametersObject = JSON.parse(response.data.best_hyperparameters);
      const optimalCriterion = hyperparametersObject.decisiontreeregressor__criterion;
      const optimalMaxDepth = hyperparametersObject.decisiontreeregressor__max_depth;

      setTrainTestSplit(train_test_split*100);
      setCriterion(optimalCriterion);
      setMaxDepth(optimalMaxDepth);

    } catch (error) {
      console.error("Error during backend request:");
    }
    setLoaderOptimize(false);
  }

  const handleRunDecisionTree = async () => {
    try {
      if (targetVariable === 'Select a Target') {
        setErrorMessage('Please select a target variable');
        return;
      }
      setErrorMessage('');
      setLoader(true);
      const response = await axios.post(`${address}/api/decision_tree/regression/`, {
        file_url: file_url,
        target: targetVariable,
        normalization: normalization,
        train_test_split: trainTestSplit,
        max_depth: maxDepth,
        criterion: criterion,
        pca: pca,
        pca_features: pcaFeatures
      });
      setEvaluationResults(JSON.parse(response.data));
      setLoader(false);
    } catch (error) {
      console.error("Error during backend request:");
    }
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setPca(!checked);
  };

  return {loaderOptimize,pcaFeatures,setPcaFeatures,handleInference,pca,handleSwitchChange,targetVariable,supervisedML,setTargetVariable,optionsPlot,normalization, setNormalization, trainTestSplit, setTrainTestSplit, maxDepth, setMaxDepth, criterion, setCriterion, evaluationResults, handleRunDecisionTree,errorMessage, loader}
}