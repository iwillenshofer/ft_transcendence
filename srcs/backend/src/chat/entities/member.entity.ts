import { UserEntity } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MemberRole } from "../models/memberRole.model";
import { MessageEntity } from "./message.entity";
import { RoomEntity } from "./room.entity";

@Entity({ name: "Member" })
export class MemberEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

    @Column({ default: MemberRole.Member })
    role: MemberRole;

    @Column()
    socketId: string;

    @OneToMany(() => MessageEntity, message => message.member, { onDelete: "CASCADE" })
    messages: MessageEntity[];
}