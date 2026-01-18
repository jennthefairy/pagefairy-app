"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";

type RegionalSettingsStepProps = {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const regions = {
  Americas: [
    "United States",
    "Canada",
    "Mexico",
    "Brazil",
    "Argentina",
    "Chile",
    "Colombia",
    "Peru",
  ],
  Europe: [
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Sweden",
    "Poland",
    "Belgium",
    "Austria",
    "Switzerland",
  ],
  Asia: [
    "China",
    "Japan",
    "India",
    "South Korea",
    "Singapore",
    "Thailand",
    "Malaysia",
    "Indonesia",
    "Philippines",
    "Vietnam",
  ],
  Oceania: ["Australia", "New Zealand", "Fiji"],
  "Middle East": [
    "United Arab Emirates",
    "Saudi Arabia",
    "Israel",
    "Turkey",
    "Egypt",
    "Qatar",
  ],
};

export default function RegionalSettingsStep({
  data,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}: RegionalSettingsStepProps) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    data.targetCountries || []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<string[]>(["Americas"]);

  const toggleRegion = (region: string) => {
    setExpandedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const toggleAllInRegion = (region: string) => {
    const regionCountries = regions[region as keyof typeof regions];
    const allSelected = regionCountries.every((c) => selectedCountries.includes(c));

    if (allSelected) {
      setSelectedCountries((prev) =>
        prev.filter((c) => !regionCountries.includes(c))
      );
    } else {
      setSelectedCountries((prev) => [
        ...prev,
        ...regionCountries.filter((c) => !prev.includes(c)),
      ]);
    }
  };

  const handleNext = () => {
    onNext({
      targetCountries: selectedCountries,
    });
  };

  // Filter regions and countries based on search
  const filterCountries = (countries: string[]) => {
    if (!searchQuery) return countries;
    return countries.filter((country) =>
      country.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const hasSearchResults = (region: string) => {
    const filtered = filterCountries(regions[region as keyof typeof regions]);
    return filtered.length > 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Settings</CardTitle>
        <CardDescription>
          Select the countries where you want to offer your products
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* International Option */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCountries.includes("International")}
                onChange={() => toggleCountry("International")}
                className="w-4 h-4 rounded border-gray-300"
              />
              <div>
                <p className="font-medium">International (English)</p>
                <p className="text-sm text-muted-foreground">
                  Make your page available worldwide
                </p>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Selected Count */}
        <div className="text-sm text-muted-foreground">
          {selectedCountries.length} {selectedCountries.length === 1 ? "country" : "countries"}{" "}
          selected
        </div>

        {/* Regions Accordion */}
        <div className="space-y-2">
          {Object.entries(regions).map(([region, countries]) => {
            if (searchQuery && !hasSearchResults(region)) return null;

            const filteredCountries = filterCountries(countries);
            const isExpanded = expandedRegions.includes(region);
            const selectedInRegion = countries.filter((c) =>
              selectedCountries.includes(c)
            ).length;

            return (
              <Card key={region}>
                <button
                  onClick={() => toggleRegion(region)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isExpanded ? "transform rotate-180" : ""
                      }`}
                    />
                    <div className="text-left">
                      <p className="font-medium">{region}</p>
                      {selectedInRegion > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {selectedInRegion} selected
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAllInRegion(region);
                    }}
                  >
                    {countries.every((c) => selectedCountries.includes(c))
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </button>

                {isExpanded && (
                  <CardContent className="border-t p-4">
                    <div className="space-y-2">
                      {filteredCountries.map((country) => (
                        <label
                          key={country}
                          className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCountries.includes(country)}
                            onChange={() => toggleCountry(country)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span className="text-sm">{country}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} disabled={isFirstStep}>
            Back
          </Button>
          <Button onClick={handleNext}>Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
