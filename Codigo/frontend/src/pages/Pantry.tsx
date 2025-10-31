import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Navigation } from '../components/layout/Navigation';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchBar } from '../components/shared/SearchBar';
import { FilterSelect } from '../components/shared/FilterSelect';
import { FoodItemCard } from '../components/shared/FoodItemCard';
import { EmptyState } from '../components/shared/EmptyState';
import { LoadingSpinner } from '../components/shared/LoadingSpinner';
import { ConfirmDialog } from '../components/shared/ConfirmDialog';
import { ExpiryBadge } from '../components/shared/ExpiryBadge';
import { AlertMessage } from '../components/shared/AlertMessage';
import { useFood } from '../context/FoodContext';
import { useToast } from '../hooks/useToast';
import { usePagination } from '../hooks/usePagination';
import { useDebounce } from '../hooks/useDebounce';
import {
    Plus,
    Package,
    Download,
    Filter,
    Grid3x3,
    List,
    AlertTriangle,
    CheckCircle,
    Calendar,
    TrendingUp,
    Search,
    X,
    Edit,
    Trash2,
    BarChart3
} from 'lucide-react';
import { Registra, Alimento, Page } from '../types';
import { formatDate } from '../utils/date';
import { formatQuantity } from '../utils/formatters';
import { downloadPantryCSV, downloadPantryReport } from '../utils/export';
import { FOOD_CATEGORIES, UNITS } from '../utils/constants';

