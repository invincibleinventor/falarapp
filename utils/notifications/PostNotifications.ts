export default async function PostNotifications(
  notifications: any,
  supabase: any,
  to: any,
  url: any,
  title: any,
  type: any,
  userid:any,
  postid: any,
  description: any,
  image: any
) {
  const { data: x, error: es } = await supabase
    .from("notifications")
    .select("*")
    .eq("to", to)
    .eq("url", url)
    .eq("postid", postid)
    .type("type", type);
  if (es) {
    console.log(es);
  } else {
    if (x && x.length > 0) {
    } else {
      const { data: s, error: f } = await supabase.from("user").select("notifications").eq("id", to);
      if (s && s.length > 0) {
        const { error: e } = await supabase
          .from("notifications")
          .insert({
            type: type,
            to: to,
            description: description,
            postid: postid,
            url: url,
            userid:userid,
            title: title,
            image: image,
          });
        const notify = s[0]["notifications"] + 1;
        const { error: es } = await supabase.from("user").update({ notifications: notify }).eq("id", to);

        if (e) {
          console.log(e);
        }
        if (es) {
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
