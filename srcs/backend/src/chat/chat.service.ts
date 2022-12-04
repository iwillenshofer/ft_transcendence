import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { EncryptService } from 'src/services/encrypt.service';
import { UserEntity } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { Brackets, Repository } from 'typeorm';
import { CreateMemberDto } from './dto/createMember.dto';
import { CreateMessageDto } from './dto/createMessage.dto';
import { BlockedUserEntity } from './entities/blocked_user.entity';
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
        @InjectRepository(BlockedUserEntity)
        private blockedUserRepository: Repository<BlockedUserEntity>,
        private readonly encrypt: EncryptService,
        private UsersService: UsersService) { }

    async addMemberToRoom(room: RoomEntity, member: MemberEntity): Promise<RoomEntity> {
        room.members.push(member);
        return await this.roomRepository.save(room);
    }

    async createRoom(room: RoomEntity, members: MemberEntity[]): Promise<RoomEntity> {
        room.members = [];
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
        return await this.memberRepository.find({
            where: { 'user': { 'id': userId } },
            relations: { user: true, rooms: true }
        });
    }

    async getMemberByUserId(userId: number): Promise<MemberEntity> {
        return await this.memberRepository.findOne({
            where: { 'user': { 'id': userId } },
            relations: { user: true, rooms: true }
        });
    }

    async getMemberByRoomAndUser(room: RoomEntity, user: UserEntity): Promise<MemberEntity | null> {
        const member = await this.memberRepository
            .createQueryBuilder('member')
            .leftJoinAndSelect("member.user", "user")
            .leftJoinAndSelect("member.rooms", "rooms")
            .where("rooms.id = :roomId", { roomId: room.id })
            .andWhere("user.id = :userId", { userId: user.id })
            .getOne()

        return (member);
    }

    async rejoinMemberToRoom(member: MemberEntity) {
        member.isMember = true;
        await this.memberRepository.save(member);
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

    async getRoomsOfMember(userId: number, options: IPaginationOptions): Promise<Pagination<RoomEntity>> {
        const query = this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.members', 'member')
            .leftJoin('member.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('member.isMember = :isMember', { isMember: true })
        let pages = await paginate(query, options);
        pages.meta.currentPage -= 1;
        return (pages);
    }

    async isRoomNameTaken(roomName: string) {
        let count = await this.roomRepository.countBy({ name: roomName });
        return count == 0 ? false : true;
    }

    async removeMemberFromRoom(room: RoomEntity, member: MemberEntity): Promise<string> {
        // TODO : Check if member is the creator.
        //        If yes, we need to change the creator. (Maybe an admin)
        //        If no admin, delete the room

        // let thisRoom = await this.roomRepository.findOne({
        //     where: { id: room.id },
        //     relations: ['members', 'members.user']
        // });

        if (member.role == MemberRole.Owner) {
            if (await this.roomRepository.remove(room)) {
                await this.memberRepository.remove(member);
                return ("delete_room");
            }
        }

        member.isMember = false;
        await this.memberRepository.save(member);

        return ("");
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

    async findMessagesForRoom(room: RoomEntity, options: IPaginationOptions, userId: number): Promise<Pagination<MessageEntity>> {

        let blockedUsers: number[] = [];
        (await this.getBlockedUser(userId)).forEach(user => {
            blockedUsers.push(user.blockedUserId);
        });

        let usersToSend: number[] = [];
        (await this.getMembersByRoom(room)).forEach(member => {
            if (!blockedUsers.includes(member.user.id))
                usersToSend.push(member.user.id);
        });

        const query = this.messageRepository
            .createQueryBuilder('message')
            .leftJoin('message.room', 'room')
            .where('room.id = :roomId', { roomId: room.id })
            .leftJoinAndSelect('message.member', 'member')
            .leftJoinAndSelect('member.user', 'user')
            .andWhere('user.id IN (:...usersToSend)', { usersToSend: usersToSend })
        let res = await paginate(query, options);
        return (res);
    }

    async getMembersByRoom(room: RoomEntity): Promise<MemberEntity[]> {
        // const currentRoom = await this.roomRepository.findOne({
        //     where: { id: room.id },
        //     relations: {
        //         members: { user: true }
        //     }
        // });
        // return currentRoom.members;
        const members = await this.memberRepository
            .createQueryBuilder('member')
            .leftJoinAndSelect("member.user", "user")
            .leftJoinAndSelect("member.rooms", "rooms")
            .where("rooms.id = :roomId", { roomId: room.id })
            .andWhere("member.isMember = :isMember", { isMember: true })
            .getMany()

        return (members);
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

    async searchUsers(search: string, me: string, userId: number) {

        let blockedUsers: number[] = [];
        (await this.getBlockedUser(userId)).forEach(user => {
            blockedUsers.push(user.blockedUserId);
        });

        let blockerUsers: number[] = [];
        (await this.getBlockerUser(userId)).forEach(user => {
            blockerUsers.push(user.userId);
        });

        let nonBlockedUsers: number[] = [];
        (await await this.UsersService.getAllUsers()).forEach(user => {
            if (!blockedUsers.includes(user.id) && !blockerUsers.includes(user.id))
                nonBlockedUsers.push(user.id);
        });

        let query = this.userRepository
            .createQueryBuilder("user")
            .select(['user.username', 'user.avatar_url', 'user.id'])
            .where('user.username != :me', { me: me })
            .andWhere("user.username like :name", { name: `%${search}%` })
        if (nonBlockedUsers.length > 0) {
            query.andWhere("user.id IN (:...users)", { users: nonBlockedUsers })
        }
        const users = await query.getMany();
        console.log(users)
        return users;
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

    async addBlockedUser(userId: number, BlockedUserId: number) {
        await this.blockedUserRepository.save({ userId: userId, blockedUserId: BlockedUserId });
    }

    async removeBlockedUser(userId: number, BlockedUserId: number) {
        const blockedUser = await this.blockedUserRepository.find({ where: { userId: userId, blockedUserId: BlockedUserId } });
        await this.blockedUserRepository.remove(blockedUser);
    }

    async isBlockedUser(userId: number, BlockedUserId: number): Promise<boolean> {
        const count = await this.blockedUserRepository.count({ where: { userId: userId, blockedUserId: BlockedUserId } });
        if (count > 0)
            return (true);
        return (false);
    }

    async getBlockedUser(userId: number): Promise<BlockedUserEntity[]> {
        return (await this.blockedUserRepository.find({ where: { userId: userId } }));
    }

    async getBlockerUser(userId: number): Promise<BlockedUserEntity[]> {
        return (await this.blockedUserRepository.find({ where: { blockedUserId: userId } }));
    }

    async getAllMyRooms(userId: number): Promise<RoomEntity[]> {
        const rooms = await this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.members', 'member')
            .leftJoin('member.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('member.isMember = :isMember', { isMember: true })
            .getMany();
        return (rooms);
    }

    async getDirectRoom(user_1: string, user_2: string): Promise<RoomEntity> {
        const room = await this.roomRepository
            .createQueryBuilder('room')
            .leftJoin('room.members', 'member')
            .leftJoin('member.user', 'user')
            .where('room.type = :DirectType', { DirectType: RoomType.Direct })
            .andWhere(new Brackets(qb => {
                qb.andWhere(new Brackets(qb => {
                    qb.where('room.name = :username1', { username1: user_1 })
                        .andWhere('room.name2 = :username2', { username2: user_2 })
                }))
                    .orWhere(new Brackets(qb => {
                        qb.where('room.name = :username2', { username2: user_2 })
                            .andWhere('room.name2 = :username1', { username1: user_1 })
                    }))
            }))
            .getOne()
        return (room);
    }

    async setAdmin(member: MemberEntity) {
        member.role = MemberRole.Administrator;
        await this.memberRepository.save(member);
    }

    async unsetAdmin(member: MemberEntity) {
        member.role = MemberRole.Member;
        await this.memberRepository.save(member);
    }

    async getMemberById(memberId: number) {
        const member = await this.memberRepository
            .createQueryBuilder("member")
            .where("member.id = :memberId", { memberId: memberId })
            .getOne();

        return (member);
    }

    async setMute(member: MemberEntity, muteTime: Date) {
        member.muteUntil = muteTime;
        await this.memberRepository.save(member);
    }

    async setBan(member: MemberEntity, banTime: Date) {
        member.banUntil = banTime;
        await this.memberRepository.save(member);
    }

}
