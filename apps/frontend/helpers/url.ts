export const isValidURL = (url: string) => {
  let url_;
  try {
    url_ = new URL(url);
  } catch {
    return false;
  }
  return url_.protocol === "http:" || url_.protocol === "https:";
};
