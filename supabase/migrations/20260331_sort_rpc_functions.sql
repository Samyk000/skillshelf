-- RPC Functions for efficient sorting by view count and like count
-- Uses existing skill_views and skill_likes tables (no counter columns needed)

-- RPC: Get skills sorted by view count
CREATE OR REPLACE FUNCTION get_skills_sorted_by_views(
  p_limit INTEGER DEFAULT 6,
  p_offset INTEGER DEFAULT 0,
  p_category TEXT DEFAULT NULL
)
RETURNS SETOF skills AS $$
BEGIN
  RETURN QUERY
  SELECT s.*
  FROM skills s
  LEFT JOIN skill_views sv ON sv.skill_id = s.id
  WHERE s.status = 'published'
    AND (p_category IS NULL OR s.category = p_category)
  GROUP BY s.id
  ORDER BY COUNT(sv.id) DESC, s.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- RPC: Get skills sorted by like count
CREATE OR REPLACE FUNCTION get_skills_sorted_by_likes(
  p_limit INTEGER DEFAULT 6,
  p_offset INTEGER DEFAULT 0,
  p_category TEXT DEFAULT NULL
)
RETURNS SETOF skills AS $$
BEGIN
  RETURN QUERY
  SELECT s.*
  FROM skills s
  LEFT JOIN skill_likes sl ON sl.skill_id = s.id
  WHERE s.status = 'published'
    AND (p_category IS NULL OR s.category = p_category)
  GROUP BY s.id
  ORDER BY COUNT(sl.id) DESC, s.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Indexes for optimal RPC performance
CREATE INDEX IF NOT EXISTS idx_skill_views_skill_id ON skill_views(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_likes_skill_id ON skill_likes(skill_id);
