import axios from "axios";
import { useAppSelector } from "../../../contexts/file/hooks";
import { useState } from "react";
import { useChart } from "../../visualization/hooks/useChart";

export const useSVM=(type:"classification"|"regression")=>{
    const [normalization, setNormalization] = useState("MinMaxScaler");
    const [trainTestSplit, setTrainTestSplit] = useState(40);
    const [degree, setDegree] = useState(3);
    const [maxIter, setMaxIter] = useState(20);
    const [kernel, setKernel] = useState("linear");
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
    console.log("SVM " +type+" Inference Time..");
    try {
      if (targetVariable === 'Select a Target') {
        setErrorMessage('Please select a target variable');
        return;
      }
      setErrorMessage('');
      setLoaderOptimize(true);
      const response = await axios.post(`${address}/api/optimized_model_search/${type}/svm/`, {
        file_url: file_url,
        target_column: targetVariable,
      });
      console.log(response.data);
      const train_test_split = response.data.best_train_test_split
      const hyperparametersObject = JSON.parse(response.data.best_hyperparameters);
      console.log("Result Generated")
      if (type == "classification") {
        setKernel(hyperparametersObject.svc__kernel);
        setDegree(hyperparametersObject.svc__degree);
        setMaxIter(hyperparametersObject.svc__max_iter);
      }else{
        setKernel(hyperparametersObject.svr__kernel);
        setDegree(hyperparametersObject.svr__degree);
        setMaxIter(hyperparametersObject.svr__max_iter);
      }
      setTrainTestSplit(train_test_split * 100);
    } catch (error) {
      console.error("Error during backend request:");
    }
    setLoaderOptimize(false);
  }

  const handleRunSVM = async () => {
    try {
      if (targetVariable === 'Select a Target') {
        setErrorMessage('Please select a target variable');
        return;
      }
      setErrorMessage('');
      setLoader(true);
      const response = await axios.post(`${address}/api/svm/${type}/`, {
        file_url: file_url,
        target: targetVariable,
        normalization: normalization,
        train_test_split: trainTestSplit,
        max_iter: maxIter,
        kernel: kernel,
        degree: degree,
        pca: pca,
        pca_features: pcaFeatures
      });
      console.log("Backend response received:", JSON.parse(response.data));
      setEvaluationResults(JSON.parse(response.data));
      setLoader(false);
    } catch (error) {
      console.error("Error during backend request:");
    }
  };

  
  const handleSwitchChange = (checked: boolean) => {
    setPca(!checked);
  };

  return {loaderOptimize,pcaFeatures,setPcaFeatures,handleInference,pca,handleSwitchChange,normalization,supervisedML,setNormalization,trainTestSplit,setTrainTestSplit,degree,setDegree,maxIter,setMaxIter,kernel,setKernel,evaluationResults,targetVariable,setTargetVariable,loader,errorMessage,handleRunSVM,optionsPlot}
}