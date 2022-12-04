import axios from "axios";
import { Forums } from "db";

export async function EditForum_BASE(
  token: string,
  slug: string,
  data: Partial<Forums>
) {
  return axios.post<{ edited: boolean }>(`/api/forum-edit/${slug}/edit`, data, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

export async function ChangeForumBannerImage(
  url: string,
  token: string,
  slug: string
) {
  return axios.post<{ edited: boolean }>(
    `/api/forum-edit/${slug}/banner-image`,
    { url },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function ChangeForumProfileImage(
  url: string,
  token: string,
  slug: string
) {
  return axios.post<{ edited: boolean }>(
    `/api/forum-edit/${slug}/profile-image`,
    { url },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function RemoveBannerImage(token: string, slug: string) {
  return axios.delete<{ edited: boolean }>(
    `/api/forum-edit/${slug}/banner-image/remove`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
}
