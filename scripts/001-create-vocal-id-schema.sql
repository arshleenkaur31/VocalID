-- VOCAL-ID Database Schema
-- Creates tables for voice authentication system

-- Users table for basic user information
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Voice profiles table for storing voice biometric data
CREATE TABLE IF NOT EXISTS voice_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profile_name VARCHAR(100) NOT NULL,
    voice_template_hash TEXT NOT NULL, -- Encrypted voice biometric template
    enrollment_phrases TEXT[] NOT NULL, -- Array of phrases used for enrollment
    enrollment_completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    confidence_threshold DECIMAL(5,4) DEFAULT 0.95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Authentication attempts table for logging all auth attempts
CREATE TABLE IF NOT EXISTS authentication_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    voice_profile_id UUID REFERENCES voice_profiles(id) ON DELETE CASCADE,
    challenge_phrase TEXT NOT NULL,
    spoken_phrase TEXT,
    confidence_score DECIMAL(5,4),
    liveness_score DECIMAL(5,4),
    anti_spoofing_score DECIMAL(5,4),
    attempt_result VARCHAR(20) NOT NULL CHECK (attempt_result IN ('success', 'failed', 'rejected')),
    failure_reason TEXT,
    ip_address INET,
    user_agent TEXT,
    device_fingerprint TEXT,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge phrases table for dynamic phrase generation
CREATE TABLE IF NOT EXISTS challenge_phrases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phrase_text TEXT NOT NULL UNIQUE,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    language_code VARCHAR(5) DEFAULT 'en-US',
    category VARCHAR(50), -- e.g., 'numbers', 'words', 'sentences'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security events table for audit logging
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- e.g., 'enrollment', 'auth_success', 'auth_failure', 'suspicious_activity'
    event_description TEXT,
    severity_level VARCHAR(20) DEFAULT 'info' CHECK (severity_level IN ('info', 'warning', 'error', 'critical')),
    ip_address INET,
    user_agent TEXT,
    additional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table for system administration
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'analyst')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_voice_profiles_user_id ON voice_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_profiles_active ON voice_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_user_id ON authentication_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_attempted_at ON authentication_attempts(attempted_at);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_challenge_phrases_active ON challenge_phrases(is_active);

-- Insert some default challenge phrases
INSERT INTO challenge_phrases (phrase_text, difficulty_level, category) VALUES
('The quick brown fox jumps over the lazy dog', 3, 'sentences'),
('My voice is my password', 1, 'security'),
('Authentication successful', 2, 'security'),
('Please verify my identity', 2, 'security'),
('Seven eight nine ten eleven twelve', 2, 'numbers'),
('Technology innovation security', 3, 'words'),
('Biometric voice recognition system', 4, 'technical'),
('Artificial intelligence machine learning', 4, 'technical'),
('Secure access granted successfully', 3, 'security'),
('Voice authentication protocol active', 4, 'technical')
ON CONFLICT (phrase_text) DO NOTHING;
