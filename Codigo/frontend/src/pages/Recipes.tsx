import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { Navigation } from '../components/layout/Navigation';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchBar } from '../components/shared/SearchBar';
import { FilterSelect } from '../components/shared/FilterSelect';
import { RecipeCard } from '../components/shared/RecipeCard';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { useRecipe } from '../context/RecipeContext';
import { useFood } from '../context/FoodContext';
import { useToast } from '../hooks/useToast';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import {
    Plus,
    ChefHat,
    Heart,
    Clock,
    Users,
    Sparkles,
    X,
    TrendingUp,
    Filter,
    Grid3x3,
    List,
    Star,
    BookOpen,
    Flame,
    Utensils,
    Search,
    Package
} from 'lucide-react';
import { Page, Receita } from '../types';
import { ImageWithFallback } from '../assets/ImageWithFallback';
import { DIFFICULTY_LEVELS, MEAL_TYPES, RECIPE_TAGS } from '../utils/constants';
import { formatDuration } from '../utils/formatters';
import { calculateRecipeCompatibility } from '../utils/calculations';

interface RecipesProps {
    onNavigate: (page: Page) => void;
}

type ViewMode = 'grid' | 'list';
type RecipeModalStep = 'choice' | 'manual' | 'ai';
type AIRecipeOption = 'pantry-only' | 'pantry-based' | 'custom' | null;

