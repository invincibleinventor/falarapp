"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function Toggle(props: any) {
  const [disabled, setDisabled] = useState(false);

  async function deactivate() {
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    async function moveRecord(
      sourceTable: string,
      destinationTable: string,
      recordId: string,
      handle: string
    ): Promise<void> {
      setDisabled(true);
      const { data: record, error } = await supabase.from(sourceTable).select("*").eq("id", recordId);

      if (error) {
        console.error("Error retrieving record:", error.message);
        return;
      }
      delete record![0]["created_at"];
      const { data: insertedRecord, error: insertError } = await supabase.from(destinationTable).insert(record![0]);

      if (insertError) {
        console.error("Error inserting record into destination table:", insertError.message);
        return;
      }

      const { data: deletedRecord, error: deleteError } = await supabase.from(sourceTable).delete().eq("id", recordId);

      if (deleteError) {
        console.error("Error deleting record from source table:", deleteError.message);
        return;
      }

      const { error: blacklisterror } = await supabase.from("usedhandles").insert({ handle: handle });
      if (blacklisterror) {
        console.log(blacklisterror);
      } else {
        const { error: signouterror } = await supabase.auth.signOut();
        if (signouterror) {
          console.log(signouterror);
        } else {
          window.location.replace("/home");
        }
      }

      console.log("Record moved successfully!");
    }
    if (user.user) {
      const { data: handle } = await supabase.from("user").select("*").eq("id", user.user.id);

      if (handle) moveRecord("user", "deactivated", user.user.id, handle[0]["handle"]);
    }
  }
  return (
    <button
      disabled={disabled}
      onClick={() => deactivate()}
      className="px-6 py-3 text-xs font-medium text-white bg-red-800 rounded-full w-max"
    >
      Delete Account
    </button>
  );
}
