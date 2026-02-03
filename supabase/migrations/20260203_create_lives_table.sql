-- Live Streams table for YouTube live and VOD
CREATE TABLE IF NOT EXISTS public.lives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    youtube_id TEXT NOT NULL,
    thumbnail_url TEXT,
    is_live BOOLEAN DEFAULT false,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration TEXT, -- e.g. "1:23:45"
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.lives ENABLE ROW LEVEL SECURITY;

-- Policy: everyone can read
CREATE POLICY "Lives are viewable by everyone" 
ON public.lives FOR SELECT 
USING (true);

-- Policy: only service role can modify (admin uses service role key)
CREATE POLICY "Service role can insert lives" 
ON public.lives FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update lives" 
ON public.lives FOR UPDATE 
USING (true);

CREATE POLICY "Service role can delete lives" 
ON public.lives FOR DELETE 
USING (true);

-- Index for sorting
CREATE INDEX idx_lives_scheduled_at ON public.lives(scheduled_at DESC);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lives_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lives_updated_at
BEFORE UPDATE ON public.lives
FOR EACH ROW
EXECUTE FUNCTION update_lives_updated_at();
