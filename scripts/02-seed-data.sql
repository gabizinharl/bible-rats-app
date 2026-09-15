-- Inserir dados iniciais

-- Desafios padrão
INSERT INTO public.challenges (title, description, target_type, target_value, reward_badge) VALUES
('Primeiro Passo', 'Complete sua primeira leitura bíblica', 'chapters', 1, 'Iniciante'),
('Leitura de 7 dias', 'Leia a Bíblia por 7 dias consecutivos', 'days', 7, 'Perseverante'),
('Leitura de 30 dias', 'Mantenha uma sequência de 30 dias', 'days', 30, 'Dedicado'),
('Salmos Completos', 'Leia todos os 150 Salmos', 'chapters', 150, 'Adorador'),
('Novo Testamento', 'Complete a leitura do Novo Testamento', 'books', 27, 'Discípulo'),
('Evangelho de João', 'Leia todo o Evangelho de João', 'chapters', 21, 'Evangelista'),
('Provérbios Completos', 'Leia todos os Provérbios', 'chapters', 31, 'Sábio'),
('Leitor Ávido', 'Leia 100 capítulos', 'chapters', 100, 'Estudioso'),
('Maratonista', 'Leia 365 capítulos em um ano', 'chapters', 365, 'Maratonista'),
('Comunidade Ativa', 'Compartilhe 10 versículos', 'posts', 10, 'Compartilhador')
ON CONFLICT DO NOTHING;
