import React from 'react'; import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import MyBonds from '@/components/bonds/all-bonds/my-bonds/MyBonds';

const AllBonds = () => {
    return (
        <div className='min-h-minus-header'>
            <PageLayout>
                <Tabs defaultValue="my-bonds" className="w-full">
                    <TabsList className="flex flex-wrap justify-center md:grid md:grid-cols-4 w-full">
                        <TabsTrigger value="my-bonds" className="data-[state=active]:bg-primary data-[state=active]:text-white">My Bonds</TabsTrigger>
                        <TabsTrigger value="bond-request" className="data-[state=active]:bg-primary data-[state=active]:text-white">Bond Request</TabsTrigger>
                        <TabsTrigger value="ongoing-bonds" className="data-[state=active]:bg-primary data-[state=active]:text-white">Ongoing Bonds</TabsTrigger>
                        <TabsTrigger value="completed-bonds" className="data-[state=active]:bg-primary data-[state=active]:text-white">Completed Bonds</TabsTrigger>
                    </TabsList>
                    <TabsContent value="my-bonds">
                        <div className="mt-4">
                            <MyBonds />
                        </div>
                    </TabsContent>
                    <TabsContent value="bond-request">
                        <div className="p-4 border rounded-md mt-4">
                            Bond Request Content
                        </div>
                    </TabsContent>
                    <TabsContent value="ongoing-bonds">
                        <div className="p-4 border rounded-md mt-4">
                            Ongoing Bonds Content
                        </div>
                    </TabsContent>
                    <TabsContent value="completed-bonds">
                        <div className="p-4 border rounded-md mt-4">
                            Completed Bonds Content
                        </div>
                    </TabsContent>
                </Tabs>
            </PageLayout>
        </div>
    );
};

export default AllBonds;