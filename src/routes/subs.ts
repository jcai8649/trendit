import { NextFunction, Request, Response, Router } from "express";
import { isEmpty, validate } from "class-validator";
import { getRepository } from "typeorm";
import path from "path";
import fs from "fs";
import upload from "../util/upload";
import mapErrors from "../util/mapErrors";
import User from "../entities/User";
import Sub from "../entities/Sub";
import auth from "../middleware/auth";
import user from "../middleware/user";
import Post from "../entities/Post";

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  const user: User = res.locals.user;

  try {
    //Validate data
    let errors: any = {};
    if (isEmpty(name)) errors.name = "Name must not be empty";
    if (isEmpty(title)) errors.title = "Title must not be empty";

    const sameSub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (sameSub) errors.name = "Sub exists already";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    //Create new Sub
    const sub = new Sub({ name, description, title, user });
    errors = await validate(sub);
    if (errors.length > 0) {
      return res.status(400).json(mapErrors(errors));
    }

    await sub.save();

    //return Sub
    return res.json(sub);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    const sub = await Sub.findOneOrFail(
      { name },
      { relations: ["joinedUsers"] }
    );

    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ sub: "Sub not found" });
  }
};

const getSubPosts = async (req: Request, res: Response) => {
  const name = req.params.name;
  const currentPage = (req.query.page || 0) as number;
  const postsPerPage = (req.query.count || 8) as number;
  const queryType = (req.query.sort || "top") as string;

  const weekInMiliSec = 604800000 as number;
  const now = new Date() as Date;
  const weekBeforeNow = new Date(now.valueOf() - weekInMiliSec);

  try {
    const sub = await Sub.findOneOrFail({ name });

    let sortBy: string | undefined;

    switch (queryType) {
      case "top":
        sortBy = "votescore";
        break;
      case "new":
        sortBy = "posts.createdAt";
        break;
      case "hot":
        sortBy = "hotness";
        break;
      default:
        sortBy = "votescore";
    }

    const posts = await getRepository(Post)
      .createQueryBuilder("posts")
      .addSelect(
        (sq) => {
          //sort subquery by top (upvotes - downvotes)
          const subquery = sq
            .select("SUM(votes.value)", "post_votecount")
            .from(Post, "post")
            .leftJoin("post.votes", "votes")
            .where("post.id = posts.id")
            .groupBy("post.id");

          //sort subquery by hot (high upvotes based on given week)
          if (queryType === "hot") {
            subquery
              .andWhere(`posts.createdAt > :before`, {
                before: weekBeforeNow.toISOString(),
              })
              .andWhere("votes.value >= 0");
          }

          return subquery;
        },
        queryType === "top" ? "votescore" : "hotness"
      )
      .leftJoinAndSelect("posts.votes", "votes")
      .leftJoinAndSelect("posts.comments", "comments")
      .leftJoinAndSelect("posts.sub", "sub")
      .orderBy(sortBy, "DESC", "NULLS LAST")
      .where("posts.subName = :subName", { subName: sub.name })
      .skip(currentPage * postsPerPage)
      .take(postsPerPage)
      .getMany();

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }

    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ sub: "Sub post not found" });
  }
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;

  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });

    if (sub.moderator !== user.username) {
      return res.status(403).json({ error: "You do not own this sub" });
    }

    res.locals.sub = sub;
    return next();
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  try {
    const type = req.body.type;

    if (type !== "image" && type !== "banner") {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Invalid type" });
    }

    let oldImageUrn: string = "";
    if (type === "image") {
      oldImageUrn = sub.imageUrn || "";
      sub.imageUrn = req.file.filename;
    } else if (type === "banner") {
      oldImageUrn = sub.bannerUrn || "";
      sub.bannerUrn = req.file.filename;
    }

    await sub.save();

    if (oldImageUrn !== "") {
      fs.unlinkSync(path.join("public", "images", oldImageUrn));
    }

    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Something went wrong (uploadSubImage)" });
  }
};

const searchSubs = async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    if (isEmpty(name)) {
      return res.status(400).json({ error: "Name must not be empty" });
    }

    //reactJS, reactjs
    const subs = await getRepository(Sub)
      .createQueryBuilder()
      .where("LOWER(name) LIKE :name", {
        // react => rea
        name: `${name.toLowerCase().trim()}%`,
      })
      .getMany();

    return res.json(subs);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const joinSub = async (req: Request, res: Response) => {
  const name = req.params.name;
  const user = res.locals.user;

  try {
    const subRecord = await Sub.findOneOrFail(
      { name },
      { relations: ["joinedUsers"] }
    );
    if (subRecord.joinedUsers.find((joinedUser) => joinedUser.id === user.id)) {
      throw Error;
    }

    subRecord.joinedUsers.push(user);
    await subRecord.save();

    return res.json(subRecord);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const unJoinSub = async (req: Request, res: Response) => {
  const name = req.params.name;
  const user = res.locals.user;

  try {
    const subRecord = await Sub.findOneOrFail(
      { name },
      { relations: ["joinedUsers"] }
    );

    if (
      !subRecord.joinedUsers.find((joinedUser) => joinedUser.id === user.id)
    ) {
      throw Error;
    }

    subRecord.joinedUsers = subRecord.joinedUsers.filter(
      (joinedUser) => joinedUser.id !== user.id
    );

    await subRecord.save();
    return res.json(subRecord);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();

router.post("/", user, auth, createSub);
router.post("/:name", user, auth, joinSub);
router.delete("/:name", user, auth, unJoinSub);
router.get("/:name", user, getSub);
router.get("/:name/posts", user, getSubPosts);
router.get("/search/:name", searchSubs);
router.post(
  "/:name/image",
  user,
  auth,
  ownSub,
  upload.single("file"),
  uploadSubImage
);

export default router;
