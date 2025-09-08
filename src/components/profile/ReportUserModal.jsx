'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useReportUserMutation } from '@/lib/features/api/friendsApi';

const INCIDENT_TYPES = [
    'Unprofessional Behavior',
    'Failure to collaborate',
    'Spam',
    'Other',
];

const formSchema = z.object({
    incidentType: z.string().min(1, { message: "Incident type is required." }),
    additionalNote: z.string().min(10, { message: "Additional note must be at least 10 characters." }),
});

export const ReportUserModal = ({ isOpen, onClose, reportTo }) => {
    const [reportUser, { isLoading }] = useReportUserMutation();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            incidentType: '',
            additionalNote: '',
        },
    });

    const onSubmit = async (values) => {
        try {
            await reportUser({ ...values, reportTo }).unwrap();
            toast.success("User reported successfully.");
            onClose();
            form.reset();
        } catch (error) {
            console.error('Error reporting user:', error);
            toast.error(error?.data?.message || "Failed to report user.");
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Report User</DialogTitle>
                    <DialogDescription>
                        Please provide details about the incident. Your report will be reviewed by our team.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="incidentType"
                            render={({ field }) => (
                                <div className="grid gap-2">
                                    <FormLabel>Type of Incident</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select an incident type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {INCIDENT_TYPES.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="additionalNote"
                            render={({ field }) => (
                                <div className="grid gap-2">
                                    <FormLabel>Additional Note</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the incident in detail..."
                                            className="w-full"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                            <Button loading={isLoading} type="submit" disabled={isLoading}>
                                Submit Report
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};