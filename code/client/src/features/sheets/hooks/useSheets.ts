import { useEffect, useState} from "react";
import { renderGrid } from "../utils/grid-renderer";
import { useAppSelector } from "../../../contexts/file/hooks";
import React from "react";
import { indexedDBConfig } from "../../../config/indexeddb";
import { useSave } from "./useSave";

export const useSheets = () => {
  const [currentCell, setCurrentCell] = useState<string>("");
  const [viewValue, setViewValue] = useState<string>("");
  const [gridRows, setGridRows] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {save}=useSave();
  const [data, setData] = useState<any[] | null>([]);
  const file=useAppSelector((state)=>state.file.file);
  const url = useAppSelector((state) => state.file.url);
  const file_id=useAppSelector((state)=>state.file.file_id);
  const uploaded_at=useAppSelector((state)=>state.file.uploaded_at);

  const updateGrid = (updatedGridRows: JSX.Element[]) => {
    setGridRows(updatedGridRows);
  };

  const onCellChange = async (Key: string, Value: string) => {
    const updatedGridRows = gridRows.map((row) => {
      return {
        ...row,
        props: {
          ...row.props,
          children: React.Children.map(row.props.children, (cell) =>
            cell.props.Key === Key
              ? React.cloneElement(cell, { Value })
              : cell
          ),
        },
      };
    });
    updateGrid(updatedGridRows);
    setData(save(updatedGridRows));
  };


  const render = async (data:any[]|null) => {
    if(null){
      setLoading(false);
      return;
    }
    const newGridRows = await renderGrid(
      data,
      setCurrentCell,
      setViewValue,
      setLoading,
      onCellChange
    );
    setGridRows(newGridRows);
    setLoading(false);
  };

  const getFile = async() => {
      try {
        if (url) {
          const open = await indexedDBConfig.openDatabase();
          if (open) {
            const fetchedData=await indexedDBConfig.getFileByURL('byUrl', url,file_id,file,uploaded_at );
            await render(fetchedData);
            setData(fetchedData);
          }
          else {
            throw Error("Database not opened");
          }
        }
        else{
          setLoading(false);
        }
      } catch (error) {
        await render([]);
        setData([]);
        setLoading(false);
      }
    };

  useEffect(() => {
    setLoading(true);
    getFile();
  }, [url]);


  return {
    data,
    currentCell,
    gridRows,
    viewValue,
    setViewValue,
    loading,
    onCellChange
  };
};
