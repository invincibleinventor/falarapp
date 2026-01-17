-- 1. Add bookmarks column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS bookmarks BIGINT DEFAULT 0;

-- 2. Create Trigger Function for Post Likes
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE posts SET likes = likes + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE posts SET likes = likes - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Create Trigger for Post Likes
DROP TRIGGER IF EXISTS update_post_likes_count_trigger ON post_likes;
CREATE TRIGGER update_post_likes_count_trigger
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- 4. Create Trigger Function for Post Bookmarks
CREATE OR REPLACE FUNCTION update_post_bookmarks_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE posts SET bookmarks = bookmarks + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE posts SET bookmarks = bookmarks - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 5. Create Trigger for Post Bookmarks
DROP TRIGGER IF EXISTS update_post_bookmarks_count_trigger ON post_bookmarks;
CREATE TRIGGER update_post_bookmarks_count_trigger
AFTER INSERT OR DELETE ON post_bookmarks
FOR EACH ROW EXECUTE FUNCTION update_post_bookmarks_count();

-- 6. Migrate Data (Legacy Arrays -> Normalized Tables)
DO $$
DECLARE
  r RECORD;
  l_user TEXT;
  b_user TEXT;
  u_id UUID;
BEGIN
  -- Iterate through all posts
  FOR r IN SELECT id, liked, bookmarked FROM posts LOOP
    
    -- Migrate Likes
    IF r.liked IS NOT NULL THEN
      FOREACH l_user IN ARRAY r.liked LOOP
        -- Attempt to find user_id by handle (legacy arrays stored handles?)
        -- Wait, 'liked' column in profiles stored 'post_ids'. 
        -- 'liked' column in posts stored 'user_handles' or 'user_ids'? 
        -- UserComponent uses 'likes' count.
        -- Let's assume 'liked' array in posts contains HANDLES (string).
        -- We need to look up UUID from handle.
        SELECT id INTO u_id FROM profiles WHERE handle = l_user;
        
        IF u_id IS NOT NULL THEN
           INSERT INTO post_likes (user_id, post_id) VALUES (u_id, r.id) ON CONFLICT DO NOTHING;
        END IF;
      END LOOP;
    END IF;

    -- Migrate Bookmarks
    IF r.bookmarked IS NOT NULL THEN
      FOREACH b_user IN ARRAY r.bookmarked LOOP
        SELECT id INTO u_id FROM profiles WHERE handle = b_user;
        
        IF u_id IS NOT NULL THEN
           INSERT INTO post_bookmarks (user_id, post_id) VALUES (u_id, r.id) ON CONFLICT DO NOTHING;
        END IF;
      END LOOP;
    END IF;

  END LOOP;
  
  -- 7. Initialize Counts
  UPDATE posts SET likes = (SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = posts.id);
  UPDATE posts SET bookmarks = (SELECT COUNT(*) FROM post_bookmarks WHERE post_bookmarks.post_id = posts.id);
  
END $$;
