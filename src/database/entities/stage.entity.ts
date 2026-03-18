import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Entity('stages')

export class Stage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'varchar', nullable: true })
    translationKey: string | null;

    @Column({nullable: true})
    minimum_to_achieve: number;

    @Column({nullable: true})
    maximum_to_achieve: number;
}