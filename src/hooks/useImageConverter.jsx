import { useCallback, useState } from "react";


function useImageConverter(){
  const [base64, setBase64] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const convertFile = useCallback((file) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setBase64(null);

    const reader = new FileReader();

    reader.onload = () => {
      setBase64(reader.result);
      setIsLoading(false);
    };

    reader.onerror = (e) => {
      setError('Failed to read file.');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  }, []);

  return {base64, error, isLoading, convertFile}
};

export default useImageConverter;
