// Entidades principais
export interface IEntity {
  id: number | null;
}

// DTOs padrão
export interface ICreateDTO {
  createdAt?: Date;
}

export interface IUpdateDTO {
  updatedAt?: Date;
}

export interface IResponseDTO {
  id: number;
}

// Resultado paginado (futuro)
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Resposta padrão da API
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}