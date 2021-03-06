import { getRepository } from "typeorm";
import { Router, Request, Response } from "express";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import auth from "../middleware/auth";
import user from "../middleware/user";

const createPost = async (req: Request, res: Response) => {
  const { title, body, inputType, sub } = req.body;

  const user = res.locals.user;

  if (title.trim() === "") {
    return res.status(400).json({ title: "Title must not be empty" });
  }

  try {
    //Find sub
    const subRecord = await Sub.findOneOrFail({ name: sub });

    const post = new Post({
      title,
      body,
      inputType,
      user,
      sub: subRecord,
    });
    await post.save();

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getPosts = async (req: Request, res: Response) => {
  const currentPage = (req.query.page || 0) as number;
  const postsPerPage = (req.query.count || 5) as number;
  const queryType = (req.query.sort || "top") as string;
  const userId = (res.locals.user?.id as number) || undefined;

  const weekInMiliSec = 604800000 as number;
  const now = new Date() as Date;
  const weekBeforeNow = new Date(now.valueOf() - weekInMiliSec);

  try {
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
      .leftJoinAndSelect("sub.joinedUsers", "joinedUsers")
      .orderBy(sortBy, "DESC", "NULLS LAST")
      .where(userId ? "joinedUsers.id = :userId" : "1=1", {
        userId,
      })
      .skip(currentPage * postsPerPage)
      .take(postsPerPage)
      .getMany();

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }

    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  const currentPage = (req.query.page || 0) as number;
  const postsPerPage = (req.query.count || 5) as number;
  const queryType = (req.query.sort || "top") as string;

  const weekInMiliSec = 604800000 as number;
  const now = new Date() as Date;
  const weekBeforeNow = new Date(now.valueOf() - weekInMiliSec);

  try {
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
      .leftJoinAndSelect("sub.joinedUsers", "joinedUsers")
      .orderBy(sortBy, "DESC", "NULLS LAST")
      .skip(currentPage * postsPerPage)
      .take(postsPerPage)
      .getMany();

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }

    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  try {
    const post = await Post.findOneOrFail(
      {
        identifier,
        slug,
      },
      { relations: ["sub", "votes", "comments"] }
    );

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "Something went wrong" });
  }
};

const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body;

  try {
    const post = await Post.findOneOrFail({ identifier, slug });

    const comment = new Comment({
      body,
      user: res.locals.user,
      post,
    });

    await comment.save();

    return res.json(comment);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: "Post not found" });
  }
};

const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const queryType: string = (req.query.sort || "top") as string;
  try {
    const post = await Post.findOneOrFail({ identifier, slug });

    let sortBy: string | undefined;
    let orderDir: "ASC" | "DESC" | undefined;

    switch (queryType) {
      case "top":
        sortBy = "votescore";
        orderDir = "DESC";
        break;
      case "new":
        sortBy = "comments.createdAt";
        orderDir = "DESC";
        break;
      case "old":
        sortBy = "comments.createdAt";
        orderDir = "ASC";
        break;
      default:
        sortBy = "votescore";
        orderDir = "DESC";
    }
    const comments = await getRepository(Comment)
      .createQueryBuilder("comments")
      .addSelect((sq) => {
        //sort subquery by top (upvotes - downvotes)
        return sq
          .select("SUM(votes.value)", "comment_votecount")
          .from(Comment, "comment")
          .leftJoin("comment.votes", "votes")
          .where("comment.id = comments.id")
          .andWhere("votes.value >= 0")
          .groupBy("comment.id");
      }, "votescore")
      // .addSelect("user.imageUrn", "userImageUrl")
      .leftJoinAndSelect("comments.user", "user")
      .leftJoinAndSelect("comments.votes", "votes")
      .leftJoin("comments.post", "post")
      .where("comments.post = :postid", { postid: post.id })
      .orderBy(sortBy, orderDir, "NULLS LAST")
      .getMany();

    if (res.locals.user) {
      comments.forEach((c) => c.setUserVote(res.locals.user));
    }

    return res.json(comments);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();

router.post("/", user, auth, createPost);
router.get("/", user, getPosts);
router.get("/all", user, getAllPosts);
router.get("/:identifier/:slug", user, getPost);
router.post("/:identifier/:slug/comments", user, auth, commentOnPost);
router.get("/:identifier/:slug/comments", user, getPostComments);

export default router;
