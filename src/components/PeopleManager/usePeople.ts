import { useState } from "react";

export type Person = {
  id: string;
  name: string;
  color: string;
  total: number;
};

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
  "#6B7280"
];

export function usePeople(initial?: Person[]) {
  const [people, setPeople] = useState<Person[]>(initial || []);

  const addPerson = (name: string, color: string) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Date.now().toString();

    setPeople(prev => [...prev, { id, name, color, total: 0 }]);
  };

  const removePerson = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
  };

  const updateTotal = (id: string, amount: number) => {
    setPeople(prev =>
      prev.map(p =>
        p.id === id ? { ...p, total: amount } : p
      )
    );
  };

  const grandTotal = people.reduce((sum, p) => sum + p.total, 0);

  return {
    people,
    addPerson,
    removePerson,
    updateTotal,
    grandTotal
  };
}