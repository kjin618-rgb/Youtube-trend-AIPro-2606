"use client";

import { useState } from "react";
import { useApiKey } from "@/contexts/ApiKeyContext";
import ApiKeyModal from "@/components/ApiKeyModal";
import { Key } from "lucide-react";

export default function ApiKeyButton() {
  const { apiKey, setApiKey, clearApiKey, loaded } = useApiKey();
  const [showModal, setShowModal] = useState(false);

  if (!loaded) return null;

  return (
    <>
      <button
        onClick={() => {
          clearApiKey();
          setShowModal(true);
        }}
        title="API 키 변경"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition bg-gray-100 hover:bg-gray-200 text-gray-600"
      >
        <Key size={13} />
        <span className="hidden sm:block">{apiKey ? "API 키 변경" : "API 키 설정"}</span>
      </button>
      {showModal && (
        <ApiKeyModal
          onSave={(key) => {
            setApiKey(key);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
