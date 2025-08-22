"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetAllInstitutionQuery, useDeleteInstitutionMutation } from "@/lib/features/api/InstitutionApi"
import MyInstitutionCard from "@/components/institutions/my-institutions/MyInstitutionCard"
import CustomPagination from "@/components/common/CustomPagination"
import CardSkeleton from "@/components/skeleton/CardSkeleton"
import ConfirmationModal from "@/components/common/ConfirmationModal"
import { toast } from "sonner"
import NoData from "@/components/common/NoData"
import LoadFailed from "@/components/common/LoadFailed"

export default function MyInstitutionsTabs({ searchTerm: parentSearchTerm, onEditInstitution }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)
  const [activeTab, setActiveTab] = useState("created")
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [institutionToDelete, setInstitutionToDelete] = useState(null)

  // Use the searchTerm from the parent component
  const currentSearchTerm = parentSearchTerm;

  // Query for Created Institutions
  const { data: createdData, isLoading: createdLoading, isError: createdError, refetch: refetchCreatedInstitutions } = useGetAllInstitutionQuery([
    { name: "page", value: currentPage },
    { name: "limit", value: pageSize },
    { name: "searchTerm", value: currentSearchTerm },
    { name: "myInstitution", value: true },
  ], {
    skip: activeTab !== "created",
  })

  // Query for Joined Institutions
  const { data: joinedData, isLoading: joinedLoading, isError: joinedError, refetch: refetchJoinedInstitutions } = useGetAllInstitutionQuery([
    { name: "page", value: currentPage },
    { name: "limit", value: pageSize },
    { name: "searchTerm", value: currentSearchTerm },
    { name: "joinedInstitution", value: true },
  ], {
    skip: activeTab !== "joined",
  })

  const [deleteInstitution, { isLoading: isDeletingInstitution }] = useDeleteInstitutionMutation();

  // Reset current page when search term or active tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentSearchTerm, activeTab]);

  // Determine which data to use based on active tab
  const currentData = activeTab === "created" ? createdData : joinedData;
  const currentLoading = activeTab === "created" ? createdLoading : joinedLoading;
  const currentError = activeTab === "created" ? createdError : joinedError;
  const totalPages = currentData?.data?.meta?.totalPage;

  const handleDeleteInstitution = (institutionId) => {
    setInstitutionToDelete(institutionId);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (institutionToDelete) {
      try {
        await deleteInstitution(institutionToDelete).unwrap();
        toast.success("Institution deleted successfully!");
        setIsDeleteConfirmOpen(false);
        setInstitutionToDelete(null);
        if (activeTab === "created") {
          refetchCreatedInstitutions();
        } else {
          refetchJoinedInstitutions();
        }
      } catch (error) {
        console.error("Failed to delete institution:", error);
        toast.error(error?.data?.message || "Failed to delete institution.");
      }
    }
  };

  return (
    <Tabs defaultValue="created" className="w-full" onValueChange={setActiveTab}>
      <div className="flex justify-end mb-4">
        <TabsList className="w-fit">
          <TabsTrigger value="created">Created</TabsTrigger>
          <TabsTrigger value="joined">Joined</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="created">
        <div className="mt-4">
          {currentLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(pageSize)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          )}
          {currentError && <LoadFailed msg="Failed to load created institutions." />}
          {!currentLoading && !currentError && currentData?.data?.result?.length === 0 && (
            <NoData msg="No created institutions found." />
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {!currentLoading && !currentError && currentData?.data?.result?.map((institution) => (
              <MyInstitutionCard key={institution._id} institution={institution} onEdit={onEditInstitution} onDelete={handleDeleteInstitution} />
            ))}
          </div>
          <div className="my-4 absolute bottom-0 right-0 left-0">
            {!currentLoading && !currentError && totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="joined">
        <div className="mt-4">
          {currentLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(pageSize)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          )}
          {currentError && <p className="text-red-500">Error loading joined institutions.</p>}
          {!currentLoading && !currentError && currentData?.data?.result?.length === 0 && (
            <p>No joined institutions found.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {!currentLoading && !currentError && currentData?.data?.result?.map((institution) => (
              <MyInstitutionCard key={institution._id} institution={institution} onEdit={onEditInstitution} onDelete={handleDeleteInstitution} />
            ))}
          </div>
          <div className="my-4 absolute bottom-0 right-0 left-0">
            {!currentLoading && !currentError && totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </TabsContent>
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this institution? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        loading={isDeletingInstitution}
      />
    </Tabs>
  )
}