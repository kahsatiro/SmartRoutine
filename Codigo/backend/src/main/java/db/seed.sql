-- ============================================
-- SEED.SQL - População Inicial do Banco de Dados
-- Sistema: Smart Routine - Gerenciamento de Alimentos e Receitas
-- ============================================

-- ============================================
-- TABELA: USUARIO
-- ============================================
INSERT INTO usuario (nome, email, senha, data_nascimento)
VALUES ('Ana Carolina Silva', 'ana.silva@email.com', '$2b$10$xQYZ123...hashSenha1', '1992-03-15'),
       ('Bruno Santos Costa', 'bruno.costa@email.com', '$2b$10$xQYZ123...hashSenha2', '1988-07-22'),
       ('Carla Fernandes', 'carla.fernandes@email.com', '$2b$10$xQYZ123...hashSenha3', '1995-11-08'),
       ('Daniel Oliveira', 'daniel.oliveira@email.com', '$2b$10$xQYZ123...hashSenha4', '1990-01-30'),
       ('Elena Rodrigues', 'elena.rodrigues@email.com', '$2b$10$xQYZ123...hashSenha5', '1987-09-14'),
       ('Felipe Almeida', 'felipe.almeida@email.com', '$2b$10$xQYZ123...hashSenha6', '1993-05-27'),
       ('Gabriela Lima', 'gabriela.lima@email.com', '$2b$10$xQYZ123...hashSenha7', '1991-12-03');

-- ============================================
-- TABELA: ALIMENTO
-- ============================================
INSERT INTO alimento (nome, categoria)
VALUES
-- Laticínios
('Leite Integral', 'Laticínios'),
('Leite Desnatado', 'Laticínios'),
('Queijo Mussarela', 'Laticínios'),
('Iogurte Natural', 'Laticínios'),
('Manteiga', 'Laticínios'),
('Requeijão', 'Laticínios'),

-- Grãos e Cereais
('Arroz Branco', 'Grãos'),
('Arroz Integral', 'Grãos'),
('Feijão Preto', 'Grãos'),
('Feijão Carioca', 'Grãos'),
('Lentilha', 'Grãos'),
('Macarrão Espaguete', 'Massas'),
('Macarrão Penne', 'Massas'),

-- Vegetais
('Tomate', 'Vegetais'),
('Cebola', 'Vegetais'),
('Alho', 'Temperos'),
('Cenoura', 'Vegetais'),
('Batata', 'Vegetais'),
('Brócolis', 'Vegetais'),
('Alface', 'Vegetais'),
('Pimentão Vermelho', 'Vegetais'),

-- Frutas
('Banana', 'Frutas'),
('Maçã', 'Frutas'),
('Laranja', 'Frutas'),
('Limão', 'Frutas'),
('Morango', 'Frutas'),

-- Carnes e Proteínas
('Frango (Peito)', 'Carnes'),
('Carne Bovina (Patinho)', 'Carnes'),
('Peixe (Tilápia)', 'Carnes'),
('Ovos', 'Proteínas'),

-- Temperos e Condimentos
('Sal', 'Temperos'),
('Óleo de Soja', 'Condimentos'),
('Azeite de Oliva', 'Condimentos'),
('Molho de Tomate', 'Condimentos'),
('Vinagre', 'Condimentos'),
('Orégano', 'Temperos'),
('Pimenta do Reino', 'Temperos'),

-- Padaria
('Pão Francês', 'Padaria'),
('Pão Integral', 'Padaria'),

-- Bebidas
('Café em Pó', 'Bebidas'),
('Suco de Laranja', 'Bebidas');

