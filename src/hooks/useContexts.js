import { useContext } from "react";
import { LojaContext } from "../contexts/LojaProvider";

export default function useContexts() {
  return useContext(LojaContext)
}