import { UserEntity } from "src/user/user.entity";
import { MemberEntity } from "../entities/member.entity";
import { MessageEntity } from "../entities/message.entity";
import { RoomEntity } from "../entities/room.entity";

export class CreateMessageDto {
    message: string;
    room: RoomEntity;
    member: MemberEntity;

    constructor(message: string = "", room: RoomEntity = new RoomEntity(), member: MemberEntity = new MemberEntity) {
        this.message = message;
        this.room = room;
        this.member = member;
    }

    public static from(dto: Partial<CreateMessageDto>) {
        const message = new CreateMessageDto();
        message.message = dto.message;
        message.room = dto.room;
        message.member = dto.member;
        return (message);
    }

    public static fromEntity(entity: MessageEntity) {
        const message = new CreateMessageDto();
        message.message = entity.message;
        message.room = entity.room;
        message.member = entity.member;
        return (message);
    }

    public toEntity() {
        const message = new MessageEntity();
        message.message = this.message;
        message.room = this.room;
        message.member = this.member;
        return (message);
    }
}