-- ============================================
-- TABELA: RECEITA
-- ============================================
INSERT INTO receita (titulo, porcao, tempo_preparo, informacoes)
VALUES ('Arroz Integral com Legumes',
        '4 porções',
        35,
        '{
            "ingredientes": [
                "2 xícaras de arroz integral",
                "1 cenoura picada",
                "1 brócolis pequeno",
                "1 cebola média",
                "2 dentes de alho",
                "3 xícaras de água",
                "Sal a gosto",
                "2 colheres de azeite"
            ],
            "modo_preparo": [
                "Refogue o alho e a cebola no azeite",
                "Adicione o arroz e refogue por 2 minutos",
                "Acrescente a água e o sal",
                "Quando ferver, adicione cenoura e brócolis",
                "Cozinhe em fogo baixo por 25 minutos"
            ],
            "dificuldade": "Fácil",
            "tipo_refeicao": "Almoço/Jantar",
            "calorias": 280,
            "tags": ["vegetariano", "saudável", "integral"]
        }'::jsonb),
       ('Frango Grelhado com Salada',
        '2 porções',
        25,
        '{
            "ingredientes": [
                "2 filés de peito de frango",
                "1 alface americana",
                "2 tomates",
                "1 cebola roxa",
                "Suco de 1 limão",
                "Azeite a gosto",
                "Sal e pimenta do reino"
            ],
            "modo_preparo": [
                "Tempere o frango com sal, pimenta e limão",
                "Deixe marinar por 15 minutos",
                "Grelhe o frango por 10 minutos de cada lado",
                "Prepare a salada com alface, tomate e cebola",
                "Tempere com azeite e sal"
            ],
            "dificuldade": "Fácil",
            "tipo_refeicao": "Almoço/Jantar",
            "calorias": 350,
            "tags": ["proteico", "low-carb", "fitness"]
        }'::jsonb),
       ('Macarrão ao Molho de Tomate',
        '3 porções',
        20,
        '{
            "ingredientes": [
                "300g de macarrão espaguete",
                "1 lata de molho de tomate",
                "3 dentes de alho",
                "1 cebola",
                "Manjericão fresco",
                "Queijo ralado",
                "Azeite",
                "Sal e orégano"
            ],
            "modo_preparo": [
                "Cozinhe o macarrão em água fervente com sal",
                "Refogue alho e cebola no azeite",
                "Adicione o molho de tomate e temperos",
                "Deixe cozinhar por 10 minutos",
                "Misture com o macarrão e sirva com queijo"
            ],
            "dificuldade": "Fácil",
            "tipo_refeicao": "Almoço/Jantar",
            "calorias": 420,
            "tags": ["vegetariano", "italiano", "rápido"]
        }'::jsonb),
       ('Omelete Proteica',
        '1 porção',
        10,
        '{
            "ingredientes": [
                "3 ovos",
                "1 tomate picado",
                "1/4 de cebola",
                "Queijo mussarela",
                "Sal e orégano",
                "1 colher de azeite"
            ],
            "modo_preparo": [
                "Bata os ovos com sal",
                "Adicione tomate e cebola picados",
                "Aqueça uma frigideira com azeite",
                "Despeje a mistura e espalhe",
                "Adicione queijo, dobre e sirva"
            ],
            "dificuldade": "Muito Fácil",
            "tipo_refeicao": "Café da Manhã/Lanche",
            "calorias": 280,
            "tags": ["proteico", "rápido", "fitness"]
        }'::jsonb),
       ('Feijão Tropeiro',
        '6 porções',
        45,
        '{
            "ingredientes": [
                "500g de feijão cozido",
                "200g de bacon",
                "3 ovos",
                "2 xícaras de farinha de mandioca",
                "2 cebolas",
                "3 dentes de alho",
                "Cheiro verde",
                "Sal e pimenta"
            ],
            "modo_preparo": [
                "Frite o bacon até ficar crocante",
                "Refogue alho e cebola na gordura do bacon",
                "Adicione o feijão escorrido",
                "Acrescente os ovos mexidos",
                "Adicione a farinha aos poucos mexendo sempre",
                "Finalize com cheiro verde"
            ],
            "dificuldade": "Média",
            "tipo_refeicao": "Almoço/Jantar",
            "calorias": 480,
            "tags": ["brasileiro", "tradicional", "substancioso"]
        }'::jsonb),
       ('Smoothie de Frutas',
        '2 copos',
        5,
        '{
            "ingredientes": [
                "1 banana congelada",
                "10 morangos",
                "1 copo de leite",
                "1 colher de mel",
                "Gelo a gosto"
            ],
            "modo_preparo": [
                "Coloque todos os ingredientes no liquidificador",
                "Bata até ficar homogêneo",
                "Sirva imediatamente"
            ],
            "dificuldade": "Muito Fácil",
            "tipo_refeicao": "Café da Manhã/Lanche",
            "calorias": 180,
            "tags": ["saudável", "rápido", "refrescante", "vegetariano"]
        }'::jsonb),
       ('Peixe Assado com Legumes',
        '2 porções',
        40,
        '{
            "ingredientes": [
                "2 filés de tilápia",
                "2 batatas médias",
                "1 cenoura",
                "1 pimentão",
                "Suco de 1 limão",
                "Azeite",
                "Alecrim, sal e pimenta"
            ],
            "modo_preparo": [
                "Tempere o peixe com limão, sal e pimenta",
                "Corte os legumes em rodelas",
                "Disponha em uma assadeira com azeite",
                "Coloque o peixe sobre os legumes",
                "Asse em forno médio por 30 minutos"
            ],
            "dificuldade": "Fácil",
            "tipo_refeicao": "Almoço/Jantar",
            "calorias": 320,
            "tags": ["saudável", "assado", "leve"]
        }'::jsonb),
       ('Salada Caesar',
        '2 porções',
        15,
        '{
            "ingredientes": [
                "1 alface romana",
                "100g de peito de frango grelhado",
                "Queijo parmesão ralado",
                "Croutons",
                "Molho caesar",
                "Limão"
            ],
            "modo_preparo": [
                "Lave e rasgue a alface",
                "Corte o frango em tiras",
                "Misture alface, frango e croutons",
                "Adicione o molho caesar",
                "Finalize com parmesão e limão"
            ],
            "dificuldade": "Fácil",
            "tipo_refeicao": "Almoço/Jantar",
            "calorias": 290,
            "tags": ["salada", "proteico", "rápido"]
        }'::jsonb);

