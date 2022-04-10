import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ChatGateway } from './gateway/chat.gateway';
import { RoomEntity } from './models/room.entity';
import { RoomService } from './services/room/room.service';

@Module({
  imports: [UsersModule, AuthModule],
	providers: [ChatGateway, RoomService]
})

export class ChatModule {}
