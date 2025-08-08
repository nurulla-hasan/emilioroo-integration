"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetAllInstitutionQuery } from "@/lib/features/api/InstitutionApi"
import MyInstitutionCard from "@/components/institutions/my-institutions/MyInstitutionCard"
import CustomPagination from "@/components/common/CustomPagination"
import CardSkeleton from "@/components/common/CardSkeleton"

export default function MyInstitutionsTabs({ searchTerm: parentSearchTerm }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(12)
  const [activeTab, setActiveTab] = useState("created")

  // Use the searchTerm from the parent component
  const currentSearchTerm = parentSearchTerm;

  // Query for Created Institutions
  const { data: createdData, isLoading: createdLoading, isError: createdError } = useGetAllInstitutionQuery([
    { name: "page", value: currentPage },
    { name: "limit", value: pageSize },
    { name: "searchTerm", value: currentSearchTerm },
    { name: "myInstitution", value: true },
  ], {
    skip: activeTab !== "created",
  })

  // Query for Joined Institutions
  const { data: joinedData, isLoading: joinedLoading, isError: joinedError } = useGetAllInstitutionQuery([
    { name: "page", value: currentPage },
    { name: "limit", value: pageSize },
    { name: "searchTerm", value: currentSearchTerm },
    { name: "joinedInstitution", value: true },
  ], {
    skip: activeTab !== "joined",
  })

  // Reset current page when search term or active tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentSearchTerm, activeTab]);

  // Determine which data to use based on active tab
  const currentData = activeTab === "created" ? createdData : joinedData;
  const currentLoading = activeTab === "created" ? createdLoading : joinedLoading;
  const currentError = activeTab === "created" ? createdError : joinedError;
  const totalPages = currentData?.data?.meta?.totalPage || 1;

  return (
    <Tabs defaultValue="created" className="w-full" onValueChange={setActiveTab}>
      <div className="flex justify-end mb-4">
        <TabsList className="w-fit">
          <TabsTrigger value="created" className="data-[state=active]:bg-primary data-[state=active]:text-white">Created</TabsTrigger>
          <TabsTrigger value="joined" className="data-[state=active]:bg-primary data-[state=active]:text-white">Joined</TabsTrigger>
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
          {currentError && <p className="text-red-500">Error loading created institutions.</p>}
          {!currentLoading && !currentError && currentData?.data?.result?.length === 0 && (
            <p>No created institutions found.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {!currentLoading && !currentError && currentData?.data?.result?.map((institution) => (
              <MyInstitutionCard key={institution._id} institution={institution} />
            ))}
          </div>
          {!currentLoading && !currentError && currentData?.data?.result?.length > pageSize && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
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
              <MyInstitutionCard key={institution._id} institution={institution} />
            ))}
          </div>
          {!currentLoading && !currentError && currentData?.data?.result?.length > pageSize && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}