-- ============================================
-- TABELA: REGISTRA (Compras de Alimentos)
-- ============================================
INSERT INTO registra (alimento_id, usuario_id, data_compra, data_validade, unidade_medida, lote, quantidade)
VALUES
-- Compras da Ana (usuario_id: 1)
(1, 1, '2025-10-18', '2025-10-25', 'Litros', 'L2025101501', 2.0),
(7, 1, '2025-10-18', '2026-04-18', 'Kg', 'A2025100215', 5.0),
(9, 1, '2025-10-18', '2026-10-18', 'Kg', 'F2025092801', 1.0),
(14, 1, '2025-10-19', '2025-10-26', 'Kg', NULL, 1.5),
(15, 1, '2025-10-19', '2025-10-28', 'Kg', NULL, 0.5),
(28, 1, '2025-10-15', '2026-01-15', 'Unidade', 'P2025100301', 3.0),

-- Compras do Bruno (usuario_id: 2)
(2, 2, '2025-10-17', '2025-10-24', 'Litros', 'L2025101402', 1.0),
(4, 2, '2025-10-17', '2025-10-27', 'Unidades', 'Y2025101201', 6.0),
(28, 2, '2025-10-17', '2025-11-17', 'Kg', 'C2025100501', 2.0),
(30, 2, '2025-10-17', '2026-10-17', 'Unidade', NULL, 1.0),
(22, 2, '2025-10-19', '2025-10-29', 'Dúzia', 'B2025101501', 2.0),
(23, 2, '2025-10-19', '2025-10-26', 'Maço', NULL, 1.0),

-- Compras da Carla (usuario_id: 3)
(8, 3, '2025-10-16', '2026-04-16', 'Kg', 'AI2025092502', 2.0),
(10, 3, '2025-10-16', '2026-10-16', 'Kg', 'FC2025092001', 1.0),
(17, 3, '2025-10-20', '2025-10-27', 'Kg', NULL, 2.0),
(19, 3, '2025-10-20', '2025-10-30', 'Kg', NULL, 1.0),
(27, 3, '2025-10-16', '2025-11-16', 'Kg', 'F2025100801', 3.0),
(33, 3, '2025-10-16', '2026-04-16', 'Litros', 'A2025092801', 0.5),

