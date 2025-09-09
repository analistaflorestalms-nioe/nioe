export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'analista';
  filial: 'SP' | 'PORTO-SP' | 'MS' | 'BA';
  cargo?: string;
}

export interface Ocorrencia {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'seguranca' | 'acidente' | 'incendio' | 'furto' | 'vandalismo' | 'suspeita' | 'ambiental' | 'logistica';
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  status: 'aberta' | 'em_andamento' | 'resolvida' | 'cancelada';
  filial: 'SP' | 'PORTO-SP' | 'MS' | 'BA';
  local?: string;
  latitude?: number;
  longitude?: number;
  data_ocorrencia: string;
  criado_por: string;
  anexos?: Array<{
    nome: string;
    tipo: string;
    url: string;
  }>;
  criador?: User;
  created_at: string;
  updated_at: string;
}

export interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  rg?: string;
  data_nascimento?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cargo?: string;
  tipo_contrato: 'organico' | 'terceirizado';
  filial: 'SP' | 'PORTO-SP' | 'MS' | 'BA';
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  antecedentes_criminais?: string;
  relacoes_politicas?: string;
  vinculos_anteriores?: string;
  referencias?: string;
  observacoes?: string;
  criado_por: string;
  aprovado_por?: string;
  data_aprovacao?: string;
  motivo_rejeicao?: string;
  criador?: User;
  aprovador?: User;
  created_at: string;
  updated_at: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  resumo?: string;
  conteudo?: string;
  url: string;
  fonte: string;
  autor?: string;
  data_publicacao: string;
  categoria: 'incendio' | 'seguranca' | 'ambiental' | 'logistica' | 'economia' | 'tecnologia' | 'geral';
  relevancia: 'baixa' | 'media' | 'alta';
  tags?: string[];
  processada: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  contadores: {
    totalOcorrencias: number;
    ocorrenciasAbertas: number;
    ocorrenciasCriticas: number;
    totalColaboradores: number;
    colaboradoresPendentes: number;
    totalNoticias: number;
    noticiasRelevantes: number;
  };
  distribuicoes: {
    ocorrenciasPorTipo: Array<{ tipo: string; total: number }>;
    ocorrenciasPorStatus: Array<{ status: string; total: number }>;
    ocorrenciasPorFilial: Array<{ filial: string; total: number }>;
    colaboradoresPorFilial: Array<{ filial: string; total: number }>;
    noticiasPorCategoria: Array<{ categoria: string; total: number }>;
  };
  tendencias: {
    ocorrenciasRecentes: Array<{ data: string; total: number }>;
  };
  metadata: {
    ultimaAtualizacao: string;
    ultimaOcorrencia?: string;
    ultimaNoticia?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    perPage: number;
  };
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}