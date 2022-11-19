import { UserEntity } from "src/users/users.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { RoomType } from "../models/typeRoom.model";
import { MemberEntity } from "./member.entity";
import { MessageEntity } from "./message.entity";

@Entity({ name: "Room" })
@Unique(['id'])
export class RoomEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    name2: string;

    @Column()
    description: string;

    @Column()
    type: RoomType;

    @Column()
    creatorId: number;

    @Column({ nullable: true })
    password: string;

    @OneToMany(() => MessageEntity, message => message.room)
    messages: MessageEntity[];

    @ManyToMany(() => MemberEntity)
    @JoinTable()
    members: MemberEntity[];

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;
}