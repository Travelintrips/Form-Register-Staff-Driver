-- Create storage buckets for user documents
INSERT INTO storage.buckets (id, name, public) VALUES ('user-documents', 'user-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-documents');

-- Set up storage policies to allow public access to read files
CREATE POLICY "Allow public access to read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'user-documents');
