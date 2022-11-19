import { UserEntity } from "src/user/user.entity";
import { MemberEntity } from "../entities/member.entity";
import { MessageEntity } from "../entities/message.entity";
import { RoomEntity } from "../entities/room.entity";

export class CreateMemberDto {
    user: UserEntity;
    socketId: string;

    constructor(user: UserEntity = new UserEntity(), socketId: string = "") {
        this.user = user;
        this.socketId = socketId;
    }

    public static from(dto: Partial<CreateMemberDto>) {
        const member = new CreateMemberDto();
        member.user = dto.user;
        member.socketId = dto.socketId;
        return (member);
    }

    public static fromEntity(entity: MemberEntity) {
        const member = new CreateMemberDto();
        member.user = entity.user;
        member.socketId = entity.socketId;
        return (member);
    }

    public toEntity() {
        const member = new MemberEntity();
        member.user = this.user;
        member.socketId = this.socketId;
        return (member);
    }
}