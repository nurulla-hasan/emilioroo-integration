'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import MatchingBonds from "./MatchingBonds";

const MatchingBondsModal =({ isOpen, onOpenChange, bondRequestId })=> {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xlv">
        <DialogHeader>
          <DialogTitle>We Found Some Matches for You!</DialogTitle>
          <DialogDescription>
            Here are the top bond matches based on your request. You can propose a link to connect with a group.
          </DialogDescription>
        </DialogHeader>
        {/* Render MatchingBonds only when the modal is open and has an ID */}
        {isOpen && bondRequestId && <MatchingBonds bondRequestId={bondRequestId} />}
      </DialogContent>
    </Dialog>
  );
}

export default MatchingBondsModal