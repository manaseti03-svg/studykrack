-- Scholaris 2.0 // Database Schema (PostgreSQL/Supabase)
-- Core Architectural Blueprint for Research and Academic Integrity

-- 1. Research Archive (Tasks Table)
-- High-viscosity knowledge nodes tracking and synthesis
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Corresponding to Firebase uid
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'Medium', -- High, Medium, Low
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Academic Ledger (Grades Table)
-- Quantified growth tracking for multi-dimensional performance
CREATE TABLE IF NOT EXISTS public.grade_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Corresponding to Firebase uid
    subject TEXT NOT NULL,
    score DECIMAL(5,2) DEFAULT 0,
    total DECIMAL(5,2) DEFAULT 100,
    weight DECIMAL(5,2) DEFAULT 1,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS) Configuration
-- Enabling security for multi-tenant isolation
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_records ENABLE ROW LEVEL SECURITY;

-- 4. Access Policies (Firebase Integration Mode)
-- Ensuring nodes are only synthesized by authorized synthesisers
CREATE POLICY "Authorized individuals can CRUD tasks" ON public.tasks
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Authorized individuals can CRUD grades" ON public.grade_records
    FOR ALL USING (auth.uid() = user_id);
