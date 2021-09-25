import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Length } from "class-validator";
import Entity from "./Entity";
import User from "./User";
import Post from "./Post";
import { Expose } from "class-transformer";

@TOEntity("subs")
export default class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  @Index()
  @Length(3, 23, { message: "Must be between 3 to 23 characters long" })
  @Column({ unique: true })
  name: string;

  @Column()
  @Length(3, 23, { message: "Must be between 3 to 23 characters long" })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @Column()
  moderator: string;

  @ManyToOne(() => User, (user) => user.moddedSubs)
  @JoinColumn({ name: "moderator", referencedColumnName: "username" })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @ManyToMany(() => User, (user) => user.joinedSubs)
  @JoinTable()
  joinedUsers: User[];

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : `${process.env.APP_URL}/images/sun.png`;
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn
      ? `${process.env.APP_URL}/images/${this.bannerUrn}`
      : undefined;
  }
}
