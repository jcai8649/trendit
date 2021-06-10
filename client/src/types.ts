export interface Post {
  username: string;
  identifier: string;
  title: string;
  body: string;
  slug: string;
  subName: string;
  createdAt: string;
  updatedAt: string;

  //Virtual fields
  url: string;
}
