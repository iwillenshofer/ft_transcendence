import { UserEntity } from "src/user/user.entity";
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