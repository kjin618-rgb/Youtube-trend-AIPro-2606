"use client";

import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "youtube_api_key";

interface ApiKeyContextValue {
  apiKey: string;
  loaded: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextValue>({
  apiKey: "",
  loaded: false,
  setApiKey: () => {},
  clearApiKey: () => {},
});

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || "";
    setApiKeyState(stored);
    setLoaded(true);
  }, []);

  function setApiKey(key: string) {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setApiKeyState(trimmed);
  }

  function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY);
    setApiKeyState("");
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, loaded, setApiKey, clearApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  return useContext(ApiKeyContext);
}
