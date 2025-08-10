"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PriceBalance({
  isLoadingPrice,
  currentBtcPrice,
  priceChangeText,
  formatPrice,
  isLoadingBalance,
  usdBalance,
}: {
  isLoadingPrice: boolean;
  currentBtcPrice: number;
  priceChangeText: string | null;
  formatPrice: (n: number) => string;
  isLoadingBalance: boolean;
  usdBalance: number;
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="font-sans flex items-center gap-2">
          <Image
            src="/image/btcLogo.png"
            alt="Bitcoin"
            width={20}
            height={20}
            className="object-contain"
          />
          Current BTC Price & Available Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 shadow-sm">
            {isLoadingPrice ? (
              <Loader text="Loading price..." color="orange" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="text-3xl font-bold text-orange-600 font-mono">
                    {formatPrice(currentBtcPrice)}
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                {priceChangeText && (
                  <div
                    className={`text-sm font-semibold ${
                      priceChangeText.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {priceChangeText}
                  </div>
                )}
                <div className="text-sm text-orange-700 font-sans font-medium">
                  Live BTC Price
                </div>
              </div>
            )}
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-sm">
            {isLoadingBalance ? (
              <Loader text="Loading balance..." color="green" />
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600 font-mono">
                  ${usdBalance.toLocaleString()}
                </div>
                <div className="text-sm text-green-700 font-sans font-medium">
                  Available USD Balance
                </div>
                <div className="text-xs text-green-600 font-sans">
                  Ready for DCA investment
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Loader({ text, color }: { text: string; color: "green" | "orange" }) {
  return (
    <div className="space-y-2">
      <div
        className={`w-8 h-8 border-2 border-${color}-400 border-t-transparent rounded-full animate-spin mx-auto`}
      ></div>
      <div className={`text-sm text-${color}-700 font-sans`}>{text}</div>
    </div>
  );
}
