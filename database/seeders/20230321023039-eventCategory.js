'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('EventCategories', [
      {
        name: 'Bodas',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cumpleaños',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fiestas de graduación',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Eventos corporativos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Eventos deportivos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Conciertos',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Exposiciones',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Festivales',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Conferencias',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('EventCategories', null, {});
  }
};
