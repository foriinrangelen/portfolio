import 'reflect-metadata';
import { container } from 'tsyringe';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';

export function configureContainer() {
	container.registerSingleton(AuthRepository);
	container.registerSingleton(AuthService);
	container.registerSingleton(AuthController);
}
