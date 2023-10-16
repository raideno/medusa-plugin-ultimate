// src/models/post.ts

import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { BaseEntity } from "@medusajs/medusa";

import { Length, IsOptional, IsString } from "class-validator";

import UltimateEntity from "../decorators/ultimate-entity";
import UltimateEntityField from "../decorators/ultimate-entity-field";
import { UltimateEntityTypes } from "../types/ultimate-entity-types";
import { UltimateEntityFieldTypes } from "../types/ultimate-entity-field-types";
import { UltimateEntityFieldComponents } from "../types/ultimate-entity-field";

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
}

@Entity()
@UltimateEntity({
  type: UltimateEntityTypes.FULL_PAGE,
})
export class Person extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  @UltimateEntityField({
    type: UltimateEntityFieldTypes.STRING,
  })
  name: string;

  @Column({ type: "varchar", nullable: true })
  @UltimateEntityField({
    type: UltimateEntityFieldTypes.IMAGE,
  })
  image: string;

  @Column({ type: "enum", default: Gender.UNKNOWN, enum: Gender })
  @UltimateEntityField({
    name: "Gender",
    type: UltimateEntityFieldTypes.SELECT,
    options: [
      {
        value: Gender.MALE,
        label: "Male",
        description: "Male gender.",
      },
      {
        value: Gender.FEMALE,
        label: "Female",
        description: "Female gender.",
      },
      {
        value: Gender.UNKNOWN,
        label: "Unknown",
        description: "Don't specify / unknown.",
      },
    ],
    description: "The person gender",
  })
  gender: Gender;

  @UltimateEntityField({
    type: UltimateEntityFieldTypes.BOOLEAN,
  })
  @Column({ type: "bool", default: false })
  isPublic: boolean;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "person");
  }
}
