"use client";
import React, { useState } from "react";
import Heading from "../heading";
import * as z from "zod";
import Loader from "../loader";
import axios from "axios";
import UserAvatar from "../user-avatar";
import BotAvatar from "../bot-avatar";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { formSchema } from "../constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Empty } from "../empty";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
export default function Conversations() {
  interface Message {
    role: "system" | "user";
    content: string;
  }
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsloading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsloading(true);
    try {
      const response = await axios.post("/api/conversation", {
        messages: data.prompt,
      });
      const newMessage: Message = {
        role: "user",
        content: data.prompt,
      };
      const botMessage: Message = {
        role: "system",
        content: response.data,
      };
      setMessages((current) => [...current, botMessage, newMessage]);
      form.reset();
    } catch (err) {
      //TODO: Open pro Model
      console.log(err);
    } finally {
      router.refresh();
    }

    setIsloading(false);
  };

  return (
    <div>
      <Heading
        icon={MessageSquare}
        title="Conversations"
        description="Conversations with the smartest AI. Generate images, summarize text, and more."
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />

      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      disabled={isLoading}
                      placeholder="How do I calculate the ..."
                      className="border-0 outline-none focus-visible:ring-0  focus-visible:ring-transparent"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading}
            >
              Generate
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {messages.length === 0 && !isLoading && <Empty label="No messages" />}
        <div className="flex flex-col-reverse gap-y-4">
          {messages.map((message, index) => (
            <div
              className={cn(
                "p-8 w-full flex items-start gap-x-8 rounded-lg",
                message.role === "user"
                  ? "bg-white border border-black/10"
                  : "bg-muted"
              )}
              key={index}
            >
              {message.role !== "user" ? <BotAvatar /> : <UserAvatar />}
              <p className="text-sm">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
