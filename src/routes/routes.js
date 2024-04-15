const { Router } = require('express')
const Curso = require('../models/Curso')
const { where } = require('sequelize')

const routes = new Router()

routes.post('/cursos', async (req, res) => {
    try {
        const nome = req.body.nome
        const duracao_horas = req.body.duracao_horas

        if (!nome || !duracao_horas) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' })
        }
        if (!(duracao_horas >= 40 && duracao_horas <= 200)) {
            return res.status(400).json({ message: 'Duração do curso deve ser entre 40 e 200 horas.' })
        }

        const curso = await Curso.create({
            nome: nome,
            duracao_horas: duracao_horas
        })
        res.status(201).json(curso)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Não foi possível encontrar o curso.' })
    }
})

routes.get('/listar', async (req, res) => {
    const cursos = await Curso.findAll()
    res.status(201).json(cursos)
})

routes.get('/cursos', async (req, res) => {
    try {
        let params = {}

        if (req.query.nome) {
            params = { ...params, nome: req.query.nome }
        }

        const cursos = await Curso.findAll({
            where: params
        })

        if (cursos.length === 0) {
            return res.status(404).json({ error: 'Nenhum curso encontrado.' })
        }
        res.status(201).json(cursos)
    } catch (error) { }
})

routes.get('/cursos/horas', async (req, res) => {
    let params = {}
    let listStart = 0;
    let limit = 10;

    if (req.body.page) {
        const page = parseInt(req.body.page);
        if (!isNaN(page) && page > 0) {
            listStart = (page - 1) * limit;
        }
    }

    if (req.query.duracao_horas) {
        params = { ...params, duracao_horas: req.query.duracao_horas }
    }

    const cursos = await Curso.findAll({
        where: params,
        listStart: listStart,
        limit: limit
    })

    if (cursos.length === 0) {
        return res.status(404).json({ error: 'Nenhum curso encontrado com esta carga horária.' })
    }
    res.status(201).json(cursos)
})

routes.put('/cursos/:id', async (req, res) => {

    try {
        const id = req.params.id
        const { nome, duracao_horas } = req.body
    
        let curso = await Curso.findByPk(id);
    
        if(!curso){
            return res.status(404).json({error:'Curso não encontrado.'})
        }

        if (!nome || !duracao_horas) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' })
        }
        if (!(duracao_horas >= 40 && duracao_horas <= 200)) {
            return res.status(400).json({ message: 'Duração do curso deve ser entre 40 e 200 horas.' })
        }
    
        curso.nome = nome;
        curso.duracao_horas = duracao_horas;
    
        //Salvar as alterações no banco de dados
        await curso.save();

        res.status(201).json(curso)
    
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Erro ao atualizar o curso.'})
    }
})

routes.delete('/cursos/:id', (req, res) => {
    const id = req.params.id
    Curso.destroy({
        where: {
            id: id
        }
    })
    res.status(204).json({ message: 'Curso deletado com sucesso.' })
})

module.exports = routes