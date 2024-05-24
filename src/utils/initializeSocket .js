import { Server } from 'socket.io';
import productsModel from '../dao/Mongo/models/products.model.js';
import messagesModel from '../dao/Mongo/models/messages.model.js';
import { logger } from './logger.js';

export function initializeSocket(httpServer) {
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        logger.info('Cliente conectado');

        // Manejo de productos
        socket.on('addProduct', async (productData) => {
            try {
                await productsModel.create(productData);
                const productList = await productsModel.find();
                io.emit('productsList', productList);
            } catch (error) {
                logger.error('Error al agregar producto:', error);
            }
        });

        socket.on('deleteProduct', async (pid) => {
            try {
                await productsModel.findOneAndDelete({ _id: pid });
                const productList = await productsModel.find();
                io.emit('productsList', productList);
            } catch (error) {
                logger.error('Error al eliminar producto:', error);
            }
        });

        // Manejo de mensajes
        socket.on('message', async (data) => {
            try {
                const { email, message } = data;
                let userMessages = await messagesModel.findOne({ user: email });

                if (!userMessages) {
                    userMessages = new messagesModel({ user: email, messages: [message] });
                } else {
                    userMessages.messages.push(message);
                }

                await userMessages.save();
                const mensajes = await messagesModel.find();
                io.emit('messageLogs', mensajes);
            } catch (error) {
                logger.error('Error al manejar mensaje:', error);
            }
        });
    });
}




// import { Server } from 'socket.io';
// import productsModel from '../dao/Mongo/models/products.model.js';
// import messagesModel from '../dao/Mongo/models/messages.model.js';

// export function initializeSocket(httpServer) {
// 	const io = new Server(httpServer);

// 	let mensajes = [];

// 	io.on('connection', (socket) => {
// 		logger.info('Cliente conectado');

// 		socket.on('addProduct', async (productData) => {
// 			const newProduct = await productsModel.create(productData);
// 			const productList = await productsModel.find();
// 			io.emit('productsList', productList);
// 		});

// 		socket.on('deleteProduct', async (pid) => {
// 			const productDeleted = await productsModel.findOneAndDelete(pid);
// 			const productList = await productsModel.find();
// 			io.emit('productsList', productList);
// 		});

// 		socket.on('message1', (data) => {
// 			logger.info(data);
// 		});

// 		socket.on('message', async (data) => {
// 			mensajes.push(data);
// 			io.emit('messageLogs', mensajes);
// 			const { email, message } = await data;
// 			const updatedMessages = await messagesModel.findOne({ user: email });
// 			if (!updatedMessages) {
// 				const newUserMessages = await messagesModel.create({
// 					user: email,
// 					message,
// 				});
// 				logger.info('Nuevo usuario creado:', newUserMessages.user);
// 				return;
// 			}
// 			let newMessage;
// 			try {
// 				newMessage = JSON.parse(updatedMessages.message);
// 			} catch (error) {
// 				newMessage = updatedMessages.message;
// 			}

// 			updatedMessages.message = message + '\n' + newMessage;
// 			logger.info('Mensaje Nuevo: ', updatedMessages);

// 			const result = await updatedMessages.save();
// 		});
// 	});
// }
