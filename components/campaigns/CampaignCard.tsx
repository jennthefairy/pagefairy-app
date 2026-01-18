"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Link2, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

type CampaignCardProps = {
  campaign: Campaign;
  onView: (id: string) => void;
  onCopyLink: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const statusConfig = {
  active: { label: "Active", color: "bg-green-500" },
  draft: { label: "Draft", color: "bg-gray-500" },
  pending: { label: "Pending Launch", color: "bg-yellow-500" },
  completed: { label: "Completed", color: "bg-blue-500" },
  ended: { label: "Ended", color: "bg-red-500" },
};

export default function CampaignCard({
  campaign,
  onView,
  onCopyLink,
  onEdit,
  onDelete,
}: CampaignCardProps) {
  const status =
    statusConfig[campaign.status as keyof typeof statusConfig] || statusConfig.draft;
  const progress = campaign.drop
    ? (campaign.drop.currentOrders / campaign.drop.minOrders) * 100
    : 0;
  const progressClamped = Math.min(progress, 100);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${status.color}`}
              />
              <span className="text-xs font-medium text-muted-foreground">
                {status.label}
              </span>
            </div>
            <CardTitle className="text-lg line-clamp-1">{campaign.name}</CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {campaign.product.name}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(campaign.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopyLink(campaign.id)}>
                <Link2 className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(campaign.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(campaign.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Product Image */}
        {campaign.product.imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={campaign.product.imageUrl}
              alt={campaign.product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Progress */}
        {campaign.drop && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {campaign.drop.currentOrders} / {campaign.drop.minOrders} units
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  progressClamped >= 100
                    ? "bg-green-500"
                    : "bg-primary"
                }`}
                style={{ width: `${progressClamped}%` }}
              />
            </div>
            {progressClamped >= 100 && (
              <p className="text-xs text-green-600 font-medium">Goal Unlocked! 🎉</p>
            )}
          </div>
        )}

        {/* Created Date */}
        <p className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
        </p>

        {/* Manage Button */}
        <Button onClick={() => onView(campaign.id)} className="w-full" variant="outline">
          Manage Campaign
        </Button>
      </CardContent>
    </Card>
  );
}
