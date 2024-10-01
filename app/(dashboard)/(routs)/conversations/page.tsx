// import Heading from "@/components/heading";
import Heading from "@/components/heading";
import { MessageSquare } from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div>
      <Heading
        title="Conversations"
        description="Conversations with the smartest AI. Generate images, summarize text, and more."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
    </div>
  );
}
