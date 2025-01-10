"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function Logout(props: any) {
  const [disabled, setDisabled] = useState(false);

  async function deactivate() {
    const supabase = createClient();

    const { error: signouterror } = await supabase.auth.signOut();
    if (signouterror) {
      console.log(signouterror);
    } else {
      window.location.replace("/");
    }
  }
  return (
    <button
      disabled={disabled}
      onClick={() => deactivate()}
      className="px-6 py-3 text-xs font-medium text-white rounded-full bg-cyan-800 w-max"
    >
      Logout
    </button>
  );
}
