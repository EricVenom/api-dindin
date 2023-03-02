create database dindin;

create table usuarios(
    id serial primary key,
    nome varchar not null, 
    email varchar not null unique, 
    senha varchar not null
);

create table categorias(
    id serial primary key,
    descricao varchar not null
);


create table transacoes(
    id serial primary key,
    descricao varchar not null, 
    valor int not null,
    data varchar not null,
    categoria_id int references categorias(id) not null,
    usuario_id int references usuarios(id) not null,
    tipo varchar not null
);

insert into categorias 
(descricao)
values
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas')