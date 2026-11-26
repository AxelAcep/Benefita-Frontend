"use client";

import { useRef, useState } from "react";
import { INITIAL_BLOCKS, type Block } from "./editor";

export function useEmailBlastingManage() {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const nextId = useRef(INITIAL_BLOCKS.length + 1);

  function updateBlock(block: Block) {
    setBlocks((prev) => prev.map((item) => item.id === block.id ? block : item));
  }

  function deleteBlock(id: number) {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  }

  function addBlock(type: Block["type"], afterId?: number) {
    const id = nextId.current++;
    const block: Block = type === "text"
      ? { id, type, content: "" }
      : { id, type, rows: [["Header 1", "Header 2", "Header 3"], ["", "", ""]] };

    setBlocks((prev) => {
      const index = prev.findIndex((item) => item.id === afterId);
      if (index === -1) return [...prev, block];

      return [...prev.slice(0, index + 1), block, ...prev.slice(index + 1)];
    });
  }

  return { blocks, updateBlock, deleteBlock, addBlock };
}
