-- ============================================
-- SCHEMA.SQL - Criação das Tabelas
-- Sistema: Smart Routine
-- ============================================

-- Dropar tabelas na ordem correta (inversa das dependências)
DROP TABLE IF EXISTS receitas_favoritas CASCADE;
DROP TABLE IF EXISTS registra CASCADE;
DROP TABLE IF EXISTS receita CASCADE;
DROP TABLE IF EXISTS alimento CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

-- ============================================
-- TABELA: USUARIO
-- ============================================
CREATE TABLE usuario
(
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(100)        NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    senha           VARCHAR(255)        NOT NULL,
    data_nascimento DATE                NOT NULL
);

-- ============================================
-- TABELA: RECEITA
-- ============================================
CREATE TABLE receita
(
    id            SERIAL PRIMARY KEY,
    titulo        VARCHAR(200) NOT NULL,
    porcao        VARCHAR(50)  NOT NULL,
    tempo_preparo INTEGER      NOT NULL,
    informacoes   JSONB        NOT NULL
);

-- ============================================
-- TABELA: ALIMENTO
-- ============================================
CREATE TABLE alimento
(
    id        SERIAL PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    categoria VARCHAR(50)
);

-- ============================================
-- TABELA: REGISTRA (Relacionamento Alimento-Usuario)
-- ============================================
CREATE TABLE registra
(
    id             SERIAL PRIMARY KEY,
    alimento_id    INTEGER NOT NULL,
    usuario_id     INTEGER NOT NULL,
    data_compra    DATE    NOT NULL,
    data_validade  DATE,
    unidade_medida VARCHAR(20),
    lote           VARCHAR(50),
    quantidade     DECIMAL(10, 2),
    FOREIGN KEY (alimento_id) REFERENCES alimento (id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
);

-- ============================================
-- TABELA: RECEITAS_FAVORITAS (Relacionamento Usuario-Receita)
-- ============================================
CREATE TABLE receitas_favoritas
(
    id         SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    receita_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    FOREIGN KEY (receita_id) REFERENCES receita (id) ON DELETE CASCADE,
    UNIQUE (usuario_id, receita_id)
);

-- ============================================
-- FIM DO SCHEMA
-- ============================================