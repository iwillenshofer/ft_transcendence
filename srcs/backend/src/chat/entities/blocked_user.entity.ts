import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "BlockedUser" })

export class BlockedUserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    blockedUserId: number;
}
