import { createClient } from "../supabase/client";
export default async function notification(
  notifications: any,
  supabase: any,
  to: any,
  url: any,
  title: any,
  type: any,
  userid: any,
  description: any,
  image: any
) {
  if (type == "follow") {
    const { data: x, error: es } = await supabase.from("notifications").select("*").eq("to", to).eq("url", url);
    if (es) {
      alert(es.message);
    } else {
      if (x && x.length > 0) {
      } else {
        const { data: s, error: f } = await supabase.from("user").select("notifications").eq("id", to);
        if (s && s.length > 0) {
          const { error: e } = await supabase.from("notifications").insert({
            type: type,
            to: to,
            userid: userid,
            description: description,
            url: url,
            title: title,
            image: image,
          });
          const notify = s[0]["notifications"] + 1;
          const { error: es } = await supabase.from("user").update({ notifications: notify }).eq("id", to);

          if (e) {
            alert(e.message);
            console.log(e);
          }
          if (es) {
            alert(es.message);
            console.log(es);
          }
        } else {
          if (f) {
            console.log(f);
            alert(f.message);
          }
        }
      }
    }
  }
  if (type == "mention") {
    const { data: x, error: es } = await supabase.from("notifications").select("*").eq("to", to).eq("url", url);
    if (es) {
      console.log(es);

      alert(es.message);
    } else {
      if (x && x.length > 0) {
      } else {
        const { error: e } = await supabase.from("notifications").insert({
          seen: false,
          postid: 0,
          type: type,
          to: to,
          userid: userid,
          description: description,
          url: url,
          title: title,
          image: image,
        });
        const { data: s, error: f } = await supabase.from("user").select("*").eq("id", to);
        let notify = 0;
        if (s && s.length > 0) {
          notify = s[0]["notifications"] + 1;
        }

        const { error: es } = await supabase.from("user").update({ notifications: notify }).eq("id", to);

        if (e) {
          alert(e.message);
          console.log(e);
        }
        if (es) {
          alert(es.message);
          console.log(es);
        }
      }
    }
  }
}
