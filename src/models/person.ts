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
  name: "Person",
  description: "A modal for a person.",
  type: UltimateEntityTypes.FULL_PAGE,
  validate: true,
})
export class Person extends BaseEntity {
  @Length(4)
  @Column({ type: "varchar", nullable: false })
  @UltimateEntityField({
    name: "Name",
    type: UltimateEntityFieldTypes.STRING,
    variant: UltimateEntityFieldComponents.INPUT,
    description: "The person name",
  })
  name: string;

  @IsOptional()
  @IsString()
  @Column({ type: "varchar", nullable: true })
  @UltimateEntityField({
    name: "Image",
    type: UltimateEntityFieldTypes.IMAGE,
    description: "The image",
  })
  image: string;

  @IsOptional()
  @IsString()
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
    defaultValue: false,
    name: "Is Profile Public",
    description: "If set to yes, the profile will be visible to anyone.",
  })
  @Column({ type: "bool", default: false })
  isPublic: boolean;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "person");
  }
}
