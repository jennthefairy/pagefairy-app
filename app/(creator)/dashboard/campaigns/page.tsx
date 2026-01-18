"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CampaignCard from "@/components/campaigns/CampaignCard";
import { Plus, Sparkles } from "lucide-react";

type Campaign = {
  id: string;
  name: string;
  status: string;
  product: {
    name: string;
    price: string;
    imageUrl: string | null;
  };
  drop: {
    currentOrders: number;
    minOrders: number;
  } | null;
  createdAt: Date;
};

export default function CampaignsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCampaigns();
    }
  }, [status]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id: string) => {
    router.push(`/campaigns/${id}`);
  };

  const handleCopyLink = async (id: string) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (!campaign) return;

    // Construct the public URL
    const url = `${window.location.origin}/${session?.user?.username || "preview"}/${campaign.product.name.toLowerCase().replace(/\s+/g, "-")}`;

    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/campaigns/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) {
      return;
    }

    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete campaign");
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert("Failed to delete campaign");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span>Loading campaigns...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Campaigns</h1>
              <p className="text-muted-foreground mt-1">
                Manage your pre-order campaigns and track performance
              </p>
            </div>
            <Button onClick={() => router.push("/campaigns/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {campaigns.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No campaigns yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first pre-order campaign to start accepting orders from your audience
            </p>
            <Button onClick={() => router.push("/campaigns/new")} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Campaign
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onView={handleView}
                onCopyLink={handleCopyLink}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
