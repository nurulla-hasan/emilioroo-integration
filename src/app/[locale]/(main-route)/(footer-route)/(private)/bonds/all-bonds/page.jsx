"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
// import MyBonds from '@/components/bonds/all-bonds/my-bonds/MyBonds';
import BondRequestTabs from '@/components/bonds/all-bonds/bond-request/BondRequestTabs';
// import { useCreateMyBondMutation } from '@/lib/features/api/bondsApi';
// import { toast } from 'sonner';
// import EditBondModal from '@/components/bonds/all-bonds/my-bonds/EditBondModal';
// import AddNewBondModal from '@/components/bonds/all-bonds/my-bonds/AddNewBondModal';
// import ConfirmationModal from '@/components/common/ConfirmationModal';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import OngoingBonds from '@/components/bonds/all-bonds/ongoing-bonds/OngoingBonds';
import CompletedBonds from '@/components/bonds/all-bonds/completed-bonds/CompletedBonds';
import CustomBreadcrumb from '@/components/common/CustomBreadcrumb';
import { useTranslations } from 'next-intl';

const AllBonds = () => {
    const t = useTranslations('AllBondsPage');
    // const [createMyBond, { isLoading: isCreatingBond }] = useCreateMyBondMutation();
    // const { data: myBonds, isLoading: isMyBondsLoading, refetch: refetchMyBonds } = useGetMyBondsQuery();
    // const [updateBond, { isLoading: isUpdatingBond }] = useUpdateMyBondMutation();
    // const [deleteBond, { isLoading: isDeletingBond }] = useDeleteMyBondMutation();

    // const [isEditBondModalOpen, setIsEditBondModalOpen] = useState(false);
    // const [selectedBond, setSelectedBond] = useState(null);
    // const [isAddBondModalOpen, setIsAddBondModalOpen] = useState(false);
    // const [isDeleteBondModalOpen, setIsDeleteBondModalOpen] = useState(false);
    // const [bondToDelete, setBondToDelete] = useState(null);

    // const handleCreateBond = async (data) => {
    //     try {
    //         await createMyBond(data).unwrap();
    //         toast.success(t("bondCreatedSuccess"));
    //         // refetchMyBonds();
    //         setIsAddBondModalOpen(false);
    //     } catch (error) {
    //         console.error("Failed to create bond:", error);
    //         toast.error(error?.data?.message || t("bondCreatedError"));
    //     }
    // };

    // const handleEditBondClick = (bond) => {
    //     setSelectedBond(bond);
    //     setIsEditBondModalOpen(true);
    // };

    // const handleDeleteBondClick = (bond) => {
    //     setBondToDelete(bond);
    //     setIsDeleteBondModalOpen(true);
    // };

    // const handleUpdateBond = async (data) => {
    //     try {
    //         await updateBond({ id: data.id, data: { offer: data.offer, want: data.want, tag: data.tag } }).unwrap();
    //         toast.success(t("bondUpdatedSuccess"));
    //         // refetchMyBonds();
    //         setIsEditBondModalOpen(false);
    //     } catch (error) {
    //         console.error("Failed to update bond:", error);
    //         toast.error(error?.data?.message || t("bondUpdatedError"));
    //     }
    // };

    // const handleConfirmDeleteBond = async () => {
    //     if (bondToDelete) {
    //         try {
    //             await deleteBond(bondToDelete._id).unwrap();
    //             toast.success(t("bondDeletedSuccess"));
    //             refetchMyBonds();
    //             setIsDeleteBondModalOpen(false);
    //         } catch (error) {
    //             console.error("Failed to delete bond:", error);
    //             toast.error(error?.data?.message || t("bondDeletedError"));
    //         }
    //     }
    // };

    // const handleOpenAddBondModal = () => {
    //     setIsAddBondModalOpen(true);
    // };

    const breadcrumbLinks = [
        { name: t('home'), href: '/' },
        { name: t('bonds'), href: '/bonds' },
        { name: t('allBonds'), href: '/bonds/all-bonds', isCurrent: true },
    ];

    return (
        <div className='relative min-h-minus-header bg-gradient-to-br from-primary/15 via-primary/10 to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950'>
            {/* <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl dark:bg-sky-500/20" />
            <div className="pointer-events-none absolute -bottom-36 -right-16 h-80 w-80 rounded-full bg-purple-300/35 blur-3xl dark:bg-purple-500/15" /> */}
            <PageLayout>
                <CustomBreadcrumb links={breadcrumbLinks} />
                <Tabs defaultValue="bond-request" className="w-full">
                    <ScrollArea className="w-full">
                        <TabsList className="flex justify-center md:grid md:grid-cols-3">
                            {/* <TabsTrigger value="my-bonds">{t('myBonds')}</TabsTrigger> */}
                            <TabsTrigger value="bond-request">{t('bondRequest')}</TabsTrigger>
                            <TabsTrigger value="ongoing-bonds">{t('ongoingBonds')}</TabsTrigger>
                            <TabsTrigger value="completed-bonds">{t('completedBonds')}</TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation='horizontal' />
                    </ScrollArea>
                    {/* <TabsContent value="my-bonds">
                        <div className="mt-4">
                            <MyBonds
                                isLoading={isMyBondsLoading}
                                myBonds={myBonds}
                                onEditBond={handleEditBondClick}
                                onOpenAddBondModal={handleOpenAddBondModal}
                                onDeleteBond={handleDeleteBondClick} />
                        </div>
                    </TabsContent> */}
                    <TabsContent value="bond-request">
                        <div className="mt-4">
                            <BondRequestTabs />
                        </div>
                    </TabsContent>
                    <TabsContent value="ongoing-bonds">
                        <div className="mt-4">
                            <OngoingBonds />
                        </div>
                    </TabsContent>
                    <TabsContent value="completed-bonds">
                        <div className="mt-4">
                            <CompletedBonds />
                        </div>
                    </TabsContent>
                </Tabs>
            </PageLayout>


            {/* Modals */}
            {/* <AddNewBondModal
                isOpen={isAddBondModalOpen}
                onOpenChange={setIsAddBondModalOpen}
                onCreateBond={handleCreateBond}
                isLoading={isCreatingBond}
            /> */}
            {/* <EditBondModal
                isOpen={isEditBondModalOpen}
                onOpenChange={setIsEditBondModalOpen}
                onUpdateBond={handleUpdateBond}
                isLoading={isUpdatingBond}
                bond={selectedBond}
            /> */}
            {/* <ConfirmationModal
                isOpen={isDeleteBondModalOpen}
                onOpenChange={setIsDeleteBondModalOpen}
                title={t('confirmDeletion')}
                description={t('confirmDeletionDescription')}
                onConfirm={handleConfirmDeleteBond}
                confirmText={t('delete')}
                loading={isDeletingBond}
            /> */}
        </div>
    );
};

export default AllBonds;