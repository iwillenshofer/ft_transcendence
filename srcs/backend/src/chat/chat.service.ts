import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { EncryptService } from 'src/services/encrypt.service';
import { UserEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { Brackets, Repository } from 'typeorm';
import { CreateMemberDto } from './dto/createMember.dto';
import { CreateMessageDto } from './dto/createMessage.dto';
import { ConnectedUserEntity } from './entities/connected-user.entity';
import { MemberEntity } from './entities/member.entity';
import { MessageEntity } from './entities/message.entity';
import { RoomEntity } from './entities/room.entity';
import { MemberRole } from './models/memberRole.model';
import { RoomType } from './models/typeRoom.model';

@Injectable()
export class ChatService {

    constructor(
        @InjectRepository(RoomEntity)
        private roomRepository: Repository<RoomEntity>,
        @InjectRepository(MessageEntity)
        private messageRepository: Repository<MessageEntity>,
        @InjectRepository(MemberEntity)
        private memberRepository: Repository<MemberEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(ConnectedUserEntity)
        private connectedUserRepository: Repository<ConnectedUserEntity>,
        private readonly encrypt: EncryptService,
        private UsersService: UsersService) { }

    async addMemberToRoom(room: RoomEntity, member: MemberEntity): Promise<RoomEntity> {
        room.members.push(member);
        return await this.roomRepository.save(room);
    }

    async createRoom(room: RoomEntity, members: MemberEntity[]): Promise<RoomEntity> {
        room.members = [];
        //room.creatorId = members[0].user.id;
        members[0].role = MemberRole.Owner;
        members.forEach(member => {
            room.members.push(member);
        })
        return await this.roomRepository.save(room);
    }

    async createMember(user: UserEntity, socketId: string, role: MemberRole): Promise<MemberEntity> {
        const member = new CreateMemberDto(user, socketId, role);
        return await this.memberRepository.save(member.toEntity());
    }

    async getMembersByUserId(userId: number): Promise<MemberEntity[]> {
        return this.memberRepository.find({
            where: { 'user': { 'id': userId } },
            relations: { user: true, rooms: true }
        });
    }



    async getAllMembers(): Promise<MemberEntity[]> {
        return await this.memberRepository.find({ relations: { user: true } });
    }

    async updateSocketIdMember(socketId: string, members: MemberEntity[]): Promise<MemberEntity[]> {
        let membersUpdated = [];
        for (var member of members) {
            member.socketId = socketId;
            let ret = await this.memberRepository.save(member);
            membersUpdated.push(ret);
        }
        return (membersUpdated);
    }

    // async getAllMyConvRoomsAsText(userId: number): Promise<String[]> {
    //     const query = await this.roomRepository
    //         .createQueryBuilder('room')
    //         .leftJoin('room.users', 'user')
    //         .where('user.id = :userId', { userId })
    //         .leftJoinAndSelect('room.users', 'all_users')
    //         .getMany();

    //     let res: string[] = [];
    //     query.forEach(item => {
    //         if (item && item.type == RoomType.Direct) {
    //             if (item.name != undefined && item.name != null) {
    //                 let name = item.name ?? '';
    //                 res.push(name);
    //             }
    //             if (item.name2 != undefined && item.name2 != null) {
    //                 let name2 = item.name2 ?? '';
    //                 res.push(name2);
    //             }
    //         }
    //     });
    //     res.filter((item, index) => res.indexOf(item) === index);
    //     return (res);
    // }

    // async getAllConnectedUsers(): Promise<UserEntity[]> {
    //     const users = await this.userRepository
    //         .createQueryBuilder('user')
    //         .select('connected_users')
    //         .getMany();

    //     console.log(users);
    //     return users;

    // }

    async getAllMyRoomsAsText(userId: number): Promise<String[]> {
        const rooms = await this.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.members', 'member')
            .leftJoinAndSelect('member.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere("room.type IN (:...types)", { types: [RoomType.Public, RoomType.Protected] })
            .getMany();
        let myRooms: string[] = [];
        rooms.forEach(room => {
            myRooms.push(room.name);
        })
        return (myRooms);
    }

    async getMyRooms(userId: number): Promise<RoomEntity[]> {
        return await this.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.members', 'member')
            .leftJoinAndSelect('member.user', 'user')
            .where('user.id = :userId', { userId })
            .getMany();
    }

    async getPublicAndProtectedRooms(options: IPaginationOptions): Promise<Pagination<RoomEntity>> {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .where("room.type IN (:...types)", { types: [RoomType.Public, RoomType.Protected] });
        let pages = await paginate(query, options);
        pages.meta.currentPage -= 1;
        return (pages);
    }

    async getRoomById(roomId: number): Promise<RoomEntity> {
        const room = this.roomRepository.findOne({
            where: { id: roomId },
            relations: { members: true }
        });
        return (room);
    }

    // async getRoomByName(roomName: string): Promise<RoomEntity> {
    //     const room = await this.roomRepository.findOneBy({ name: roomName });
    //     return (room);
    // }

    async getRoomsOfMember(userId: number, options: IPaginationOptions): Promise<Pagination<RoomEntity>> {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.members', 'member')
            .leftJoin('member.user', 'user')
            .where('user.id = :userId', { userId });
        let pages = await paginate(query, options);
        pages.meta.currentPage -= 1;
        return (pages);
    }

    // async getRoomsForMember(userId: number, options: IPaginationOptions): Promise<Pagination<RoomEntity>> {
    //     const query = this.roomRepository
    //         .createQueryBuilder('member')
    //         .leftJoin('member.user', 'user')
    //         .where('user.id = :userId', { userId });
    //     let res = await paginate(query, options);
    //     res.meta.currentPage -= 1;
    //     console.log(res)
    //     return (res);
    // }

    async isRoomNameTaken(roomName: string) {
        let count = await this.roomRepository.countBy({ name: roomName });
        return count == 0 ? false : true;
    }

    // async updateNameDirectRooms(oldUsername: string, newUsername: string) {
    //     let directRoomsName = await this.roomRepository.find({
    //         where: { name: oldUsername }
    //     });

    //     let directRoomsName2 = await this.roomRepository.find({
    //         where: { name2: oldUsername }
    //     });

    //     directRoomsName.forEach(item => {
    //         if (item.name == oldUsername) {
    //             item.name = newUsername;
    //             item.save();
    //         }
    //     });

    //     directRoomsName2.forEach(item => {
    //         if (item.name2 == oldUsername) {
    //             item.name2 = newUsername;
    //             item.save();
    //         }
    //     });
    // }

    async removeMemberFromRoom(room: RoomEntity, member: MemberEntity): Promise<RoomEntity> {
        // TODO : Check if member is the creator.
        //        If yes, we need to change the creator. (Maybe an admin)
        //        If no admin, delete the room

        let thisRoom = await this.roomRepository.findOne({
            where: { id: room.id },
            relations: ['members', 'members.user']
        });

        this.messageRepository.delete

        if (thisRoom.members.length == 1) {
            if (await this.deleteRoom(thisRoom)) {
                return (null);
            }
        }

        for (const { index, value } of thisRoom.members.map((value, index) => ({ index, value }))) {
            if (value.user.id == member.user.id) {
                thisRoom.members.splice(index, 1);
                return await this.roomRepository.save(thisRoom);
            }
        };
        return (null);
    }

    async verifyPassword(roomId: number, password: string): Promise<boolean> {
        const room = await this.getRoomById(roomId);
        if (room && room.type == RoomType.Protected) {
            let encryptedPass = this.encrypt.encode(password);
            console.log(encryptedPass)
            if (encryptedPass == room.password) {
                return true;
            }
        }
        return false;
    }

    async createMessage(createMessage: MessageEntity, member: MemberEntity): Promise<MessageEntity> {
        createMessage.member = member;
        let message = this.messageRepository.create(createMessage);
        const ret = await message.save();
        return (ret);
    }

    // async getUsersFromRoom(room: RoomEntity) {
    //     const users = await this.roomRepository.findOne({
    //         where: { id: room.id },
    //         relations: { users: true },
    //         select: { users: true }
    //     });
    // }

    async findMessagesForRoom(room: RoomEntity, options: IPaginationOptions): Promise<Pagination<MessageEntity>> {
        const query = this.messageRepository
            .createQueryBuilder('message')
            .leftJoin('message.room', 'room')
            .where('room.id = :roomId', { roomId: room.id })
            .leftJoinAndSelect('message.member', 'member')
            .leftJoinAndSelect('member.user', 'user')
        let res = await paginate(query, options);
        return (res);
    }

    // async addMemberToRoom(member: MemberEntity) {
    //     const res = await this.memberRepository.save(member);
    //     return (res);
    // }

    // async removeMemberFromRoom(user: UserEntity) {
    //     const res = this.memberRepository.delete(user);
    //     return (res);
    // }

    async deleteRoom(room: RoomEntity) {
        return this.roomRepository.remove(room);
    }

    async getMembersByRoom(room: RoomEntity): Promise<MemberEntity[]> {
        const currentRoom = await this.roomRepository.findOne({
            where: { id: room.id },
            relations: {
                members: { user: true }
            }
        });
        return currentRoom.members;
    }

    async getAllAddedUsers(user: UserEntity) {
        const type = RoomType.Direct;
        const username = user.username;
        let users: UserEntity[] = [];
        const rooms = await this.roomRepository
            .createQueryBuilder('room')
            .leftJoinAndSelect('room.members', 'member')
            .where('room.type = :type', { type })
            .getMany();

        for await (var room of rooms) {
            for await (var member of room.members) {
                const user = await this.UsersService.getUserByMemberId(member.id)
                if (user != null && user.username != username)
                    users.push(user);
            }
        }
        return (users);
    }

    async getNonAddedUsers(userId: number) {
        const user = await this.UsersService.getUserById(userId);
        const allUsers = await this.UsersService.getAllUsers();
        const allAddedUsers = await this.getAllAddedUsers(user);

        const nonAddedUsers = allUsers.filter(x => !allAddedUsers.map(y => y.id).includes(x.id));
        nonAddedUsers.forEach((element, index) => {
            if (element.id == user.id)
                nonAddedUsers.splice(index, 1);
        });

        return (nonAddedUsers);
    }

    async searchUsers(search: string, me: string) {
        let res = await this.userRepository
            .createQueryBuilder("user")
            .select(['user.username', 'user.avatar_url', 'user.id'])
            .where('user.username != :me', { me: me })
            .andWhere("user.username like :name", { name: `%${search}%` })
            .getMany();
        return res;
    }

    async getMyMemberOfRoom(roomId: number, userId: number): Promise<MemberEntity> {
        let room = await this.roomRepository.findOne({
            relations: ['members', 'members.user'],
            where: { id: roomId }
        });
        if (room) {
            let member = room.members.find(member => member.user.id == userId)
            if (member) {
                return (member);
            }
        }
        return (null);
    }

    async updateRoomName(room: RoomEntity, name: string) {
        room.name = name;
        await this.roomRepository.save(room);
    }

    async updateRoomDescription(room: RoomEntity, description: string) {
        room.description = description;
        await this.roomRepository.save(room);
    }

    async updateOrCreateRoomPassword(room: RoomEntity, password: string) {
        const encodedPassword = this.encrypt.encode(password);
        room.password = encodedPassword;
        room.type = RoomType.Protected;
        await this.roomRepository.save(room);
    }

    async removeRoomPassword(room: RoomEntity) {
        room.password = null;
        room.type = RoomType.Private;
        await this.roomRepository.save(room);
    }



    // let res = await this.memberRepository
    //     .createQueryBuilder("member")
    //     .leftJoinAndSelect('member.room', 'room')
    //     .leftJoinAndSelect('member.user', 'user')
    //     .where('room.id = :roomId', { roomId })
    //     .andWhere('user.id = : userId', { userId })
    //     .getOne()

    // console.log(res);
    // return (res);
}
