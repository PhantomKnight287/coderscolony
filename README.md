<h1 align="center">

Coders Colony

</h1>

<p align="center">

A platform where developers meeet each other to create awesome things.

</p>

  

## Features

 - Forums(WIP)
 - Customized Profiles
 - 1-1 Chat
 - Blog Posts
 - Markdown Support for Blog posts and POsts in forums


### Forums

A place to talk about a specific topic. for example: flutter,react native etc.

They will have a specific route at `/f/<slug>` where slug is unique and is provided by admin when creating the forum

More routes like `/f/<slug>/settings`, `/f/<slug>/<post>/<id>` etc.
will be come under this directory.

the `slug` is unique for forums.

A forum can have `n` admins,moderators,members and posts.

### Customized Profiles

All user profiles will be available at `/@<username>` and more routes will code under this directory for various tasks.


> more on these features later.


## How to setup this monorepo?

You'll need a `postgresql` database and storage bucket url from supabase. 

### How to get storage bucket url?

Go to [supabase.com](https://app.supabase.com) and create an account or login to your account. Create a new project and open that project.

You'll be greated by a ui like this:

![image](/assets/dashboard.png)

Click on `storage` from sidebar and click on `Create New Bucket` button. Create a bucket with name set to `images` and be sure to make it public. Click on `Create Bucket` and new bucket will be created. Click on Bucket name and click on `Create Folder` and name it anything but without spaces. Click on folder name and upload any file. Click on uploaded file and click on `Copy URL`. The url will look something like this:

```
https://<project id>.supabase.co/storage/v1/object/public/<bucket name>/<folder name>/<image name>.<image extension>
```

remove `/<image name>.<image extension>` and copy the url. Now you've your bucket url.

> **Warning**
> You'll need `pnpm` to run commands in this repo. Run `corepack prepare pnpm@7.14.0 --activate`. This will setup pnpm. It works on any OS.

After Cloning the repo move to the folder. Go to `packages/db` and create `.env` file following the structure of `.env.example`. Follow the same steps in `apps/frontend` and `apps/backend`. 
In `apps/backend`, it requires `SUPABASE_URL`. You can get it from the supabase's project page. Go to settings and click  on `API`. You'll be granted with your project's url and `anon` and `service_role` key. Make sure to use `service_role` in `SUPABASE_SERVICE_KEY` in `apps/backend`. 

Now run `pnpm dev`, This will run the dev server and you'll be able to access the frontend on `http://localhost:3000` and backend at `http://localhost:5000`.


## Commit Convention

Please make sure to follow the commit convention. The commit must start with the scope. For example: `[frontend]`,`[backend]`,`[db]`, followed by a sensible commit message in `present` tense. 

> **Warning**
> Please Don't commit all files in 1 commit. Please make separate commit for each file.