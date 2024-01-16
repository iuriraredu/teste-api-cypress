import contrato from '../contracts/produtos.contracts'

describe('Teste da Funcionalidade Produtos', () => {
    let token;
    beforeEach(() => {
        cy.token('fulano@qa.com','teste').then( tkn => {token = tkn});
    });

    it('Deve validar contrato de produtos', () => {
        cy.request('produtos').then(response =>{
            return contrato.validateAsync(response.body);
        });
    });

    it('Listar Produtos', () => {
        cy.request({
            method: 'GET',
            url:'/produtos'
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('produtos');
            expect(response.duration).to.be.lessThan(15);
        });
    });

    it('Cadastrar Produto ', () => {

        cy.cadastrarProduto(
            token, "Taylor Swift - Red (Taylor's Version)", 109, "CD de áudio", 250
        ).then((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.message).to.equal('Já existe produto com esse nome');
        });

    });

    it('Cadastrar Produto Dinamicamente', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`;
        cy.cadastrarProduto(
            token, produto, 1500, "Curso online", 25000
        ).then((response) => {
            expect(response.status).to.equal(201);
            expect(response.body.message).to.equal('Cadastro realizado com sucesso');
        });

    });

    it('Deve editar um produto já cadastrado', () => {
        cy.request('/produtos').then(response => {
            cy.log(response.body.produtos[1].nome)
            cy.request({
                method: 'PUT',
                url: `produtos/${response.body.produtos[1]._id}`,
                headers:{authorization: token},
                body:{
                    "nome": `${response.body.produtos[1].nome} ${Math.floor(Math.random() * 2)}`,
                    "preco": Math.floor(Math.random() * 500),
                    "descricao": "Produto Editado",
                    "quantidade": Math.floor(Math.random() * 1000)
                }
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal('Registro alterado com sucesso');
            });
        });
    });

    it('Deve editar um produto cadastrado previamente', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100000000)}`;
        cy.cadastrarProduto(
            token, produto, 1500, "Curso online", 25000
        ).then(response =>{
            cy.request({
                method: 'PUT',
                url: `produtos/${response.body._id}`,
                headers:{authorization: token},
                body:{
                    "nome": produto,
                    "preco": 2000,
                    "descricao": "Produto Editado",
                    "quantidade": 381
                }
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal('Registro alterado com sucesso');
            });
        });
    });

    it('Deletar Produto ', () => {
        cy.cadastrarProduto(
            token, `Produto EBAC ${Math.floor(Math.random() * 100000000)}`, 1500, "Curso online", 25000
        ).then(response =>{
            cy.request({
                method: 'DELETE',
                url:`produtos/${response.body._id}`,
                headers:{
                    authorization: token
                }
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.message).to.equal('Registro excluído com sucesso');
            });
        });
    });
});