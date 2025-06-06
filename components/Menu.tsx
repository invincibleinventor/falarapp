"use client";

import { AppConfig } from "@/config/config";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";

export default function Menu(props: any) {
  const [dialogopened, setDialogopened] = useState(false);
  const [deleteDialog, toggledeleteDialog] = useState(false);

  const btnRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setDialogopened(false);
      }
    };

    document.body.addEventListener("click", closeDropdown);
    return () => {
      document.body.removeEventListener("click", closeDropdown);
    };
  }, []);

  async function del() {
    toggledeleteDialog(false);
    const supabase = createClient();
    const { error } = await supabase.from("quickies").delete().eq("id", props.id);

    if (error) {
      alert(error);
    } else {
      if (props.type == "qreply") {
        const { data, error: es } = await supabase.from("quickies").select("*").eq("id", props.quickieid);
        if (data) {
          const { error } = await supabase
            .from("quickies")
            .update({ comments: data[0]["comments"] - 1 })
            .eq("id", props.quickieid);
          if (error) {
            alert(error);
          } else if (es) {
            alert(es);
          } else {
            window.location.replace("/quickies");
          }
        }
      } else {
        window.location.replace("/quickies");
      }
    }
  }
  async function deleteComment() {
    toggledeleteDialog(false);

    const supabase = createClient();
    const { error } = await supabase.from(props.alt).delete().eq("comment_id", props.id);
    if (props.alt == "quickiecomments") {
      const { data } = await supabase.from("quickies").select("*").eq("id", props.postid);
      if (data) {
        const { error } = await supabase
          .from("quickies")
          .update({ comments: data[0]["comments"] - 1 })
          .eq("id", props.postid);
        if (error) {
          alert(error.message);
        }
      }
    } else {
      const { data } = await supabase.from("posts").select("*").eq("id", props.postid);
      if (data) {
        const { error } = await supabase
          .from("posts")
          .update({ replies: data[0]["comments"] - 1 })
          .eq("id", props.postid);
        if (error) {
          alert(error.message);
        }
      }
    }
    if (error) {
      alert(error.message);
    } else {
      if (props.alt == "quickiecomments") {
        window.location.replace("/quickie/" + props.postid);
      } else {
        window.location.replace("/post/" + props.postid);
      }
    }
  }
  return (
    <div className="ml-auto">
      <div
        style={{ zIndex: 1000000 }}
        className={`${props.type == "comment" ? "fixed" : "absolute"} py-4 px-2 flex flex-col content-center top-[50%] bottom-[50%] left-0 right-0 w-64 h-28 mx-auto my-auto ${AppConfig.customtheme ? "bg-neutral-900 border border-neutral-800" : "bg-black/20"}  will-change-transform transform-gpu backdrop-blur-lg rounded-xl animate-in  shadow-md  md:w-84 lg:w-96 ${deleteDialog ? "" : "hidden"}`}
      >
        <h1 className="mx-4 mb-4 text-lg font-medium text-white">
          Delete this {props.type == "comment" ? "comment" : "quickie"}?
        </h1>
        <div className="flex flex-row content-center items-center pt-0 mt-auto ml-auto w-full">
          <button
            onClick={() => toggledeleteDialog(false)}
            className="px-[18px] py-2 mt-auto text-sm font-medium text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => (props.type == "quickie" || props.type == "qreply" ? del() : deleteComment())}
            className="px-6 py-2 mt-auto mr-4 mb-1 ml-auto text-xs font-medium text-white rounded-lg bg-primary-700"
          >
            Delete It
          </button>
        </div>
      </div>
      <div className="relative pl-3 ml-auto text-neutral-300">
        <svg
          className="cursor-pointer"
          onClick={() => setDialogopened(!dialogopened)}
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          ref={btnRef}
          viewBox="0 0 24 24"
        >
          <g fill="none">
            <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
            <path
              fill="currentColor"
              d="M12 16.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m0-6a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m0-6a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"
            />
          </g>
        </svg>

        <div
          className={`absolute w-40 ${AppConfig.customtheme ? "bg-neutral-900 border border-neutral-800" : "bg-black/20"}  backdrop-blur-lg will-change-transform transform-gpu shadow-md rounded-xl -left-[calc(34*4px)] top-8 flex flex-col ${dialogopened ? "" : "hidden"}`}
        >
          <div className="flex flex-row content-center items-center px-4 py-3 space-x-3 rounded-lg cursor-pointer text-neutral-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27zM19 14.9L14.9 19H9.1L5 14.9V9.1L9.1 5h5.8L19 9.1z"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
              <path fill="currentColor" d="M11 7h2v7h-2z" />
            </svg>
            <h1 className="text-sm font-medium">Report</h1>
          </div>
          {(props.type == "comment" || props.type == "qreply" || props.type == "quickie") &&
            props.myhandle == props.handle && (
              <div
                onClick={() => toggledeleteDialog(!deleteDialog)}
                className="flex flex-row content-center items-center px-4 py-3 space-x-3 text-red-400 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                  />
                </svg>
                <h1 className="text-sm font-medium text-red-400">Delete</h1>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
