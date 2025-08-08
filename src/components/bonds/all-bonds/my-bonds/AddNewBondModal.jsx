"use client"

import { useEffect } from "react"
import dynamic from 'next/dynamic'
import { useCreateBondMutation } from "@/lib/features/api/bondsApi"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false })

const defaultLocation = { lat: -34.6037, lng: -58.3816 };

const formSchema = z.object({
  offer: z.string().min(1, { message: "Offer is required." }),
  want: z.string().min(1, { message: "Want is required." }),
  radius: z.coerce.number().min(1, { message: "Radius must be a positive number." }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).nullable().refine(val => val !== null, { message: "Please select a location from the map." }),
});

export default function AddNewBondModal({ isOpen, onOpenChange }) {
  const [createBond, { isLoading }] = useCreateBondMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      offer: "",
      want: "",
      radius: 5,
      location: defaultLocation,
    },
  });

  const { reset, setValue, watch, formState: { errors } } = form;
  const location = watch("location");

  useEffect(() => {
    if (isOpen) {
      reset({
        offer: "",
        want: "",
        radius: 5,
        location: defaultLocation,
      });
    }
  }, [isOpen, reset]);

  const onSubmit = async (values) => {
    const newBond = {
      offer: values.offer,
      want: values.want,
      location: {
        type: "Point",
        coordinates: [values.location.lng, values.location.lat],
      },
      radius: values.radius,
    };

    try {
      await createBond(newBond).unwrap();
      toast.success("Bond created successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create bond.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Bond</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="offer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., A study table"
                        {...field}
                        aria-invalid={errors.offer ? "true" : "false"}
                        className={errors.offer ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="want"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Want</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., A bookshelf"
                        {...field}
                        aria-invalid={errors.want ? "true" : "false"}
                        className={errors.want ? "border-red-500" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel>Select Location</FormLabel>
              <FormControl>
                <div className="rounded-md overflow-hidden border">
                  {isOpen && (
                    <MapPicker
                      onLocationChange={(loc) => setValue("location", loc, { shouldValidate: true })}
                      center={location}
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage>{errors.location?.message}</FormMessage>
            </FormItem>
            <FormField
              control={form.control}
              name="radius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Radius (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      aria-invalid={errors.radius ? "true" : "false"}
                      className={errors.radius ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Bond"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}