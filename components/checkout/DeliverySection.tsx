"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

type DeliverySectionProps = {
  country: string;
  setCountry: (country: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  address1: string;
  setAddress1: (address1: string) => void;
  address2: string;
  setAddress2: (address2: string) => void;
  city: string;
  setCity: (city: string) => void;
  province: string;
  setProvince: (province: string) => void;
  postalCode: string;
  setPostalCode: (postalCode: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  smsUpdates: boolean;
  setSmsUpdates: (smsUpdates: boolean) => void;
};

export default function DeliverySection(props: DeliverySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country/Region *
          </label>
          <select
            id="country"
            value={props.country}
            onChange={(e) => props.setCountry(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          >
            <option value="">Select a country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            {/* Add more countries as needed */}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name (optional)
            </label>
            <Input
              id="firstName"
              value={props.firstName}
              onChange={(e) => props.setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name *
            </label>
            <Input
              id="lastName"
              value={props.lastName}
              onChange={(e) => props.setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address1" className="text-sm font-medium">
            Address *
          </label>
          <Input
            id="address1"
            placeholder="Street address"
            value={props.address1}
            onChange={(e) => props.setAddress1(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address2" className="text-sm font-medium">
            Apartment, suite, etc. (optional)
          </label>
          <Input
            id="address2"
            value={props.address2}
            onChange={(e) => props.setAddress2(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              City *
            </label>
            <Input
              id="city"
              value={props.city}
              onChange={(e) => props.setCity(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="province" className="text-sm font-medium">
              State/Province *
            </label>
            <Input
              id="province"
              value={props.province}
              onChange={(e) => props.setProvince(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="postalCode" className="text-sm font-medium">
              Postal Code *
            </label>
            <Input
              id="postalCode"
              value={props.postalCode}
              onChange={(e) => props.setPostalCode(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone (optional)
          </label>
          <Input
            id="phone"
            type="tel"
            value={props.phone}
            onChange={(e) => props.setPhone(e.target.value)}
          />
        </div>

        {props.phone && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={props.smsUpdates}
              onChange={(e) => props.setSmsUpdates(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm">Text me with order updates</span>
          </label>
        )}
      </CardContent>
    </Card>
  );
}
