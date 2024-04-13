'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('alunos', {
       id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
       },
       nome: {
        allowNull: false,
        type: Sequelize.STRING
      },
      data_nascimento: {
        allowNull: false,
        type: Sequelize.DATE
      },

      //timestamps na definição do esquema, que adicionará automaticamente esses campos e os gerenciará sempre que um registro for criado ou atualizado
      
       createdAt: { //criar coluna que faz o log data/hora nas inserções
        allowNull: false,
        type: Sequelize.DATE
      },
       updatedAt: { //criar coluna que faz o log data/hora nas atualizações
        allowNull: false,
        type: Sequelize.DATE
      }
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('alunos');
  }
};
