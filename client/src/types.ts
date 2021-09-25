export interface Post {
  identifier: string;
  title: string;
  body?: string;
  inputType: string;
  slug: string;
  subName: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  sub?: Sub;
  // Virtual fields
  url: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}

export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  moddedSubs: Array<Sub>;
  joinedSubs: Array<Sub>;
  // Virtuals
  imageUrl: string;
}

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  moderator: string;
  posts: Post[];
  joinedUsers: Array<User>;
  // Virtuals
  imageUrl: string;
  bannerUrl: string;
  postCount?: number;
}

export interface Comment {
  identifier: string;
  body: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  post?: Post;
  // Virtuals
  userVote: number;
  voteScore: number;
}
