-- Enable row level security for storage.buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create policies for storage.buckets
DROP POLICY IF EXISTS "Allow public access to buckets" ON storage.buckets;
CREATE POLICY "Allow public access to buckets"
ON storage.buckets FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to create buckets" ON storage.buckets;
CREATE POLICY "Allow authenticated users to create buckets"
ON storage.buckets FOR INSERT
TO authenticated
USING (true);

-- Enable row level security for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for storage.objects
DROP POLICY IF EXISTS "Allow public access to objects" ON storage.objects;
CREATE POLICY "Allow public access to objects"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-documents');

DROP POLICY IF EXISTS "Allow authenticated users to upload objects" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload objects"
ON storage.objects FOR INSERT
TO authenticated
USING (bucket_id = 'user-documents');

DROP POLICY IF EXISTS "Allow authenticated users to update objects" ON storage.objects;
CREATE POLICY "Allow authenticated users to update objects"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-documents');

DROP POLICY IF EXISTS "Allow authenticated users to delete objects" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete objects"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-documents');
