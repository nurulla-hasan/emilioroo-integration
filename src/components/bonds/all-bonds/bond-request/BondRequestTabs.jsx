"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BondRequestTabs() {
  return (
    <Tabs defaultValue="sent" className="w-full">
      <TabsList className="flex w-fit">
        <TabsTrigger value="sent">Sent Requests</TabsTrigger>
        <TabsTrigger value="received">Received Requests</TabsTrigger>
      </TabsList>
      <TabsContent value="sent">
        <div className="p-4 border rounded-md mt-4">
          <h3 className="text-lg font-semibold">Sent Requests Content</h3>
          <p>This section will display your sent bond requests.</p>
        </div>
      </TabsContent>
      <TabsContent value="received">
        <div className="p-4 border rounded-md mt-4">
          <h3 className="text-lg font-semibold">Received Requests Content</h3>
          <p>This section will display bond requests you have received.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
