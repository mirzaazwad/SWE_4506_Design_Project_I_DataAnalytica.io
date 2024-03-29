import { useState } from "react";
import { useAppDispatch } from "../contexts/file/hooks";
import { setFile, setURL, setFileId } from "../contexts/file/slice";
import { indexedDBConfig } from "../config/indexeddb";
import { useNavigate } from "react-router-dom";

export const useFile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFileInformation] = useState<File | null>(null);
  const [delimiter, setDelimiter] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const allowedFormats = [
    "text/csv",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/json",
  ];

  const FileInputSubmit = async (
    setShow: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
      setLoading(true);
      if (!file) {
        setLoading(false);
        return;
      }

      const type = file.type;

      if (!allowedFormats.includes(type)) {
        setErrorMsg("Invalid file format");
        setSelectedFile(null);
        setLoading(false);
        return;
      }

      if (file.type === "text/plain" && delimiter === "") {
        setErrorMsg("Please enter a delimiter for txt files");
        setLoading(false);
        return;
      }

      console.log("File selected:", file.name);
      dispatch(setFile(file.name));
      await indexedDBConfig.openDatabase();
      const dataRes=await indexedDBConfig.addFile({
        name: file.name,
        type: file.type,
        delimiter: delimiter,
        data: file,
      });
      setShow(false);
      if(!dataRes){
        setErrorMsg("File upload error");
        setSelectedFile(null);
      }
      else{
        dispatch(setURL(dataRes.url));
        dispatch(setFileId(dataRes.file_id));
      }
      setLoading(false);
      navigate('/data');
  };

  return {
    loading,
    file,
    setFileInformation,
    delimiter,
    setDelimiter,
    selectedFile,
    errorMsg,
    FileInputSubmit,
  };
};
