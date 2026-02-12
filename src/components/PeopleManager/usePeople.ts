import { useState } from "react";
import type { Person } from "../../types";

export const DEFAULT_COLORS = [
  "#C6005A",
  "#1F3B57",
  "#2EC4B6",
  "#FF9F1C",
  "#8AC926",
  "#FF595E",
  "#6A4C93",
  "#6F1D1B",
  "#D4A373",
  "#6B7280",
  "#4B5320",
  "#3A86FF",
  "#d80606d7"
];

export function usePeople(initial?: Person[]) {
  const [people, setPeople] = useState<Person[]>(initial || []);

  const addPerson = (name: string, color: string) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Date.now().toString();

    setPeople(prev => [...prev, { id, name, color, items: [] }]);
  };

  const removePerson = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  return {
    people,
    addPerson,
    removePerson
  };
}