package service;

import com.google.gson.Gson;
import dao.ReceitaDAO;
import model.Receita;
import spark.Request;
import spark.Response;

public class ReceitaService {

    private ReceitaDAO receitaDAO;
    private Gson gson;

    public ReceitaService() {
        this.receitaDAO = new ReceitaDAO();
        this.gson = new Gson();
    }

    /**
     * GET /receita
     * Lista todas as receitas
     */
    public Object getAll(Request request, Response response) {
        response.type("application/json");

        try {
            return gson.toJson(receitaDAO.getAll());
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao listar receitas: " + e.getMessage()));
        }
    }

    /**
     * GET /receita/:id
     * Busca receita por ID
     */
    public Object get(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Receita receita = receitaDAO.get(id);

            if (receita != null) {
                response.status(200);
                return gson.toJson(receita);
            } else {
                response.status(404);
                return gson.toJson(new ErrorResponse("Receita não encontrada"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar receita: " + e.getMessage()));
        }
    }

    /**
     * GET /receita/search?q=titulo
     * Busca receitas por título
     */
    public Object search(Request request, Response response) {
        response.type("application/json");

        try {
            String query = request.queryParams("q");
            if (query == null || query.trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Parâmetro 'q' é obrigatório"));
            }
            return gson.toJson(receitaDAO.searchByTitulo(query));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar receitas: " + e.getMessage()));
        }
    }

    /**
     * GET /receita/tempo/:tempo
     * Busca receitas por tempo máximo de preparo
     */
    public Object getByTempo(Request request, Response response) {
        response.type("application/json");

        try {
            int tempo = Integer.parseInt(request.params(":tempo"));
            return gson.toJson(receitaDAO.getByTempoMaximo(tempo));
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("Tempo inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar receitas: " + e.getMessage()));
        }
    }

    /**
     * GET /receita/tag/:tag
     * Busca receitas por tag
     */
    public Object getByTag(Request request, Response response) {
        response.type("application/json");

        try {
            String tag = request.params(":tag");
            return gson.toJson(receitaDAO.getByTag(tag));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar receitas: " + e.getMessage()));
        }
    }

    /**
     * POST /receita
     * Insere uma nova receita
     */
    public Object insert(Request request, Response response) {
        response.type("application/json");

        try {
            Receita receita = gson.fromJson(request.body(), Receita.class);

            // Validações
            if (receita.getTitulo() == null || receita.getTitulo().trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Título é obrigatório"));
            }

            if (receita.getPorcao() == null || receita.getPorcao().trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Porção é obrigatória"));
            }

            if (receita.getTempoPreparo() <= 0) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Tempo de preparo deve ser maior que zero"));
            }

            if (receita.getInformacoes() == null) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Informações são obrigatórias"));
            }

            if (receitaDAO.insert(receita)) {
                response.status(201);
                return gson.toJson(new SuccessResponse("Receita cadastrada com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao cadastrar receita"));
            }
        } catch (Exception e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("Dados inválidos: " + e.getMessage()));
        }
    }

    /**
     * PUT /receita/:id
     * Atualiza uma receita existente
     */
    public Object update(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Receita receitaExistente = receitaDAO.get(id);

            if (receitaExistente == null) {
                response.status(404);
                return gson.toJson(new ErrorResponse("Receita não encontrada"));
            }

            Receita receita = gson.fromJson(request.body(), Receita.class);
            receita.setId(id);

            // Validações
            if (receita.getTitulo() == null || receita.getTitulo().trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Título é obrigatório"));
            }

            if (receitaDAO.update(receita)) {
                response.status(200);
                return gson.toJson(new SuccessResponse("Receita atualizada com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao atualizar receita"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("Dados inválidos: " + e.getMessage()));
        }
    }

    /**
     * DELETE /receita/:id
     * Remove uma receita
     */
    public Object delete(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Receita receita = receitaDAO.get(id);

            if (receita == null) {
                response.status(404);
                return gson.toJson(new ErrorResponse("Receita não encontrada"));
            }

            if (receitaDAO.delete(id)) {
                response.status(200);
                return gson.toJson(new SuccessResponse("Receita removida com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao remover receita"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao deletar receita: " + e.getMessage()));
        }
    }

    // Classes auxiliares
    private static class ErrorResponse {
        private String error;
        public ErrorResponse(String error) {
            this.error = error;
        }
    }

    private static class SuccessResponse {
        private String message;
        public SuccessResponse(String message) {
            this.message = message;
        }
    }
}
