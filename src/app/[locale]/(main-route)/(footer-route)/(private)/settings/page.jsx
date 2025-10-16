"use client";

import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { CardHeader, CardTitle } from "@/components/ui/card";

const SettingsPage = () => {
    return (
        <div className="min-h-minus-header">
            <PageLayout>
                <CardHeader className="flex flex-row justify-between items-center p-0 mb-6">
                    <CardTitle className="text-xl font-bold text-primary dark:text-white">Settings</CardTitle>
                </CardHeader>
                <div className="max-w-7xl mx-auto">
                    <Tabs defaultValue="edit-profile">
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="edit-profile">Edit Profile</TabsTrigger>
                            <TabsTrigger value="change-password">Change Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="edit-profile">
                            <EditProfileForm />
                        </TabsContent>
                        <TabsContent value="change-password">
                            <ChangePasswordForm />
                        </TabsContent>
                    </Tabs>
                </div>
            </PageLayout>
        </div>
    );
};

export default SettingsPage;
