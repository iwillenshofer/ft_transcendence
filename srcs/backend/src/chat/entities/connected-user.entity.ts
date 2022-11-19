import { UserEntity } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: "ConnectedUser" })

export class ConnectedUserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    socketId: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity;

}