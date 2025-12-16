-- Import photos from Supabase to Neon
-- Run this in Neon SQL Editor

-- craft-2025-10-26-nkkb5 album photos (first batch)
INSERT INTO photos (id, created_at, album_id, src, width, height, alt) VALUES
('8f05ad10-78b8-4130-af7d-193b1c27631b', '2025-11-27 07:14:15.437832+00', 'craft-2025-10-26-nkkb5', 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/18sq2m.jpg', 800, 600, 'LINE_ALBUM_20251026小小考過學家_251127_129.jpg'),
('741b4403-c06f-49df-913e-31c9cded2c0e', '2025-11-27 07:14:16.549996+00', 'craft-2025-10-26-nkkb5', 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/n1bpnl.jpg', 800, 600, 'LINE_ALBUM_20251026小小考過學家_251127_128.jpg'),
('8a1155f5-42d1-428c-ab02-966f2c02aba1', '2025-11-27 07:14:17.297278+00', 'craft-2025-10-26-nkkb5', 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/x0qxa.jpg', 800, 600, 'LINE_ALBUM_20251026小小考過學家_251127_127.jpg'),
('67c7add6-c6f9-410f-8470-cb3129419606', '2025-11-27 07:14:18.52448+00', 'craft-2025-10-26-nkkb5', 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/4s766.jpg', 800, 600, 'LINE_ALBUM_20251026小小考過學家_251127_126.jpg'),
('bab2de5b-1446-44af-a8fe-0ac200b231a8', '2025-11-27 07:14:19.464981+00', 'craft-2025-10-26-nkkb5', 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/naud4.jpg', 800, 600, 'LINE_ALBUM_20251026小小考過學家_251127_125.jpg'),
('40ffa56e-ca3e-4bc9-95bb-2f1999aca6c2', '2025-11-27 07:14:20.262427+00', 'craft-2025-10-26-nkkb5', 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/mau3dl.jpg', 800, 600, 'LINE_ALBUM_20251026小小考過學家_251127_124.jpg'),
('99ccaa05-b667-4718-969c-90c4397a6c43', '2025-11-27 07:14:21.281267+00', 'craft-2025-10-26-nkkb5', 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/ouwgl.jpg', 800, 600, 'LINE_ALBUM_20251026小小考過學家_251127_123.jpg'),
('72006ad9-0cd0-4739-9c5f-8c42f3fe6c70', '2025-11-27 07:14:22.158026+00', 'craft-2025-10-26-nkkb5', 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/2dvdkg.jpg', 800, 600, 'LINE_ALBUM_20251026小小考過學家_251127_122.jpg'),
('4f01a339-9408-4b7d-b91b-13776fa7c43a', '2025-11-27 07:14:23.240232+00', 'craft-2025-10-26-nkkb5', 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/nbweoe.jpg', 800, 600, 'LINE_ALBUM_20251026小小考過學家_251127_121.jpg'),
('ad8f5a9d-d6cf-4ccd-89d3-82b6e80fb90f', '2025-11-27 07:14:24.044996+00', 'craft-2025-10-26-nkkb5', 'https://pub-cb9efd95cb3d48e3b24ed8b345699b7f.r2.dev/gallery/craft-2025-10-26-nkkb5/3eobha.jpg', 800, 600, 'LINE_ALBUM_20251026小小考過學家_251127_120.jpg')
ON CONFLICT (id) DO NOTHING;
