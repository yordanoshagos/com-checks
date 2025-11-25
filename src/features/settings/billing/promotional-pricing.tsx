"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { CheckCircle, Clock, Gift } from "lucide-react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

interface PromotionalPricingProps {
  onSubscribe: (plan: "Standard" | "First100" | "FirstYear") => void;
  isLoading: boolean;
}

export function PromotionalPricing({ onSubscribe, isLoading }: PromotionalPricingProps) {
  const [discountCode, setDiscountCode] = useState("");
  
  // Get available pricing without discount code first
  const { data: defaultPricing, error: defaultError } = api.billing.getAvailablePricing.useQuery();
  
  const { data: firstYearAvailability } = api.billing.getFirstYearAvailability.useQuery();
  
  const { data: discountPricing, error: discountError, refetch: checkDiscount } = api.billing.getAvailablePricing.useQuery(
    { discountCode },
    { enabled: !!discountCode }
  ); 

  const currentPricing = discountPricing || defaultPricing;

  const handleDiscountCodeCheck = async () => {
    if (discountCode.trim()) {
      try {
        await checkDiscount();
      } catch (error) {
        toast.error(discountError?.message || 'Error checking discount code');
      }
    }
  };

  if (!currentPricing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            {currentPricing.isPromotional && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Gift className="w-3 h-3 mr-1" />
                Limited Time
              </Badge>
            )}
            <CardTitle className="text-xl">
              {currentPricing.plan === "First100" && "🎉 FIRST 100 Special Offer"}
              {currentPricing.plan === "FirstYear" && "🚀 First Year Pricing"}
              {currentPricing.plan === "Standard" && "Standard Pricing"}
            </CardTitle>
          </div>
          {currentPricing.description && (
            <CardDescription className="text-base">
              {currentPricing.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {currentPricing.isPromotional && currentPricing.originalPrice && (
              <div className="text-sm text-muted-foreground">
                <span className="line-through">${currentPricing.originalPrice}/year</span>
              </div>
            )}
            <div className="text-3xl font-bold text-primary">
              ${currentPricing.promotionalPrice || 999}
              <span className="text-lg text-muted-foreground">/year</span>
            </div>
          </div>

          {currentPricing.plan === "First100" && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Clock className="w-4 h-4" />
              Only available while spots remain in the first 100 customers
            </div>
          )}

          {currentPricing.plan === "FirstYear" && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <CheckCircle className="w-4 h-4" />
              Price increases to $999/year starting in 2027
            </div>
          )}

          <LoadingButton 
            onClick={() => {
              onSubscribe(currentPricing.plan);
            }}
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Subscribe - ${currentPricing.promotionalPrice || 999}/year
          </LoadingButton>
        </CardContent>
      </Card>

      {/* Discount Code Section - Only show if FirstYear is available or current plan is not FirstYear */}
      {currentPricing.plan !== "FirstYear" && firstYearAvailability?.isAvailable && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Have a Discount Code?</CardTitle>
            <CardDescription>
              Enter "FIRSTYEAR" for special first-year pricing at $499/year
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 justify-center">
              <div className="flex-1">
                <Label htmlFor="discount-code" className="sr-only">Discount Code</Label>
                <Input
                  id="discount-code"
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className="rounded-md h-12"
                />
              </div>
              <LoadingButton  
                onClick={handleDiscountCodeCheck}
                isLoading={isLoading}
                disabled={!discountCode.trim()}
                className="h-12 rounded-md"
              >
                Apply
              </LoadingButton >
            </div>
             {discountError && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <CrossCircledIcon className="w-4 h-4" />
               {discountError.message}
              </div>
            )}
            
            {discountCode && discountPricing?.plan === "FirstYear" && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Discount code applied! You're getting our first-year pricing.
              </div>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
}