import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      <h1>landing</h1>
      <div>
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Register</Button>
        </Link>
      </div>
    </div>
  );
}
