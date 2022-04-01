import { BaseEntity, Entity, Unique, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
  
@Entity({ name: 'User' })
@Unique(['id'])
export class User extends BaseEntity {
    @PrimaryColumn({ nullable: false, type: 'integer'})
    id: number;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    username: string;

    @Column({ nullable: false, type: 'varchar', length: 200 })
    fullname: string;

    @Column({ nullable: true, type: 'varchar', length: 200 })
    refreshtoken: string;

    @Column({ nullable: true, type: 'boolean', default: false })
    tfa_enabled: boolean;

    @Column({ nullable: true,  type: 'varchar', length: 200})
    tfa_code: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ nullable: false, type: 'boolean', default: false })
    tfa_fulfilled: boolean; // MUST BE REMOVED AFTER CREATING DTO


}
