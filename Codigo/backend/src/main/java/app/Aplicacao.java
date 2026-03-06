package app;

import service.*;
import util.EnvConfig;
import static spark.Spark.*;

public class Aplicacao {

    // Inicialização dos Serviços (Lógica de Negócio)
    private static final UsuarioService usuarioService = new UsuarioService();
    private static final AlimentoService alimentoService = new AlimentoService();
    private static final ReceitaService receitaService = new ReceitaService();
    private static final RegistraService registraService = new RegistraService();
    private static final ReceitaFavoritaService receitaFavoritaService = new ReceitaFavoritaService();
    private static final IAService iaService = new IAService();

    public static void main(String[] args) {
        // 1. Configuração da Porta
        // Pega do .env (API_PORT) ou usa 6789 como padrão
        port(EnvConfig.getApiPort());

        // 2. Configuração de CORS (Fundamental para o React funcionar)
        configurarCORS();

        // 3. Rota de Teste (Para saber se a API está viva)
        get("/", (request, response) -> {
            response.type("application/json");
            return "{\"message\": \"Smart Routine API - Online 🚀\", \"version\": \"1.0\"}";
        });

        // ==================== GRUPOS DE ROTAS ====================

        // --- Usuário ---
        path("/usuario", () -> {
            post("/login", usuarioService::login);     // Login
            post("", usuarioService::insert);          // Cadastro
            get("/:id", usuarioService::get);          // Buscar um
            get("", usuarioService::getAll);           // Listar todos
            put("/:id", usuarioService::update);       // Atualizar
            delete("/:id", usuarioService::delete);    // Deletar
        });

        // --- Alimento ---
        path("/alimento", () -> {
            get("/search", alimentoService::search);
            get("/categorias", alimentoService::getCategorias);
            get("/categoria/:categoria", alimentoService::getByCategoria);
            get("/:id", alimentoService::get);
            get("", alimentoService::getAll);
            post("", alimentoService::insert);
            put("/:id", alimentoService::update);
            delete("/:id", alimentoService::delete);
        });

        // --- Receita ---
        path("/receita", () -> {
            get("/search", receitaService::search);
            get("/tempo/:tempo", receitaService::getByTempo);
            get("/tag/:tag", receitaService::getByTag);
            get("/:id", receitaService::get);
            get("", receitaService::getAll);
            post("", receitaService::insert);
            put("/:id", receitaService::update);
            delete("/:id", receitaService::delete);
        });

        // --- Registra (Controle de Estoque/Compras) ---
        path("/registra", () -> {
            get("/usuario/:usuarioId/vencidos", registraService::getVencidos);
            get("/usuario/:usuarioId/vencimento/:dias", registraService::getProximosVencimento);
            get("/usuario/:usuarioId", registraService::getByUsuario);
            get("/:id", registraService::get);
            get("", registraService::getAll);
            post("", registraService::insert);
            put("/:id", registraService::update);
            delete("/:id", registraService::delete);
        });

        // --- Receitas Favoritas ---
        path("/favoritas", () -> {
            get("/check/:usuarioId/:receitaId", receitaFavoritaService::checkFavorita);
            get("/usuario/:usuarioId", receitaFavoritaService::getByUsuario);
            get("/receita/:receitaId/count", receitaFavoritaService::countByReceita);
            get("/receita/:receitaId", receitaFavoritaService::getByReceita);
            get("/:id", receitaFavoritaService::get);
            get("", receitaFavoritaService::getAll);
            post("", receitaFavoritaService::insert);
            delete("/usuario/:usuarioId/receita/:receitaId", receitaFavoritaService::deleteByUsuarioReceita);
            delete("/:id", receitaFavoritaService::delete);
        });

        // --- Servico IA ---
        path("/ia", () -> {
            post("/recipe",iaService::gerarReceita);
            //post("/recipe", (req, res) -> new IAService().gerarReceita(req, res));
        });

        // Log de inicialização
        System.out.println("===========================================");
        System.out.println("🚀 Smart Routine API - Servidor Iniciado");
        System.out.println("🔌 Porta: " + port());
        System.out.println("🌐 URL: http://localhost:" + port());
        System.out.println("===========================================");
        System.out.println("Entidades disponíveis:");
        System.out.println("  • Usuario");
        System.out.println("  • Alimento");
        System.out.println("  • Receita");
        System.out.println("  • Registra (Compras)");
        System.out.println("  • Receitas Favoritas");
        System.out.println("===========================================");
    }

    /**
     * Configura o Cross-Origin Resource Sharing (CORS)
     * Permite que o Front-end (React) em outra porta acesse esta API.
     */
    private static void configurarCORS() {
        // Responde a todas as requisições OPTIONS (Pre-flight)
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        // Adiciona os headers em todas as respostas
        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*"); // Permite qualquer origem
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        });
    }
}