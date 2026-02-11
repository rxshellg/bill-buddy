// Core types that the whole app will use
export type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  assignedTo: string[];
  splitType: 'equal' | 'custom';
};

export type Person = {
  id: string;
  name: string;
  color: string;
  total: number;
  items: string[];
};

export type Assignment = {
  itemId: string;
  personIds: string[];
  splitType: 'equal' | 'custom';
};