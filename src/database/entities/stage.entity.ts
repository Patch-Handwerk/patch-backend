import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Entity('stages')

export class Stage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    minimum_to_achieve: number;

    @Column({nullable: true})
    maximum_to_achieve: number;
}