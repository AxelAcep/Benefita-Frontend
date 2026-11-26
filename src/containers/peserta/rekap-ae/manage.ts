import { useState } from "react";
import { NON_AFFILIATE_DATA, AFFILIATE_DATA } from "./data-contoh";

export function usePesertaRekapAeManage() {
  const [activeTab, setActiveTab] = useState<"non-affiliate" | "affiliate">(
    "non-affiliate",
  );
  const [selectedTahun, setSelectedTahun] = useState("");
  const [search, setSearch] = useState("");

  const data =
    activeTab === "non-affiliate" ? NON_AFFILIATE_DATA : AFFILIATE_DATA;

  return {
    activeTab,
    setActiveTab,
    selectedTahun,
    setSelectedTahun,
    search,
    setSearch,
    data,
  };
}