export const Recipes: React.FC<RecipesProps> = ({ onNavigate }) => {
    const {
        recipes,
        favorites,
        loading,
        addRecipe,
        deleteRecipe,
        toggleFavorite,
        isFavorite
    } = useRecipe();

    const { foodItems } = useFood();
    const { success, error: showError } = useToast();

    // UI State
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedMealType, setSelectedMealType] = useState('all');
    const [selectedTag, setSelectedTag] = useState('all');
    const [maxTime, setMaxTime] = useState<number | null>(null);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    // Dialog States
    const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
    const [recipeModalStep, setRecipeModalStep] = useState<RecipeModalStep>('choice');
    const [aiRecipeOption, setAiRecipeOption] = useState<AIRecipeOption>(null);
    const [customPrompt, setCustomPrompt] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState<Receita | null>(null);
    const [recipeToDelete, setRecipeToDelete] = useState<Receita | null>(null);

    // Form State
    const [newRecipeData, setNewRecipeData] = useState({
        titulo: '',
        porcao: '',
        tempoPreparo: 30,
        imageUrl: '',
        dificuldade: 'Médio',
        tipoRefeicao: 'Almoço',
        calorias: 0,
    });
    const [newRecipeIngredients, setNewRecipeIngredients] = useState(['']);
    const [newRecipeInstructions, setNewRecipeInstructions] = useState(['']);
    const [newRecipeTags, setNewRecipeTags] = useState<string[]>([]);

    // Debounced search
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Available ingredients from pantry
    const availableIngredients = useMemo(() => {
        return foodItems
            .filter(item => (item.daysUntilExpiry ?? 0) > 0)
            .map(item => item.nomeAlimento || '');
    }, [foodItems]);

    // Filtered recipes
    const filteredRecipes = useMemo(() => {
        let items = [...recipes];

        // Search filter
        if (debouncedSearch) {
            items = items.filter(recipe =>
                recipe.titulo.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                recipe.informacoes?.tags?.some(tag =>
                    tag.toLowerCase().includes(debouncedSearch.toLowerCase())
                )
            );
        }

        // Difficulty filter
        if (selectedDifficulty !== 'all') {
            items = items.filter(recipe =>
                recipe.informacoes?.dificuldade === selectedDifficulty
            );
        }

        // Meal type filter
        if (selectedMealType !== 'all') {
            items = items.filter(recipe =>
                recipe.informacoes?.tipo_refeicao === selectedMealType
            );
        }

        // Tag filter
        if (selectedTag !== 'all') {
            items = items.filter(recipe =>
                recipe.informacoes?.tags?.includes(selectedTag)
            );
        }

        // Max time filter
        if (maxTime !== null) {
            items = items.filter(recipe => recipe.tempoPreparo <= maxTime);
        }

        // Favorites filter
        if (showOnlyFavorites) {
            const favoriteIds = favorites.map(f => f.receitaId);
            items = items.filter(recipe => favoriteIds.includes(recipe.id));
        }

        // Sort by compatibility with pantry
        if (availableIngredients.length > 0) {
            items = items.map(recipe => ({
                ...recipe,
                compatibility: calculateRecipeCompatibility(
                    recipe.informacoes?.ingredientes || [],
                    availableIngredients
                ).score
            })).sort((a, b) => (b.compatibility || 0) - (a.compatibility || 0));
        }

        return items;
    }, [
        recipes,
        debouncedSearch,
        selectedDifficulty,
        selectedMealType,
        selectedTag,
        maxTime,
        showOnlyFavorites,
        favorites,
        availableIngredients
    ]);

    // Pagination
    const {
        currentItems,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        hasNextPage,
        hasPrevPage,
        startIndex,
        endIndex,
    } = usePagination({
        items: filteredRecipes,
        itemsPerPage: viewMode === 'grid' ? 12 : 20,
    });

    // Filter options
    const difficultyOptions = [
        { value: 'all', label: 'Todas as Dificuldades' },
        ...DIFFICULTY_LEVELS.map(level => ({ value: level, label: level })),
    ];

    const mealTypeOptions = [
        { value: 'all', label: 'Todos os Tipos' },
        ...MEAL_TYPES.map(type => ({ value: type, label: type })),
    ];

    const tagOptions = [
        { value: 'all', label: 'Todas as Tags' },
        ...RECIPE_TAGS.map(tag => ({
            value: tag,
            label: tag.charAt(0).toUpperCase() + tag.slice(1)
        })),
    ];

    const timeOptions = [
        { value: 'all', label: 'Qualquer Tempo' },
        { value: '15', label: 'Até 15 min' },
        { value: '30', label: 'Até 30 min' },
        { value: '60', label: 'Até 1 hora' },
        { value: '120', label: 'Até 2 horas' },
    ];

    // Handle form changes
    const handleRecipeDataChange = (field: string, value: any) => {
        setNewRecipeData(prev => ({ ...prev, [field]: value }));
    };

    const addIngredientField = () => {
        setNewRecipeIngredients([...newRecipeIngredients, '']);
    };

    const removeIngredientField = (index: number) => {
        const newIngredients = newRecipeIngredients.filter((_, i) => i !== index);
        setNewRecipeIngredients(newIngredients.length === 0 ? [''] : newIngredients);
    };

    const updateIngredient = (index: number, value: string) => {
        const newIngredients = [...newRecipeIngredients];
        newIngredients[index] = value;
        setNewRecipeIngredients(newIngredients);
    };

    const addInstructionField = () => {
        setNewRecipeInstructions([...newRecipeInstructions, '']);
    };

    const removeInstructionField = (index: number) => {
        const newInstructions = newRecipeInstructions.filter((_, i) => i !== index);
        setNewRecipeInstructions(newInstructions.length === 0 ? [''] : newInstructions);
    };

    const updateInstruction = (index: number, value: string) => {
        const newInstructions = [...newRecipeInstructions];
        newInstructions[index] = value;
        setNewRecipeInstructions(newInstructions);
    };

    const toggleTag = (tag: string) => {
        setNewRecipeTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    // Reset form
    const resetRecipeModal = () => {
        setIsAddRecipeOpen(false);
        setRecipeModalStep('choice');
        setAiRecipeOption(null);
        setCustomPrompt('');
        setNewRecipeData({
            titulo: '',
            porcao: '',
            tempoPreparo: 30,
            imageUrl: '',
            dificuldade: 'Médio',
            tipoRefeicao: 'Almoço',
            calorias: 0,
        });
        setNewRecipeIngredients(['']);
        setNewRecipeInstructions(['']);
        setNewRecipeTags([]);
    };

    // Handle add recipe manually
    const handleAddRecipeManually = async (e: React.FormEvent) => {
        e.preventDefault();

        const filteredIngredients = newRecipeIngredients.filter(ing => ing.trim() !== '');
        const filteredInstructions = newRecipeInstructions.filter(inst => inst.trim() !== '');

        if (!newRecipeData.titulo || filteredIngredients.length === 0 || filteredInstructions.length === 0) {
            showError('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        try {
            await addRecipe({
                titulo: newRecipeData.titulo,
                porcao: newRecipeData.porcao,
                tempoPreparo: newRecipeData.tempoPreparo,
                informacoes: {
                    ingredientes: filteredIngredients,
                    modo_preparo: filteredInstructions,
                    dificuldade: newRecipeData.dificuldade,
                    tipo_refeicao: newRecipeData.tipoRefeicao,
                    calorias: newRecipeData.calorias,
                    tags: newRecipeTags,
                },
            });

            resetRecipeModal();
            success('Receita adicionada com sucesso!');
        } catch (err) {
            showError('Erro ao adicionar receita');
        }
    };

    // Generate AI recipe (simulated)
    const generateAiRecipe = async () => {
        let recipeName = '';
        let recipeIngredients: string[] = [];
        let recipeTags: string[] = ['gerado-ia'];

        if (aiRecipeOption === 'pantry-only') {
            recipeName = 'Receita Criativa com Ingredientes da Despensa';
            recipeIngredients = availableIngredients.slice(0, Math.min(6, availableIngredients.length));
            recipeTags.push('aproveitamento');
        } else if (aiRecipeOption === 'pantry-based') {
            recipeName = 'Receita Especial Baseada na sua Despensa';
            recipeIngredients = [
                ...availableIngredients.slice(0, Math.min(4, availableIngredients.length)),
                'Azeite',
                'Sal',
                'Pimenta'
            ];
            recipeTags.push('prático', 'saudável');
        } else if (aiRecipeOption === 'custom') {
            recipeName = `Receita Personalizada: ${customPrompt.substring(0, 40)}`;
            recipeIngredients = availableIngredients.slice(0, Math.min(5, availableIngredients.length));
            recipeTags.push('personalizado');
        }

        try {
            await addRecipe({
                titulo: recipeName,
                porcao: '2-4 porções',
                tempoPreparo: 30,
                informacoes: {
                    ingredientes: recipeIngredients,
                    modo_preparo: [
                        'Prepare todos os ingredientes necessários',
                        'Siga as instruções específicas da receita',
                        'Tempere a gosto com sal e pimenta',
                        'Cozinhe até atingir o ponto desejado',
                        'Sirva quente e aproveite!'
                    ],
                    dificuldade: 'Médio',
                    tipo_refeicao: 'Almoço/Jantar',
                    calorias: 350,
                    tags: recipeTags,
                },
            });

            resetRecipeModal();
            success('Receita gerada com sucesso!');
        } catch (err) {
            showError('Erro ao gerar receita');
        }
    };

    // Handle delete recipe
    const handleDeleteRecipe = async () => {
        if (!recipeToDelete) return;

        try {
            await deleteRecipe(recipeToDelete.id);
            setRecipeToDelete(null);
            if (selectedRecipe?.id === recipeToDelete.id) {
                setSelectedRecipe(null);
            }
            success('Receita removida com sucesso!');
        } catch (err) {
            showError('Erro ao remover receita');
        }
    };

    // Handle toggle favorite
    const handleToggleFavorite = async (recipeId: number) => {
        try {
            await toggleFavorite(recipeId);
        } catch (err) {
            showError('Erro ao atualizar favorito');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation currentPage="recipes" onNavigate={onNavigate} />
                <LoadingSpinner fullScreen text="Carregando receitas..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation currentPage="recipes" onNavigate={onNavigate} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="Biblioteca de Receitas"
                    description="Descubra e organize suas receitas favoritas"
                    breadcrumbs={[
                        { label: 'Dashboard', href: '#' },
                        { label: 'Receitas' },
                    ]}
                    actions={
                        <Dialog open={isAddRecipeOpen} onOpenChange={(open) => {
                            setIsAddRecipeOpen(open);
                            if (!open) resetRecipeModal();
                        }}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Adicionar Receita
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                {/* Choice Step */}
                                {recipeModalStep === 'choice' && (
                                    <>
                                        <DialogHeader>
                                            <DialogTitle>Adicionar Nova Receita</DialogTitle>
                                            <DialogDescription>
                                                Como deseja adicionar sua receita?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
                                            <Card
                                                className="cursor-pointer hover:border-primary hover:shadow-md transition-all p-6"
                                                onClick={() => setRecipeModalStep('manual')}
                                            >
                                                <div className="text-center space-y-4">
                                                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                                                        <BookOpen className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Adicionar Manualmente</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Preencha os detalhes da receita manualmente
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>

                                            <Card
                                                className="cursor-pointer hover:border-secondary hover:shadow-md transition-all p-6"
                                                onClick={() => setRecipeModalStep('ai')}
                                            >
                                                <div className="text-center space-y-4">
                                                    <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                                                        <Sparkles className="w-8 h-8 text-secondary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Gerar com IA</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Deixe a IA criar uma receita para você
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </>
                                )}

                                {/* AI Step */}
                                {recipeModalStep === 'ai' && (
                                    <>
                                        <DialogHeader>
                                            <DialogTitle>Gerar Receita com IA</DialogTitle>
                                            <DialogDescription>Escolha como deseja gerar sua receita</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${aiRecipeOption === 'pantry-only'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                                onClick={() => setAiRecipeOption('pantry-only')}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${aiRecipeOption === 'pantry-only' ? 'border-primary' : 'border-border'
                                                        }`}>
                                                        {aiRecipeOption === 'pantry-only' && (
                                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium mb-1">Somente com alimentos da despensa</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            A IA criará uma receita usando apenas os ingredientes disponíveis ({availableIngredients.length} itens)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${aiRecipeOption === 'pantry-based'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                                onClick={() => setAiRecipeOption('pantry-based')}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${aiRecipeOption === 'pantry-based' ? 'border-primary' : 'border-border'
                                                        }`}>
                                                        {aiRecipeOption === 'pantry-based' && (
                                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium mb-1">Baseada na despensa</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            A IA criará uma receita baseada nos seus ingredientes, mas pode incluir outros itens comuns
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${aiRecipeOption === 'custom'
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                                onClick={() => setAiRecipeOption('custom')}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${aiRecipeOption === 'custom' ? 'border-primary' : 'border-border'
                                                        }`}>
                                                        {aiRecipeOption === 'custom' && (
                                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium mb-1">Prompt personalizado</h4>
                                                        <p className="text-sm text-muted-foreground mb-3">
                                                            Descreva o tipo de receita que você deseja
                                                        </p>
                                                        {aiRecipeOption === 'custom' && (
                                                            <Textarea
                                                                placeholder="Ex: Uma receita vegetariana rápida para o jantar..."
                                                                value={customPrompt}
                                                                onChange={(e) => setCustomPrompt(e.target.value)}
                                                                rows={3}
                                                                className="mt-2"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between gap-2 pt-4 border-t">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setRecipeModalStep('choice');
                                                    setAiRecipeOption(null);
                                                    setCustomPrompt('');
                                                }}
                                            >
                                                Voltar
                                            </Button>
                                            <Button
                                                type="button"
                                                className="bg-secondary hover:bg-secondary/90"
                                                disabled={!aiRecipeOption || (aiRecipeOption === 'custom' && !customPrompt.trim())}
                                                onClick={generateAiRecipe}
                                            >
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Gerar Receita
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* Manual Step */}
                                {recipeModalStep === 'manual' && (
                                    <>
                                        <DialogHeader>
                                            <DialogTitle>Adicionar Nova Receita</DialogTitle>
                                            <DialogDescription>Preencha os detalhes da sua receita</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleAddRecipeManually} className="space-y-6 py-4">
                                            {/* Basic Info */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Informações Básicas</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label htmlFor="titulo">Título da Receita *</Label>
                                                        <Input
                                                            id="titulo"
                                                            value={newRecipeData.titulo}
                                                            onChange={(e) => handleRecipeDataChange('titulo', e.target.value)}
                                                            placeholder="Ex: Bolo de Chocolate"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="porcao">Porções *</Label>
                                                        <Input
                                                            id="porcao"
                                                            value={newRecipeData.porcao}
                                                            onChange={(e) => handleRecipeDataChange('porcao', e.target.value)}
                                                            placeholder="Ex: 4-6 porções"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="tempoPreparo">Tempo de Preparo (min) *</Label>
                                                        <Input
                                                            id="tempoPreparo"
                                                            type="number"
                                                            min="1"
                                                            value={newRecipeData.tempoPreparo}
                                                            onChange={(e) => handleRecipeDataChange('tempoPreparo', parseInt(e.target.value))}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="dificuldade">Dificuldade *</Label>
                                                        <Select
                                                            value={newRecipeData.dificuldade}
                                                            onValueChange={(value) => handleRecipeDataChange('dificuldade', value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {DIFFICULTY_LEVELS.map(level => (
                                                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="tipoRefeicao">Tipo de Refeição *</Label>
                                                        <Select
                                                            value={newRecipeData.tipoRefeicao}
                                                            onValueChange={(value) => handleRecipeDataChange('tipoRefeicao', value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {MEAL_TYPES.map(type => (
                                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="calorias">Calorias (opcional)</Label>
                                                        <Input
                                                            id="calorias"
                                                            type="number"
                                                            min="0"
                                                            value={newRecipeData.calorias}
                                                            onChange={(e) => handleRecipeDataChange('calorias', parseInt(e.target.value) || 0)}
                                                            placeholder="Ex: 350"
                                                        />
                                                    </div>

                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label htmlFor="imageUrl">URL da Imagem (opcional)</Label>
                                                        <Input
                                                            id="imageUrl"
                                                            type="url"
                                                            value={newRecipeData.imageUrl}
                                                            onChange={(e) => handleRecipeDataChange('imageUrl', e.target.value)}
                                                            placeholder="https://exemplo.com/imagem.jpg"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Ingredients */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-semibold">Ingredientes *</h4>
                                                    <Button type="button" variant="outline" size="sm" onClick={addIngredientField}>
                                                        <Plus className="mr-1 h-3 w-3" />
                                                        Adicionar
                                                    </Button>
                                                </div>
                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {newRecipeIngredients.map((ingredient, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <Input
                                                                placeholder={`Ingrediente ${index + 1}`}
                                                                value={ingredient}
                                                                onChange={(e) => updateIngredient(index, e.target.value)}
                                                                required={index === 0}
                                                            />
                                                            {newRecipeIngredients.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => removeIngredientField(index)}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Instructions */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-semibold">Modo de Preparo *</h4>
                                                    <Button type="button" variant="outline" size="sm" onClick={addInstructionField}>
                                                        <Plus className="mr-1 h-3 w-3" />
                                                        Adicionar Passo
                                                    </Button>
                                                </div>
                                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                                    {newRecipeInstructions.map((instruction, index) => (
                                                        <div key={index} className="flex gap-2">
                                                            <div className="flex-1">
                                                                <Label className="text-xs text-muted-foreground">Passo {index + 1}</Label>
                                                                <Textarea
                                                                    placeholder={`Descreva o passo ${index + 1}...`}
                                                                    value={instruction}
                                                                    onChange={(e) => updateInstruction(index, e.target.value)}
                                                                    required={index === 0}
                                                                    rows={2}
                                                                />
                                                            </div>
                                                            {newRecipeInstructions.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() => removeInstructionField(index)}
                                                                    className="mt-5"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Tags */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Tags (opcional)</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {RECIPE_TAGS.map(tag => (
                                                        <Badge
                                                            key={tag}
                                                            variant={newRecipeTags.includes(tag) ? 'default' : 'outline'}
                                                            className="cursor-pointer"
                                                            onClick={() => toggleTag(tag)}
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-between gap-2 pt-4 border-t">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setRecipeModalStep('choice');
                                                        resetRecipeModal();
                                                    }}
                                                >
                                                    Voltar
                                                </Button>
                                                <Button type="submit" className="bg-primary hover:bg-primary/90">
                                                    Adicionar Receita
                                                </Button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>
                    }
                />

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="text-2xl font-bold">{recipes.length}</p>
                                </div>
                                <ChefHat className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Favoritas</p>
                                    <p className="text-2xl font-bold text-destructive">{favorites.length}</p>
                                </div>
                                <Heart className="h-8 w-8 text-destructive" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Rápidas</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {recipes.filter(r => r.tempoPreparo <= 30).length}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Disponíveis</p>
                                    <p className="text-2xl font-bold text-secondary">
                                        {availableIngredients.length}
                                    </p>
                                </div>
                                <Utensils className="h-8 w-8 text-secondary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <SearchBar
                                        placeholder="Buscar receitas..."
                                        onSearch={setSearchQuery}
                                        defaultValue={searchQuery}
                                    />
                                </div>

                                <FilterSelect
                                    placeholder="Dificuldade"
                                    options={difficultyOptions}
                                    value={selectedDifficulty}
                                    onValueChange={setSelectedDifficulty}
                                    className="w-full md:w-48"
                                />

                                <FilterSelect
                                    placeholder="Tipo de Refeição"
                                    options={mealTypeOptions}
                                    value={selectedMealType}
                                    onValueChange={setSelectedMealType}
                                    className="w-full md:w-48"
                                />

                                <FilterSelect
                                    placeholder="Tag"
                                    options={tagOptions}
                                    value={selectedTag}
                                    onValueChange={setSelectedTag}
                                    className="w-full md:w-48"
                                />

                                <Select
                                    value={maxTime?.toString() || 'all'}
                                    onValueChange={(value) => setMaxTime(value === 'all' ? null : parseInt(value))}
                                >
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="flex gap-2">
                                    <Button
                                        variant={showOnlyFavorites ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                                        title="Apenas favoritas"
                                    >
                                        <Heart className={`h-4 w-4 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                                    </Button>

                                    <div className="border-l pl-2 flex gap-1">
                                        <Button
                                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                                            size="icon"
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <Grid3x3 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={viewMode === 'list' ? 'default' : 'outline'}
                                            size="icon"
                                            onClick={() => setViewMode('list')}
                                        >
                                            <List className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Active Filters */}
                            {(selectedDifficulty !== 'all' ||
                                selectedMealType !== 'all' ||
                                selectedTag !== 'all' ||
                                maxTime !== null ||
                                searchQuery ||
                                showOnlyFavorites) && (
                                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                                        <span className="text-sm text-muted-foreground">Filtros:</span>
                                        {searchQuery && (
                                            <Badge variant="secondary">
                                                Busca: {searchQuery}
                                                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                                            </Badge>
                                        )}
                                        {selectedDifficulty !== 'all' && (
                                            <Badge variant="secondary">
                                                {selectedDifficulty}
                                                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedDifficulty('all')} />
                                            </Badge>
                                        )}
                                        {selectedMealType !== 'all' && (
                                            <Badge variant="secondary">
                                                {selectedMealType}
                                                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedMealType('all')} />
                                            </Badge>
                                        )}
                                        {selectedTag !== 'all' && (
                                            <Badge variant="secondary">
                                                {selectedTag}
                                                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSelectedTag('all')} />
                                            </Badge>
                                        )}
                                        {maxTime && (
                                            <Badge variant="secondary">
                                                Até {maxTime}min
                                                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setMaxTime(null)} />
                                            </Badge>
                                        )}
                                        {showOnlyFavorites && (
                                            <Badge variant="secondary">
                                                Favoritas
                                                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setShowOnlyFavorites(false)} />
                                            </Badge>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSelectedDifficulty('all');
                                                setSelectedMealType('all');
                                                setSelectedTag('all');
                                                setMaxTime(null);
                                                setShowOnlyFavorites(false);
                                            }}
                                            className="h-6 px-2 text-xs"
                                        >
                                            Limpar todos
                                        </Button>
                                    </div>
                                )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recipes Grid/List */}
                {filteredRecipes.length === 0 ? (
                    <EmptyState
                        icon={ChefHat}
                        title={
                            searchQuery || selectedDifficulty !== 'all' || selectedMealType !== 'all' || selectedTag !== 'all'
                                ? 'Nenhuma receita encontrada'
                                : 'Nenhuma receita disponível'
                        }
                        description={
                            searchQuery || selectedDifficulty !== 'all' || selectedMealType !== 'all' || selectedTag !== 'all'
                                ? 'Tente ajustar os filtros para encontrar receitas.'
                                : 'Adicione receitas para começar a planejar suas refeições.'
                        }
                        actionLabel={
                            searchQuery || selectedDifficulty !== 'all' || selectedMealType !== 'all' || selectedTag !== 'all'
                                ? 'Limpar Filtros'
                                : 'Adicionar Receita'
                        }
                        onAction={() => {
                            if (searchQuery || selectedDifficulty !== 'all' || selectedMealType !== 'all' || selectedTag !== 'all') {
                                setSearchQuery('');
                                setSelectedDifficulty('all');
                                setSelectedMealType('all');
                                setSelectedTag('all');
                            } else {
                                setIsAddRecipeOpen(true);
                            }
                        }}
                    />
                ) : (
                    <>
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-4'
                        }>
                            {currentItems.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    isFavorite={isFavorite(recipe.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                    onViewDetails={setSelectedRecipe}
                                    onDelete={setRecipeToDelete}
                                    variant={viewMode === 'grid' ? 'default' : 'compact'}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {startIndex} - {endIndex} de {filteredRecipes.length} receitas
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={prevPage}
                                        disabled={!hasPrevPage}
                                    >
                                        Anterior
                                    </Button>

                                    <div className="flex gap-1">
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let page;
                                            if (totalPages <= 5) {
                                                page = i + 1;
                                            } else if (currentPage <= 3) {
                                                page = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                page = totalPages - 4 + i;
                                            } else {
                                                page = currentPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => goToPage(page)}
                                                    className="w-8"
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={nextPage}
                                        disabled={!hasNextPage}
                                    >
                                        Próximo
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Recipe Details Dialog */}
            <Dialog open={!!selectedRecipe} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedRecipe && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-2xl">{selectedRecipe.titulo}</DialogTitle>
                                <DialogDescription className="flex flex-wrap items-center gap-4 text-base">
                                    <span className="flex items-center gap-1">
                                        <Clock size={16} />
                                        {formatDuration(selectedRecipe.tempoPreparo)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users size={16} />
                                        {selectedRecipe.porcao}
                                    </span>
                                    {selectedRecipe.informacoes?.calorias && (
                                        <span className="flex items-center gap-1">
                                            <Flame size={16} />
                                            {selectedRecipe.informacoes.calorias} kcal
                                        </span>
                                    )}
                                    {selectedRecipe.informacoes?.dificuldade && (
                                        <Badge variant="outline">{selectedRecipe.informacoes.dificuldade}</Badge>
                                    )}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Tags */}
                                {selectedRecipe.informacoes?.tags && selectedRecipe.informacoes.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRecipe.informacoes.tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Compatibility Score */}
                                {availableIngredients.length > 0 && selectedRecipe.informacoes?.ingredientes && (
                                    <Card className="bg-muted/30">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold">Compatibilidade com sua despensa</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {calculateRecipeCompatibility(
                                                            selectedRecipe.informacoes.ingredientes,
                                                            availableIngredients
                                                        ).matchingIngredients.length} de {selectedRecipe.informacoes.ingredientes.length} ingredientes disponíveis
                                                    </p>
                                                </div>
                                                <div className="text-3xl font-bold text-primary">
                                                    {calculateRecipeCompatibility(
                                                        selectedRecipe.informacoes.ingredientes,
                                                        availableIngredients
                                                    ).score}%
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Ingredients */}
                                <div>
                                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Ingredientes
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedRecipe.informacoes?.ingredientes?.map((ingredient, index) => {
                                            const isAvailable = availableIngredients.some(available =>
                                                available.toLowerCase().includes(ingredient.toLowerCase()) ||
                                                ingredient.toLowerCase().includes(available.toLowerCase())
                                            );
                                            return (
                                                <li key={index} className="flex items-start gap-2">
                                                    <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${isAvailable ? 'bg-green-500' : 'bg-muted-foreground'
                                                        }`} />
                                                    <span className={isAvailable ? 'text-green-700 dark:text-green-400' : ''}>
                                                        {ingredient}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <Separator />

                                {/* Instructions */}
                                <div>
                                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        Modo de Preparo
                                    </h4>
                                    <ol className="space-y-3">
                                        {selectedRecipe.informacoes?.modo_preparo?.map((step, index) => (
                                            <li key={index} className="flex gap-3">
                                                <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                                                    {index + 1}
                                                </span>
                                                <span className="flex-1 pt-0.5">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                        onClick={() => handleToggleFavorite(selectedRecipe.id)}
                                        className={`flex-1 ${isFavorite(selectedRecipe.id)
                                                ? 'bg-destructive hover:bg-destructive/90'
                                                : 'bg-primary hover:bg-primary/90'
                                            }`}
                                    >
                                        <Heart
                                            size={16}
                                            className={`mr-2 ${isFavorite(selectedRecipe.id) ? 'fill-current' : ''}`}
                                        />
                                        {isFavorite(selectedRecipe.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setRecipeToDelete(selectedRecipe)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        Excluir Receita
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!recipeToDelete}
                onOpenChange={(open) => !open && setRecipeToDelete(null)}
                title="Excluir Receita"
                description={`Tem certeza que deseja excluir "${recipeToDelete?.titulo}"? Esta ação não pode ser desfeita.`}
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                onConfirm={handleDeleteRecipe}
                variant="destructive"
            />
        </div>
    );
};