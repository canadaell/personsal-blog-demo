export type PostStatus = "draft" | "published";

export interface PostFormData {
  title: string;
  type: string;
  sub_type: string;
  summary: string;
  contentHtml: string;
  contentJson: object;
  status: PostStatus;
}

export const contentTypeOptions = [
  { label: "Article", value: "article" },
  { label: "Plog", value: "plog" },
  { label: "Project", value: "project" },
];

export const articleSubTypeOptions = [
  { label: "Tech Notes", value: "tech" },
  { label: "Life", value: "life" },
  { label: "Essay", value: "essay" },
];

export function createDefaultPostFormData(): PostFormData {
  return {
    title: "",
    type: "article",
    sub_type: "tech",
    summary: "",
    contentHtml: "<p></p>",
    contentJson: {},
    status: "published",
  };
}

export function toPostFormData(post: Record<string, unknown>): PostFormData {
  const type = typeof post.type === "string" ? post.type : "article";
  const status = post.status === "draft" ? "draft" : "published";

  return {
    title: typeof post.title === "string" ? post.title : "",
    type,
    sub_type: typeof post.sub_type === "string" ? post.sub_type : "tech",
    summary: typeof post.summary === "string" ? post.summary : "",
    contentHtml: "",
    contentJson: typeof post.content === "object" && post.content ? post.content : {},
    status,
  };
}

export function buildCreatePostPayload(formData: PostFormData) {
  return {
    title: formData.title,
    type: formData.type,
    sub_type: formData.type === "article" ? formData.sub_type : "",
    summary: formData.summary,
    status: formData.status,
    content: formData.contentJson,
    meta: {},
  };
}

export function buildUpdatePostPayload(formData: PostFormData) {
  return {
    title: formData.title,
    type: formData.type,
    sub_type: formData.type === "article" ? formData.sub_type : "",
    summary: formData.summary,
    status: formData.status,
    content: formData.contentJson,
  };
}
