'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'Providers',
			[
				{
					title: 'Músico para eventos',
					introductionMessage:
						'Ofrezco servicios de música en vivo para bodas, fiestas de cumpleaños, eventos corporativos, entre otros.',
					description:
						'Ofrezco servicios de música en vivo para bodas, fiestas de cumpleaños, eventos corporativos, entre otros.',
					contactName: 'Juan Pérez',
					contactEmail: 'juanperez@gmail.com',
					contactPhone: '573214363313',
					price: 1000.5,
					location: 'Ciudad de México',
					imageUrl: 'https://example.com/musico.jpg',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					title: 'Pastelería Doña Rosa',
					introductionMessage:
						'Elaboramos deliciosas tortas, cupcakes y pasteles para cualquier tipo de evento.',
					description:
						'Elaboramos deliciosas tortas, cupcakes y pasteles para cualquier tipo de evento.',
					contactName: 'Rosa Martínez',
					contactEmail: 'rosamartinez@gmail.com',
					contactPhone: '573214363313',
					price: 500.75,
					location: 'Guadalajara, Jalisco',
					imageUrl: 'https://example.com/pasteleria.jpg',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					title: 'Decoración de eventos',
					introductionMessage:
						'Creamos la atmósfera perfecta para tu evento con hermosos arreglos florales y decoración temática.',
					description:
						'Creamos la atmósfera perfecta para tu evento con hermosos arreglos florales y decoración temática.',
					contactName: 'María González',
					contactEmail: 'mariagonzalez@gmail.com',
					contactPhone: '573214363313',
					price: 2000.0,
					location: 'Monterrey, Nuevo León',
					imageUrl: 'https://example.com/decoracion.jpg',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					title: 'Cantante',
					introductionMessage:
						'Creamos la atmósfera perfecta para tu evento con hermosos arreglos florales y decoración temática.',
					description:
						'Creamos la atmósfera perfecta para tu evento con hermosos arreglos florales y decoración temática.',
					contactName: 'María González',
					contactEmail: 'mariagonzalez@gmail.com',
					contactPhone: '573214363313',
					price: 2000.0,
					location: 'Monterrey, Nuevo León',
					imageUrl: 'https://example.com/decoracion.jpg',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					title: 'Catering',
					introductionMessage:
						'Creamos la atmósfera perfecta para tu evento con hermosos arreglos florales y decoración temática.',
					description:
						'Creamos la atmósfera perfecta para tu evento con hermosos arreglos florales y decoración temática.',
					contactName: 'María González',
					contactEmail: 'mariagonzalez@gmail.com',
					contactPhone: '573214363313',
					price: 2000.0,
					location: 'Monterrey, Nuevo León',
					imageUrl: 'https://example.com/decoracion.jpg',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					title: 'Barra de cafe',
					introductionMessage:
						'Creamos la atmósfera perfecta para tu evento con hermosos arreglos florales y decoración temática.',
					description:
						'Creamos la atmósfera perfecta para tu evento con hermosos arreglos florales y decoración temática.',
					contactName: 'María González',
					contactEmail: 'mariagonzalez@gmail.com',
					contactPhone: '573214363313',
					price: 2000.0,
					location: 'Monterrey, Nuevo León',
					imageUrl: 'https://example.com/decoracion.jpg',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Providers', null, {});
	},
};
