"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactInfoSection from "@/components/checkout/ContactInfoSection";
import DeliverySection from "@/components/checkout/DeliverySection";
import { Sparkles, Lock, CreditCard } from "lucide-react";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Contact Info
  const [email, setEmail] = useState("");
  const [newsletter, setNewsletter] = useState(false);

  // Delivery Info
  const [country, setCountry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [smsUpdates, setSmsUpdates] = useState(false);

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState("standard");

  // Order Details (would be fetched from API)
  const [orderDetails, setOrderDetails] = useState({
    productName: "Premium Lashes",
    price: 29.99,
    quantity: 1,
    imageUrl: null as string | null,
  });

  const shippingCost = shippingMethod === "express" ? 15.0 : 5.0;
  const subtotal = orderDetails.price * orderDetails.quantity;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dropId: (params as any).productId,
          email,
          shippingAddress: {
            line1: address1,
            line2: address2,
            city,
            state: province,
            postal_code: postalCode,
            country,
          },
          customerName: `${firstName} ${lastName}`.trim(),
          phone,
          shippingMethod,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // In a real implementation, redirect to Stripe Checkout
        // For now, redirect to success page
        router.push(`/checkout/success?order=${data.orderId}`);
      } else {
        alert("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = email && country && lastName && address1 && city && province && postalCode;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PageFairy Checkout</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <ContactInfoSection
                email={email}
                setEmail={setEmail}
                newsletter={newsletter}
                setNewsletter={setNewsletter}
              />

              {/* Delivery Info */}
              <DeliverySection
                country={country}
                setCountry={setCountry}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                address1={address1}
                setAddress1={setAddress1}
                address2={address2}
                setAddress2={setAddress2}
                city={city}
                setCity={setCity}
                province={province}
                setProvince={setProvince}
                postalCode={postalCode}
                setPostalCode={setPostalCode}
                phone={phone}
                setPhone={setPhone}
                smsUpdates={smsUpdates}
                setSmsUpdates={setSmsUpdates}
              />

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === "standard"}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium">Standard Shipping</p>
                        <p className="text-sm text-muted-foreground">5-7 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">$5.00</span>
                  </label>

                  <label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === "express"}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm text-muted-foreground">2-3 business days</p>
                      </div>
                    </div>
                    <span className="font-medium">$15.00</span>
                  </label>
                </CardContent>
              </Card>

              {/* Payment Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-6 rounded-lg text-center">
                    <Lock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Stripe payment integration would be embedded here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Product */}
                    <div className="flex gap-4">
                      {orderDetails.imageUrl && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={orderDetails.imageUrl}
                            alt={orderDetails.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{orderDetails.productName}</p>
                        <p className="text-sm text-muted-foreground">Qty: {orderDetails.quantity}</p>
                      </div>
                      <p className="font-medium">${orderDetails.price.toFixed(2)}</p>
                    </div>

                    <hr />

                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>${shippingCost.toFixed(2)}</span>
                    </div>

                    <hr />

                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={!isValid || isLoading}
                    >
                      {isLoading ? "Processing..." : `Pay $${total.toFixed(2)}`}
                    </Button>

                    {/* Security Notice */}
                    <p className="text-xs text-muted-foreground text-center">
                      Your payment information is secure and encrypted
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
