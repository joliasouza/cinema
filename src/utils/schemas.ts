import { z } from 'zod';

export const filmeSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório').max(100, 'Título muito longo'),
  genero: z.string().min(1, 'Gênero é obrigatório'),
  classificacao: z.string().min(1, 'Classificação é obrigatória'),
  duracao: z.coerce.number().min(1, 'Duração deve ser maior que 0').max(500, 'Duração inválida'),
  estreia: z.string().min(1, 'Data de estreia é obrigatória'),
  descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').max(500, 'Descrição muito longa'),
});

export const salaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo'),
  capacidade: z.coerce.number().min(1, 'Capacidade deve ser maior que 0').max(1000, 'Capacidade inválida'),
  tipo: z.enum(['2D', '3D', 'IMAX'], { message: 'Tipo inválido' }),
});

export const sessaoSchema = z.object({
  filmeId: z.string().min(1, 'Filme é obrigatório'),
  salaId: z.string().min(1, 'Sala é obrigatória'),
  datahora: z.string()
    .min(1, 'Data e hora são obrigatórias')
    .refine((val) => {
      const dataSelecionada = new Date(val);
      const agora = new Date();
      return dataSelecionada >= agora;
    }, { message: 'A data da sessão não pode ser anterior à data atual' }),
  preco: z.coerce.number().min(0, 'Preço não pode ser negativo').max(500, 'Preço inválido'),
  idioma: z.enum(['Dublado', 'Legendado'], { message: 'Idioma inválido' }),
  formato: z.enum(['2D', '3D'], { message: 'Formato inválido' }),
});

export const ingressoSchema = z.object({
  sessaoId: z.string().min(1, 'Sessão é obrigatória'),
  cliente: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
  cpf: z.string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(14, 'CPF inválido')
    .regex(/^[\d.-]+$/, 'CPF deve conter apenas números, pontos e hífens'),
  assento: z.string()
    .min(2, 'Assento inválido')
    .max(5, 'Assento inválido')
    .regex(/^[A-Z]\d+$/i, 'Formato de assento inválido (ex: A10)'),
  pagamento: z.enum(['Cartão', 'Pix', 'Dinheiro'], { message: 'Tipo de pagamento inválido' }),
});

export type FilmeFormData = z.infer<typeof filmeSchema>;
export type SalaFormData = z.infer<typeof salaSchema>;
export type SessaoFormData = z.infer<typeof sessaoSchema>;
export type IngressoFormData = z.infer<typeof ingressoSchema>;
