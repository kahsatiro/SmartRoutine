package service;

import com.google.gson.Gson;
import dao.AlimentoDAO;
import model.Alimento;
import spark.Request;
import spark.Response;

public class AlimentoService {

    private AlimentoDAO alimentoDAO;
    private Gson gson;

    public AlimentoService() {
        this.alimentoDAO = new AlimentoDAO();
        this.gson = new Gson();
    }

    /**
     * GET /alimento
     * Lista todos os alimentos
     */
    public Object getAll(Request request, Response response) {
        response.type("application/json");

        try {
            return gson.toJson(alimentoDAO.getAll());
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao listar alimentos: " + e.getMessage()));
        }
    }

    /**
     * GET /alimento/:id
     * Busca alimento por ID
     */
    public Object get(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Alimento alimento = alimentoDAO.get(id);

            if (alimento != null) {
                response.status(200);
                return gson.toJson(alimento);
            } else {
                response.status(404);
                return gson.toJson(new ErrorResponse("Alimento não encontrado"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar alimento: " + e.getMessage()));
        }
    }

    /**
     * GET /alimento/categoria/:categoria
     * Lista alimentos por categoria
     */
    public Object getByCategoria(Request request, Response response) {
        response.type("application/json");

        try {
            String categoria = request.params(":categoria");
            return gson.toJson(alimentoDAO.getByCategoria(categoria));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar alimentos: " + e.getMessage()));
        }
    }

    /**
     * GET /alimento/search?q=nome
     * Busca alimentos por nome
     */
    public Object search(Request request, Response response) {
        response.type("application/json");

        try {
            String query = request.queryParams("q");
            if (query == null || query.trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Parâmetro 'q' é obrigatório"));
            }
            return gson.toJson(alimentoDAO.searchByNome(query));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao buscar alimentos: " + e.getMessage()));
        }
    }

    /**
     * GET /alimento/categorias
     * Lista todas as categorias
     */
    public Object getCategorias(Request request, Response response) {
        response.type("application/json");

        try {
            return gson.toJson(alimentoDAO.getCategorias());
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao listar categorias: " + e.getMessage()));
        }
    }

    /**
     * POST /alimento
     * Insere um novo alimento
     */
    public Object insert(Request request, Response response) {
        response.type("application/json");

        try {
            Alimento alimento = gson.fromJson(request.body(), Alimento.class);

            // Validações
            if (alimento.getNome() == null || alimento.getNome().trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Nome é obrigatório"));
            }

            if (alimentoDAO.insert(alimento)) {
                response.status(201);
                return gson.toJson(new SuccessResponse("Alimento cadastrado com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao cadastrar alimento"));
            }
        } catch (Exception e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("Dados inválidos: " + e.getMessage()));
        }
    }

    /**
     * PUT /alimento/:id
     * Atualiza um alimento existente
     */
    public Object update(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Alimento alimentoExistente = alimentoDAO.get(id);

            if (alimentoExistente == null) {
                response.status(404);
                return gson.toJson(new ErrorResponse("Alimento não encontrado"));
            }

            Alimento alimento = gson.fromJson(request.body(), Alimento.class);
            alimento.setId(id);

            // Validações
            if (alimento.getNome() == null || alimento.getNome().trim().isEmpty()) {
                response.status(400);
                return gson.toJson(new ErrorResponse("Nome é obrigatório"));
            }

            if (alimentoDAO.update(alimento)) {
                response.status(200);
                return gson.toJson(new SuccessResponse("Alimento atualizado com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao atualizar alimento"));
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
     * DELETE /alimento/:id
     * Remove um alimento
     */
    public Object delete(Request request, Response response) {
        response.type("application/json");

        try {
            int id = Integer.parseInt(request.params(":id"));
            Alimento alimento = alimentoDAO.get(id);

            if (alimento == null) {
                response.status(404);
                return gson.toJson(new ErrorResponse("Alimento não encontrado"));
            }

            if (alimentoDAO.delete(id)) {
                response.status(200);
                return gson.toJson(new SuccessResponse("Alimento removido com sucesso"));
            } else {
                response.status(500);
                return gson.toJson(new ErrorResponse("Erro ao remover alimento"));
            }
        } catch (NumberFormatException e) {
            response.status(400);
            return gson.toJson(new ErrorResponse("ID inválido"));
        } catch (Exception e) {
            response.status(500);
            return gson.toJson(new ErrorResponse("Erro ao deletar alimento: " + e.getMessage()));
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