interface PantryProps {
    onNavigate: (page: Page) => void;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'date' | 'expiry' | 'quantity';
type SortOrder = 'asc' | 'desc';

export const Pantry: React.FC<PantryProps> = ({ onNavigate }) => {
    const {
        foodItems,
        alimentos,
        categorias,
        loading,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        expiringItems,
        expiredItems
    } = useFood();

    const { success, error: showError } = useToast();

    // UI State
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState<SortBy>('expiry');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    // Dialog States
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Registra | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Registra | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        alimentoId: '',
        dataCompra: new Date().toISOString().split('T')[0],
        dataValidade: '',
        unidadeMedida: 'unidade',
        lote: '',
        quantidade: 1,
    });

    // Debounced search
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Filtered and sorted items
    const filteredItems = useMemo(() => {
        let items = [...foodItems];

        // Search filter
        if (debouncedSearch) {
            items = items.filter(item =>
                item.nomeAlimento?.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            const categoryItems = items.filter(item => {
                const alimento = alimentos.find(a => a.id === item.alimentoId);
                return alimento?.categoria.toLowerCase() === selectedCategory.toLowerCase();
            });
            items = categoryItems;
        }

        // Status filter
        if (selectedStatus !== 'all') {
            items = items.filter(item => {
                const days = item.daysUntilExpiry ?? 0;
                if (selectedStatus === 'expired') return days < 0;
                if (selectedStatus === 'expiring') return days >= 0 && days <= 3;
                if (selectedStatus === 'fresh') return days > 3;
                return true;
            });
        }

        // Sorting
        items.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'name':
                    comparison = (a.nomeAlimento || '').localeCompare(b.nomeAlimento || '');
                    break;
                case 'date':
                    comparison = new Date(a.dataCompra).getTime() - new Date(b.dataCompra).getTime();
                    break;
                case 'expiry':
                    comparison = (a.daysUntilExpiry ?? 0) - (b.daysUntilExpiry ?? 0);
                    break;
                case 'quantity':
                    comparison = a.quantidade - b.quantidade;
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return items;
    }, [foodItems, alimentos, debouncedSearch, selectedCategory, selectedStatus, sortBy, sortOrder]);

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
        items: filteredItems,
        itemsPerPage: viewMode === 'grid' ? 12 : 20,
    });

    // Category options
    const categoryOptions = [
        { value: 'all', label: 'Todas as Categorias' },
        ...categorias.map(cat => ({ value: cat.toLowerCase(), label: cat })),
    ];

    // Status options
    const statusOptions = [
        { value: 'all', label: 'Todos os Status' },
        { value: 'fresh', label: 'Frescos' },
        { value: 'expiring', label: 'Vencendo' },
        { value: 'expired', label: 'Vencidos' },
    ];

    // Sort options
    const sortOptions = [
        { value: 'expiry', label: 'Data de Validade' },
        { value: 'name', label: 'Nome' },
        { value: 'date', label: 'Data de Compra' },
        { value: 'quantity', label: 'Quantidade' },
    ];

    // Handle form change
    const handleFormChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            alimentoId: '',
            dataCompra: new Date().toISOString().split('T')[0],
            dataValidade: '',
            unidadeMedida: 'unidade',
            lote: '',
            quantidade: 1,
        });
    };

    // Handle add food
    const handleAddFood = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.alimentoId || !formData.dataValidade) {
            showError('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        try {
            await addFoodItem({
                alimentoId: parseInt(formData.alimentoId),
                usuarioId: 1, // Será obtido do contexto em produção
                dataCompra: formData.dataCompra,
                dataValidade: formData.dataValidade,
                unidadeMedida: formData.unidadeMedida,
                lote: formData.lote || undefined,
                quantidade: formData.quantidade,
            });

            setIsAddDialogOpen(false);
            resetForm();
            success('Alimento adicionado com sucesso!');
        } catch (err) {
            showError('Erro ao adicionar alimento');
        }
    };

    // Handle edit food
    const handleEditFood = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingItem) return;

        try {
            await updateFoodItem(editingItem.id, {
                alimentoId: parseInt(formData.alimentoId),
                dataCompra: formData.dataCompra,
                dataValidade: formData.dataValidade,
                unidadeMedida: formData.unidadeMedida,
                lote: formData.lote || undefined,
                quantidade: formData.quantidade,
            });

            setIsEditDialogOpen(false);
            setEditingItem(null);
            resetForm();
            success('Alimento atualizado com sucesso!');
        } catch (err) {
            showError('Erro ao atualizar alimento');
        }
    };

    // Handle delete food
    const handleDeleteFood = async () => {
        if (!itemToDelete) return;

        try {
            await deleteFoodItem(itemToDelete.id);
            setItemToDelete(null);
            success('Alimento removido com sucesso!');
        } catch (err) {
            showError('Erro ao remover alimento');
        }
    };

    // Open edit dialog
    const openEditDialog = (item: Registra) => {
        setEditingItem(item);
        setFormData({
            alimentoId: item.alimentoId.toString(),
            dataCompra: item.dataCompra,
            dataValidade: item.dataValidade,
            unidadeMedida: item.unidadeMedida,
            lote: item.lote || '',
            quantidade: item.quantidade,
        });
        setIsEditDialogOpen(true);
    };

    // Export handlers
    const handleExportCSV = () => {
        downloadPantryCSV(filteredItems);
        success('Despensa exportada com sucesso!');
    };

    const handleExportReport = () => {
        downloadPantryReport(filteredItems);
        success('Relatório gerado com sucesso!');
    };

    // Statistics
    const stats = {
        total: foodItems.length,
        fresh: foodItems.filter(item => (item.daysUntilExpiry ?? 0) > 3).length,
        expiring: expiringItems.length,
        expired: expiredItems.length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation currentPage="pantry" onNavigate={onNavigate} />
                <LoadingSpinner fullScreen text="Carregando despensa..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation currentPage="pantry" onNavigate={onNavigate} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="Despensa de Alimentos"
                    description="Gerencie seu estoque de alimentos e acompanhe as datas de validade"
                    breadcrumbs={[
                        { label: 'Dashboard', href: '#' },
                        { label: 'Despensa' },
                    ]}
                    actions={
                        <>
                            <Button
                                variant="outline"
                                onClick={handleExportReport}
                                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Relatório
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleExportCSV}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Exportar CSV
                            </Button>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Adicionar Alimento
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Adicionar Novo Alimento</DialogTitle>
                                        <DialogDescription>
                                            Preencha os dados do alimento que você deseja adicionar à despensa
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleAddFood} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="alimento">Alimento *</Label>
                                                <Select
                                                    value={formData.alimentoId}
                                                    onValueChange={(value) => handleFormChange('alimentoId', value)}
                                                    required
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o alimento" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {alimentos.map((alimento) => (
                                                            <SelectItem key={alimento.id} value={alimento.id.toString()}>
                                                                {alimento.nome} ({alimento.categoria})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="quantidade">Quantidade *</Label>
                                                <Input
                                                    id="quantidade"
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={formData.quantidade}
                                                    onChange={(e) => handleFormChange('quantidade', parseFloat(e.target.value))}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="unidade">Unidade de Medida *</Label>
                                                <Select
                                                    value={formData.unidadeMedida}
                                                    onValueChange={(value) => handleFormChange('unidadeMedida', value)}
                                                    required
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {UNITS.map((unit) => (
                                                            <SelectItem key={unit.value} value={unit.value}>
                                                                {unit.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="lote">Lote</Label>
                                                <Input
                                                    id="lote"
                                                    type="text"
                                                    value={formData.lote}
                                                    onChange={(e) => handleFormChange('lote', e.target.value)}
                                                    placeholder="Opcional"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="dataCompra">Data de Compra *</Label>
                                                <Input
                                                    id="dataCompra"
                                                    type="date"
                                                    value={formData.dataCompra}
                                                    onChange={(e) => handleFormChange('dataCompra', e.target.value)}
                                                    max={new Date().toISOString().split('T')[0]}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="dataValidade">Data de Validade *</Label>
                                                <Input
                                                    id="dataValidade"
                                                    type="date"
                                                    value={formData.dataValidade}
                                                    onChange={(e) => handleFormChange('dataValidade', e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-4 border-t">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setIsAddDialogOpen(false);
                                                    resetForm();
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                                Adicionar Alimento
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </>
                    }
                />

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <Package className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Frescos</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.fresh}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Vencendo</p>
                                    <p className="text-2xl font-bold text-accent">{stats.expiring}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-accent" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Vencidos</p>
                                    <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
                                </div>
                                <X className="h-8 w-8 text-destructive" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <SearchBar
                                    placeholder="Buscar alimentos..."
                                    onSearch={setSearchQuery}
                                    defaultValue={searchQuery}
                                />
                            </div>

                            <FilterSelect
                                placeholder="Categoria"
                                options={categoryOptions}
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                                className="w-full md:w-48"
                            />

                            <FilterSelect
                                placeholder="Status"
                                options={statusOptions}
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                                className="w-full md:w-48"
                            />

                            <div className="flex gap-2">
                                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                >
                                    <TrendingUp className={`h-4 w-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
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
                        {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery) && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                                <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                                {searchQuery && (
                                    <Badge variant="secondary" className="gap-1">
                                        Busca: {searchQuery}
                                        <button onClick={() => setSearchQuery('')} className="ml-1">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {selectedCategory !== 'all' && (
                                    <Badge variant="secondary" className="gap-1">
                                        Categoria: {selectedCategory}
                                        <button onClick={() => setSelectedCategory('all')} className="ml-1">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {selectedStatus !== 'all' && (
                                    <Badge variant="secondary" className="gap-1">
                                        Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
                                        <button onClick={() => setSelectedStatus('all')} className="ml-1">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('all');
                                        setSelectedStatus('all');
                                    }}
                                    className="h-6 px-2 text-xs"
                                >
                                    Limpar todos
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Food Items List */}
                {filteredItems.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title={
                            searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                                ? 'Nenhum alimento encontrado'
                                : 'Despensa vazia'
                        }
                        description={
                            searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                                ? 'Tente ajustar os filtros para encontrar alimentos.'
                                : 'Comece adicionando alimentos à sua despensa para gerenciar melhor sua cozinha.'
                        }
                        actionLabel={
                            searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                                ? 'Limpar Filtros'
                                : 'Adicionar Primeiro Alimento'
                        }
                        onAction={() => {
                            if (searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') {
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setSelectedStatus('all');
                            } else {
                                setIsAddDialogOpen(true);
                            }
                        }}
                    />
                ) : (
                    <>
                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentItems.map((item) => (
                                    <FoodItemCard
                                        key={item.id}
                                        item={item}
                                        onEdit={openEditDialog}
                                        onDelete={setItemToDelete}
                                    />
                                ))}
                            </div>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Alimento</TableHead>
                                            <TableHead>Quantidade</TableHead>
                                            <TableHead>Data de Compra</TableHead>
                                            <TableHead>Validade</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Lote</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.nomeAlimento}</TableCell>
                                                <TableCell>{formatQuantity(item.quantidade, item.unidadeMedida)}</TableCell>
                                                <TableCell>{formatDate(item.dataCompra)}</TableCell>
                                                <TableCell>{formatDate(item.dataValidade)}</TableCell>
                                                <TableCell>
                                                    <ExpiryBadge daysUntilExpiry={item.daysUntilExpiry} />
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {item.lote || '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditDialog(item)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setItemToDelete(item)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {startIndex} - {endIndex} de {filteredItems.length} itens
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
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => goToPage(page)}
                                                className="w-8"
                                            >
                                                {page}
                                            </Button>
                                        ))}
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Alimento</DialogTitle>
                        <DialogDescription>
                            Atualize as informações do alimento selecionado
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditFood} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-alimento">Alimento *</Label>
                                <Select
                                    value={formData.alimentoId}
                                    onValueChange={(value) => handleFormChange('alimentoId', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o alimento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {alimentos.map((alimento) => (
                                            <SelectItem key={alimento.id} value={alimento.id.toString()}>
                                                {alimento.nome} ({alimento.categoria})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-quantidade">Quantidade *</Label>
                                <Input
                                    id="edit-quantidade"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={formData.quantidade}
                                    onChange={(e) => handleFormChange('quantidade', parseFloat(e.target.value))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-unidade">Unidade de Medida *</Label>
                                <Select
                                    value={formData.unidadeMedida}
                                    onValueChange={(value) => handleFormChange('unidadeMedida', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UNITS.map((unit) => (
                                            <SelectItem key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-lote">Lote</Label>
                                <Input
                                    id="edit-lote"
                                    type="text"
                                    value={formData.lote}
                                    onChange={(e) => handleFormChange('lote', e.target.value)}
                                    placeholder="Opcional"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-dataCompra">Data de Compra *</Label>
                                <Input
                                    id="edit-dataCompra"
                                    type="date"
                                    value={formData.dataCompra}
                                    onChange={(e) => handleFormChange('dataCompra', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-dataValidade">Data de Validade *</Label>
                                <Input
                                    id="edit-dataValidade"
                                    type="date"
                                    value={formData.dataValidade}
                                    onChange={(e) => handleFormChange('dataValidade', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    setEditingItem(null);
                                    resetForm();
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                Salvar Alterações
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={!!itemToDelete}
                onOpenChange={(open) => !open && setItemToDelete(null)}
                title="Excluir Alimento"
                description={`Tem certeza que deseja excluir "${itemToDelete?.nomeAlimento}"? Esta ação não pode ser desfeita.`}
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                onConfirm={handleDeleteFood}
                variant="destructive"
            />
        </div>
    );
};