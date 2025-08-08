"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDonateMutation } from "@/lib/features/api/donateApi";
import { Loader2 } from "lucide-react";

const DonateUs = () => {

    const [donate, { isLoading }] = useDonateMutation();
    const [selectedAmounts, setSelectedAmounts] = useState([]);
    const [customAmount, setCustomAmount] = useState("");

    const amounts = [10, 25, 50];

    const handleSelectAmount = (amount) => {
        setSelectedAmounts((prev) =>
            prev.includes(amount) ? prev.filter((a) => a !== amount) : [...prev, amount]
        );
    };

    const totalAmount = selectedAmounts.reduce((acc, curr) => acc + curr, 0) + Number(customAmount);

    const handleDonate = () => {
        donate({ amount: totalAmount });
    };

    return (
        <div className="min-h-minus-header flex flex-col items-center justify-between bg-primary p-6 lg:px-0 md:pt-40 pt-20 overflow-hidden relative">
            <div className="bg-card rounded-lg p-6 text-center z-10 w-full max-w-xl shadow-2xl">
                <Card className="shadow-none border-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Support the Community</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm mt-3">
                            The average donation is <span className="font-semibold">$25</span>. Every contribution helps us improve and expand!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap justify-center lg:gap-5 gap-2 mt-5">
                            {amounts.map((amount) => (
                                <Button
                                    key={amount}
                                    onClick={() => handleSelectAmount(amount)}
                                    className={cn(
                                        "w-[110px] py-2 rounded-sm text-sm font-medium focus:outline-none",
                                        selectedAmounts.includes(amount)
                                            ? "bg-primary text-white hover:bg-primary/80 hover:text-white dark:bg-primary dark:text-white"
                                            : "bg-card border border-primary hover:bg-primary/30"
                                    )}
                                    variant="outline"
                                >
                                    ${amount}
                                </Button>
                            ))}
                        </div>

                        <div className="grid justify-center w-full items-center gap-1.5 mt-5">
                            <Label htmlFor="custom-amount" className="text-muted-foreground font-medium text-center">
                                Enter Your Donation Amount
                            </Label>
                            <Input
                                type="number"
                                id="custom-amount"
                                placeholder="10.00$"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="w-2/3 mx-auto mt-2 border-primary focus:ring-primary"
                            />
                        </div>

                        <Button
                            onClick={handleDonate}
                            disabled={selectedAmounts.length === 0 && Number(customAmount) <= 0 || isLoading}
                            className={`mt-5 w-3/6 font-medium py-2 rounded-sm text-xs transition focus:outline-none ${selectedAmounts.length > 0 || Number(customAmount) > 0 ? "bg-primary " : "bg-gray-400  cursor-not-allowed"}`}
                        >
                            {isLoading && <Loader2 className=" h-4 w-4 animate-spin" />}
                            Donate now
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="relative hidden lg:block">
                <img className="absolut" src='images/wave/wave (3).png' alt="Wave 3" />
                <img className="absolut" src='images/wave/wave (3).png' alt="Wave 3" />
                <img className="absolute top-10" src='images/wave/wave (3).png' alt="Wave 3" />
            </div>
        </div>
    );
};

export default DonateUs;
