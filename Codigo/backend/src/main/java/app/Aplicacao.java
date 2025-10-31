package app;

import service.*;
import util.EnvConfig;
import static spark.Spark.*;

public class Aplicacao {

    private static UsuarioService usuarioService = new UsuarioService();
    private static AlimentoService alimentoService = new AlimentoService();
    private static ReceitaService receitaService = new ReceitaService();
    private static RegistraService registraService = new RegistraService();
    private static ReceitaFavoritaService receitaFavoritaService = new ReceitaFavoritaService();

    public static void main(String[] args) {
        // Configuração da porta
        port(EnvConfig.getApiPort());

        // Configuração de CORS
        configurarCORS();

        // Rota raiz
        get("/", (request, response) -> {
            response.type("application/json");
            return "{\"message\": \"Smart Routine API - Running\", \"version\": \"1.0\"}";
        });

        // ==================== ROTAS DE USUÁRIO ====================
        path("/usuario", () -> {
            get("/:id", usuarioService::get);
            get("", usuarioService::getAll);
            post("/login", usuarioService::login);
            post("", usuarioService::insert);
            put("/:id", usuarioService::update);
            delete("/:id", usuarioService::delete);
        });

        // ==================== ROTAS DE ALIMENTO ====================
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

        // ==================== ROTAS DE RECEITA ====================
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

        // ==================== ROTAS DE REGISTRA ====================
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

        // ==================== ROTAS DE RECEITAS FAVORITAS ====================
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

        System.out.println("===========================================");
        System.out.println("Smart Routine API - Servidor Iniciado");
        System.out.println("Porta: 6789");
        System.out.println("URL: http://localhost:6789");
        System.out.println("===========================================");
        System.out.println("Entidades disponíveis:");
        System.out.println("  • Usuario");
        System.out.println("  • Alimento");
        System.out.println("  • Receita");
        System.out.println("  • Registra (Compras)");
        System.out.println("  • Receitas Favoritas");
        System.out.println("===========================================");
    }

    private static void configurarCORS() {
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

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        });
    }
}