-- Compras do Daniel (usuario_id: 4)
(28, 4, '2025-10-19', '2025-11-19', 'Kg', 'C2025100502', 2.0),
(29, 4, '2025-10-19', '2025-11-19', 'Kg', 'P2025100801', 1.5),
(30, 4, '2025-10-19', '2025-10-31', 'Kg', 'T2025101201', 1.0),
(14, 4, '2025-10-20', '2025-10-27', 'Kg', NULL, 2.0),
(15, 4, '2025-10-20', '2025-10-29', 'Kg', NULL, 1.0),
(22, 4, '2025-10-18', '2025-10-28', 'Maço', NULL, 2.0),

-- Compras da Elena (usuario_id: 5)
(3, 5, '2025-10-17', '2025-11-17', 'Kg', 'Q2025100901', 0.5),
(13, 5, '2025-10-17', '2026-04-17', 'Kg', 'MP2025091801', 2.0),
(18, 5, '2025-10-19', '2025-10-29', 'Kg', NULL, 3.0),
(21, 5, '2025-10-19', '2025-10-26', 'Kg', NULL, 1.0),
(24, 5, '2025-10-18', '2025-10-28', 'Dúzia', 'L2025101401', 1.5),
(39, 5, '2025-10-17', '2025-11-17', 'Litros', 'S2025100901', 2.0),

-- Compras do Felipe (usuario_id: 6)
(7, 6, '2025-10-20', '2026-04-20', 'Kg', 'A2025100216', 3.0),
(12, 6, '2025-10-20', '2026-10-20', 'Kg', 'ME2025092501', 1.0),
(16, 6, '2025-10-20', '2026-01-20', 'Cabeça', NULL, 0.2),
(27, 6, '2025-10-18', '2025-11-18', 'Kg', 'F2025100802', 2.0),
(31, 6, '2025-10-18', NULL, 'Kg', 'S2025100101', 1.0),
(32, 6, '2025-10-18', '2026-10-18', 'Litros', 'O2025092501', 1.0),

-- Compras da Gabriela (usuario_id: 7)
(23, 7, '2025-10-19', '2025-10-29', 'Dúzia', 'B2025101502', 1.5),
(24, 7, '2025-10-19', '2025-10-26', 'Dúzia', 'M2025101601', 1.0),
(25, 7, '2025-10-19', '2025-10-26', 'Dúzia', 'L2025101701', 2.0),
(26, 7, '2025-10-19', '2025-10-22', 'Kg', 'MO2025101801', 0.3),
(1, 7, '2025-10-20', '2025-10-27', 'Litros', 'L2025101503', 1.0),
(38, 7, '2025-10-18', '2026-04-18', 'Kg', 'C2025092801', 0.5);

-- ============================================
-- TABELA: RECEITAS_FAVORITAS
-- ============================================
INSERT INTO receitas_favoritas (usuario_id, receita_id)
VALUES
-- Ana favorita receitas saudáveis
(1, 1), -- Arroz Integral com Legumes
(1, 2), -- Frango Grelhado com Salada
(1, 6), -- Smoothie de Frutas

-- Bruno gosta de pratos práticos
(2, 3), -- Macarrão ao Molho de Tomate
(2, 4), -- Omelete Proteica
(2, 8), -- Salada Caesar

-- Carla é vegetariana
(3, 1), -- Arroz Integral com Legumes
(3, 3), -- Macarrão ao Molho de Tomate
(3, 6), -- Smoothie de Frutas

-- Daniel gosta de pratos tradicionais
(4, 2), -- Frango Grelhado com Salada
(4, 5), -- Feijão Tropeiro
(4, 7), -- Peixe Assado com Legumes

-- Elena é fitness
(5, 2), -- Frango Grelhado com Salada
(5, 4), -- Omelete Proteica
(5, 6), -- Smoothie de Frutas
(5, 8), -- Salada Caesar

-- Felipe gosta de variedade
(6, 1), -- Arroz Integral com Legumes
(6, 5), -- Feijão Tropeiro
(6, 7), -- Peixe Assado com Legumes

-- Gabriela prefere refeições leves
(7, 4), -- Omelete Proteica
(7, 6), -- Smoothie de Frutas
(7, 8); -- Salada Caesar

-- ============================================
-- FIM DO SEED
-- ============================================