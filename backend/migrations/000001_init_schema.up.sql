-- 开启 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. 管理员表 (admin_users)
-- ==========================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_admin_users_username UNIQUE (username),
    CONSTRAINT uq_admin_users_email UNIQUE (email)
);

-- ==========================================
-- 2. 内容发布表 (posts)
-- ==========================================
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 内容类型
    type VARCHAR(20) NOT NULL, -- 'article', 'plog', 'project'
    sub_type VARCHAR(50),      -- 二级分类
    
    -- 核心内容
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    cover_image VARCHAR(512),
    
    -- 数据存储
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    meta JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- 状态与时间
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_posts_status CHECK (status IN ('draft', 'published', 'archived'))
);

-- ==========================================
-- 3. 索引优化 (Indexes)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_posts_type_status_published ON posts (type, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_type_created ON posts (type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_meta_gin ON posts USING gin (meta); -- GIN 索引用于 meta 查询

-- ==========================================
-- 4. 自动更新 updated_at 的触发器
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 5. 初始化默认数据 (Seed Data)
-- ==========================================
-- 插入默认管理员账号
-- username: blogadmin
-- password: 11235813
-- 如果 username 此时已存在，则什么都不做 (ON CONFLICT DO NOTHING)
INSERT INTO admin_users (username, email, password_hash, role)
VALUES (
    'blogadmin', 
    'admin@example.com', 
    crypt('11235813', gen_salt('bf')), -- 使用 pgcrypto 生成 bcrypt hash
    'super_admin'
)
ON CONFLICT (username) DO NOTHING;
