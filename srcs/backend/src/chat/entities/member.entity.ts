import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MessageEntity } from "./message.entity";
import { RoomEntity } from "./room.entity";

@Entity({ name: "Member" })
export class MemberEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column()
    socketId: string;

    @OneToMany(() => MessageEntity, message => message.member)
    messages: MessageEntity[];
}