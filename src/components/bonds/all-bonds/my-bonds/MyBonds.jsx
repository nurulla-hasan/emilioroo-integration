"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Pencil, Plus } from "lucide-react";
import BondItemSkeleton from "../../../skeleton/BondItemSkeleton";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

const MyBonds = ({ isLoading, myBonds, onEditBond, onOpenAddBondModal, onDeleteBond }) => {
  const t = useTranslations('MyBonds');
  return (
    <div className="p-6 mt-20 flex flex-col items-center bg-background rounded-md">
      <div className="w-full max-w-5xl flex justify-center mb-8">
        <Button variant="default" onClick={onOpenAddBondModal} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" /> {t('addNewBond')}
        </Button>
      </div>
      <Card className="w-full max-w-5xl bg-card p-3">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center text-primary dark:text-white">{t('myBonds')}</CardTitle>
          <Separator className="my-4"/>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <BondItemSkeleton count={5} />
          ) : myBonds?.data?.result?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={"font-bold text-lg"}>{t('offer')}</TableHead>
                  <TableHead className={"font-bold text-lg"}>{t('want')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myBonds.data.result.map((bond) => (
                  <TableRow key={bond._id}>
                    <TableCell className="font-medium">{bond.offer}</TableCell>
                    <TableCell>{bond.want}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onEditBond(bond)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteBond(bond)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">{t('noBondsFound')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBonds;
