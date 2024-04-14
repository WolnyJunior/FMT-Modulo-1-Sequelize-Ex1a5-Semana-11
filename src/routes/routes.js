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

module.exports = routes