"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import PageLayout from "@/components/layout/PageLayout";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";
import MatchingBondCard from "@/components/bonds/MatchingBondCard";
import { useTranslations } from "next-intl";
import Title from "@/components/ui/Title";

const BondsPage = () => {
    const t = useTranslations('Bonds');
    const [showLocationFilter, setShowLocationFilter] = useState(true);
    const [radius, setRadius] = useState([10]);

    return (
        <div className="min-h-minus-header">
            <PageLayout>
                <CardHeader className="flex flex-row justify-between items-center p-0 mb-6">
                    <Title>{t('exchangeServicesGoods')}</Title>
                    <Link href="/bonds/all-bonds">
                        <Button className="text-sm font-semibold">
                            {t('allBonds')} <ArrowBigRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </CardHeader>

                {/* Main card containing the filter options */}
                <div className="flex justify-center items-center md:p-6">
                    <Card className="w-full max-w-4xl p-3 md:p-6">
                        <CardContent className="p-0">
                            {/* "Offer" and "Want" selects */}
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                <div className="flex flex-col space-y-1.5 w-full">
                                    <Label htmlFor="offer" className="text-sm font-medium">{t('offer')}</Label>
                                    <Select>
                                        <SelectTrigger id="give" className="w-full">
                                            <SelectValue placeholder={t('typeWhatYouCanOffer')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="teaching-math">Teaching Math</SelectItem>
                                            <SelectItem value="computer">Firing Computer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col justify-between space-y-1.5 w-full">
                                    <Label htmlFor="want" className="text-sm flex justify-end font-medium">{t('want')}</Label>
                                    <Select>
                                        <SelectTrigger id="get" className="w-full">
                                            <SelectValue placeholder={t('typeWhatYouWant')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cooking-cake">Cooking Cake</SelectItem>
                                            <SelectItem value="firing-computer">Firing Computer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* "Hide location filter" checkbox */}
                            <div className="flex items-center space-x-2 mt-6">
                                <Checkbox
                                    id="location-filter"
                                    checked={!showLocationFilter}
                                    onCheckedChange={(checked) => setShowLocationFilter(!checked)}
                                    className="primary"
                                />
                                <Label
                                    htmlFor="location-filter"
                                    className="text-sm font-medium primary cursor-pointer"
                                >
                                    {t('hideLocationFilter')}
                                </Label>
                            </div>

                            {/* Location filter (conditionally rendered) */}
                            {showLocationFilter && (
                                <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-6 mt-6">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="location" className="text-sm font-medium">{t('location')}</Label>
                                        <Input id="location" placeholder={t('enterYourLocation')} />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="radius" className="text-sm font-medium">{t('radiusKm')} {radius[0]}</Label>
                                        <Slider
                                            id="radius"
                                            defaultValue={[10]}
                                            max={100}
                                            step={1}
                                            value={radius}
                                            onValueChange={setRadius}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Matching Bonds section with title and component */}
                            <Card className="w-full mt-8 gap-0">
                                <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 md:p-6">
                                    <CardTitle className="text-lg md:text-xl font-bold">{t('matchingBonds')}</CardTitle>
                                </CardHeader>
                                <MatchingBondCard />
                            </Card>

                            {/* Search Button */}
                            <div className="flex justify-center mt-8">
                                <Button>
                                    {t('searchBond')}
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </PageLayout>
        </div>
    );
};

export default BondsPage;
