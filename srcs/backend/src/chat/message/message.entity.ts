import { RoomEntity } from "src/room/room.entity";
import { RoomInterface } from "src/room/room.interface";
import { UserInterface } from "src/user/user.interface";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Message" })

export class MessageEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    userId: number;

    @ManyToOne(() => RoomEntity, (room) => room.messages)
    room: RoomInterface;

    @CreateDateColumn()
    created_at: Date;

}
