"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Pencil, Plus } from "lucide-react";
import AddNewBondModal from "./AddNewBondModal";

const giveBonds = [
  "Teaching Math",
  "Fixing Computer",
  "Teaching Math",
  "Fixing Computer",
];

const getBonds = [
  "Spending Time Together",
  "Cooking Help",
  "Spending Time Together",
  "Cooking Help",
];

const MyBonds = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BondItem = ({ text, onEdit, onDelete }) => (
    <div className="flex items-center justify-between py-2 px-4 bg-muted rounded-md hover:bg-muted/80 transition-colors mb-2">
      <span className="text-sm font-medium text-foreground">{text}</span>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const handleEdit = (bondText) => {
    console.log(`Edit bond: ${bondText}`);
  };

  const handleDelete = (bondText) => {
    console.log(`Delete bond: ${bondText}`);
  };

  return (
    <div className="p-6 mt-20 flex flex-col items-center bg-background rounded-md">
      <div className="w-full max-w-5xl flex justify-center mb-8">
        <Button variant="default" onClick={() => setIsModalOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add New Bond
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <Card className="bg-card p-3">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary dark:text-white">Offer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {giveBonds.map((bond, index) => (
              <BondItem
                key={`give-${index}`}
                text={bond}
                onEdit={() => handleEdit(bond)}
                onDelete={() => handleDelete(bond)}
              />
            ))}
          </CardContent>
        </Card>
        <Card className="bg-card p-3">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary dark:text-white">Want</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getBonds.map((bond, index) => (
              <BondItem
                key={`get-${index}`}
                text={bond}
                onEdit={() => handleEdit(bond)}
                onDelete={() => handleDelete(bond)}
              />
            ))}
          </CardContent>
        </Card>
      </div>
      <AddNewBondModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default MyBonds;
