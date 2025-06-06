"use client";
import { createClient } from "@/utils/supabase/client";
import "@mdxeditor/editor/style.css";
import MDEditor from "@uiw/react-md-editor";
import Image from "next/image";
import { redirect } from "next/navigation";
import { MouseEvent, useRef, useState } from "react";
import rehypeSanitize from "rehype-sanitize";

export default function Create() {
  async function coverChange(id: string) {
    console.log("here here");
    const bucket = "posts";

    const { error } = await supabase.storage.from(bucket).upload("/covers/" + id + ".jpg", file, { upsert: true });

    if (error) {
      alert("Error uploading file.");
    } else {
      console.log(id);

      console.log("updazted");
      return "https://xiexuntwvmedvyxokvvf.supabase.co/storage/v1/object/public/posts/covers/" + id + ".jpg";
    }
  }
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    hiddenFileInput!.current!.click();
  };
  const supabase = createClient();
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [cover, setCover] = useState("/bgcover.jpg");
  const [file, setFile] = useState<any>();
  const [changed, setChanged] = useState(false);
  const [title, setTitle] = useState("");
  const [disabled, setDisabled] = useState(false)
  async function create() {
    setDisabled(true)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: u } = await supabase.from("user").select("handle").eq("id", user?.id);
    const { data: check } = await supabase
      .from("posts")
      .select("*")
      .eq("poster", user?.id)
      .order("id", { ascending: false })
      .limit(1);
    let s;
    if (check && check.length > 0) {
      s = check[0];
    } else {
      s = [];
    }
    if (u) {
      if (s && s.excerpt == excerpt && s.title == title && s.handle == u[0]["handle"] && s.content == content) {
        return redirect("/");
      } else {
        const { error } = await supabase
          .from("posts")
          .insert({ handle: u[0]["handle"], excerpt: excerpt, content: content, title: title });
        if (error) {
          alert(error.message);
          console.log(error);
        } else {
          if (changed) {
            const { data } = await supabase
              .from("posts")
              .select("*")
              .eq("poster", user?.id)
              .order("id", { ascending: false })
              .limit(1);
            if (data) {
              const newCover = await coverChange(data[0]["id"]);
              const { error: es } = await supabase.from("posts").update({ cover: newCover }).eq("id", data[0]["id"]);
              if (es) {
                alert(es.message);
              } else {
                window.location.replace("/");
              }
            } else {
              window.location.replace("/");
            }
          }
        }
      }
    }
  }
  return (
    <div className={`overflow-hidden flex-1 gap-2 px-8 h-screen`}>
      <div className="overflow-y-scroll h-full hiddenscroll">
        <form
          className="flex overflow-x-hidden flex-col gap-2 justify-center py-10 pr-5 my-auto w-full animate-in text-foreground"
          action={create}
        >
          <h1 className="mb-6 text-2xl font-semibold text-neutral-300 md:text-3xl">Publish New Post</h1>

          <label className="mb-1 text-base text-neutral-300" htmlFor="content">
            Title
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 mr-3 mb-6 w-full text-sm text-white rounded-md border bg-black/20 border-neutral-900"
            name="content"
            placeholder="Please Type Out Your Title"
            required
            maxLength={60}
            minLength={5}
          />
          <label className="mb-1 text-base text-neutral-300" htmlFor="content">
            Excerpt
          </label>
          <textarea
            onChange={(e) => setExcerpt(e.target.value)}
            className="px-4 py-2 mr-3 mb-6 w-full text-sm text-white rounded-md border bg-black/20 border-neutral-900"
            name="content"
            placeholder="Please Type Out Your Excerpt"
            required
            maxLength={150}
            minLength={10}
          />
          <input
            onChange={(e: any) => (setCover(URL.createObjectURL(e.target.files[0])), setFile(e.target.files[0]))}
            className="hidden inset-x-0 bottom-0 mx-auto"
            type="file"
            ref={hiddenFileInput}
          />
          <label className="mb-1 text-base text-neutral-300" htmlFor="content">
            Cover Image
          </label>
          <div className="relative px-4 py-2 mb-6 rounded-md border aspect-video shrink-0">
            <img src={cover} className="object-cover absolute inset-0 rounded-md aspect-video shrink-0" alt="cover" />
            <button
              onClick={(e: any) => (setChanged(true), handleClick(e))}
              className="absolute inset-0 px-6 py-3 m-auto w-max text-xs text-white rounded-md backdrop-blur-sm h-max bg-black/60"
            >
              Change Cover
            </button>
          </div>
          <label className="mb-1 text-base text-neutral-300" htmlFor="content">
            Content
          </label>
          <div data-color-mode="dark">
            <MDEditor
              className="mx-[2px] mb-6 shrink rounded-none"
              style={{ borderRadius: "0px", height: "100px !important" }}
              value={content}
              onChange={(e) => setContent(e!)}
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
            />
          </div>

          <button disabled={disabled} className="px-8 py-4 mb-2 w-max text-xs font-semibold text-white rounded-full bg-primary-700">
            Publish This Post
          </button>
        </form>
      </div>
    </div>
  );
}
