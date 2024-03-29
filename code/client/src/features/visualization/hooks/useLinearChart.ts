import { useEffect, useState } from "react";
import { getColumnValues } from "../../sheets/utils/column-extractor";
import { useAppDispatch, useAppSelector } from "../../../contexts/file/hooks";
import { setOptionsPlot } from "../../../contexts/file/slice";

export const useLinearChart = (data: any[]) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [dependantIndex, setDependentIndex] = useState(0);
  const [independantIndex, setIndependantIndex] = useState(0);
  const [dependant, setDependant] = useState<string[]>([]);
  const [independant, setIndependant] = useState<string[]>([]);
  const [optionsMap, setOptionsMap] = useState<Map<string, string[]>>(new Map());
  const optionsPlot=useAppSelector((state)=>state.file.optionsPlot);
  const dispatch=useAppDispatch();

  useEffect(() => {
    if (data && data.length > 0) {
      dispatch(setOptionsPlot(data[0]));
      handleDependant(dependantIndex);
      handleIndependant(independantIndex);
      populateOptionsMap();
    }
  }, [data])

  const populateOptionsMap = async () => {
    try {
      const map = new Map<string, string[]>();
      for (let i = 0; i < optionsPlot.length; i++) {
        const values = getColumnValues(data, i);
        map.set(optionsPlot[i], values);
      }
      setOptionsMap(map);
    }
    catch (error) {
      console.log(error)
    }
  }


  const options = [
    { value: 'Horizontal Bar Chart', label: 'Horizontal Bar Chart' },
    { value: 'Vertical Bar Chart', label: 'Vertical Bar Chart' },
    { value: 'Scatter Plot', label: 'Scatter Plot' },
  ];

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };


  const handleDependant = (dependantIndex: number) => {
    setDependentIndex(dependantIndex);
    if (data) {
      setDependant(getColumnValues(data, dependantIndex));
    }
  }

  const handleIndependant = (independantIndex: number) => {
    setIndependantIndex(independantIndex);
    if (data) {
      setIndependant(getColumnValues(data, independantIndex));
    }
  }
  const chartData = {
    labels: independant,
    datasets: [
      {
        label: optionsPlot.length > 0 ? optionsPlot[dependantIndex] + " vs " + optionsPlot[independantIndex] : "",
        data: dependant,
        borderColor: "black",
        borderWidth: 2,
        backgroundColor: [
          "rgba(253, 166, 74, 0.6)",
        ]
      }
    ]
  }

  return { chartData, options, handleSelect, selectedValue, optionsPlot, dependantIndex, handleDependant, independantIndex, handleIndependant, optionsMap }
}