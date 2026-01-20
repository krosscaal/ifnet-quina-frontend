export interface Pessoa {
    id: number;
    nome: string;
    email: string;
    phone: string;
    num1: string;
    num2: string;
    num3: string;
    num4: string;
    num5: string;

}

export interface PessoaFormData {
    nome: string;
    email: string;
    phone: string;
    num1: string;
    num2: string;
    num3: string;
    num4: string;
    num5: string;
}

export interface PessoaRequest {
    nome: string;
    email: string;
    phone: string;
    aposta: string[];
}