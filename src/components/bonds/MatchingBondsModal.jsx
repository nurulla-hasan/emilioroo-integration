'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import MatchingBonds from "./MatchingBonds";

const MatchingBondsModal =({ isOpen, onOpenChange, bondRequestId })=> {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] min-h-96 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>We Finding Some Matches for You!</DialogTitle>
          <DialogDescription className="sr-only">
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